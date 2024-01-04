package info.OPC.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import com.google.cloud.storage.*;

import info.OPC.configs.JwtService;
import info.OPC.models.Media;
import info.OPC.repositories.MediaRepository;
import info.OPC.services.KafkaSender;
import info.OPC.services.MediaService;
import java.util.concurrent.TimeoutException;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import com.google.auth.oauth2.GoogleCredentials;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@RestController
@CrossOrigin
@RequestMapping("/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;
    private final MediaRepository mediaRepository;
    @Autowired
    private final ResourceLoader resourceLoader;
    private final KafkaSender kafkaSender;

    private static final Logger logger = LoggerFactory.getLogger(MediaController.class);
    private Bucket bucket;
    private Storage storage;

    @PostConstruct
    public void init() {
        try {
            Resource resource = resourceLoader.getResource("classpath:buy01-media-firebase.json");

            InputStream serviceAccount = resource.getInputStream();

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("buy01-media.appspot.com")
                    .build();

            FirebaseApp.initializeApp(options);

            this.bucket = StorageClient.getInstance().bucket();
            serviceAccount = resource.getInputStream();
            GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
            this.storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        } catch (IOException e) {
            logger.error("Error initializing Firebase Admin SDK", e);
        }
    }

    // Class level variable to store CompletableFuture objects
    private ConcurrentHashMap<String, CompletableFuture<String>> responseMap = new ConcurrentHashMap<>();

    private String waitForKafkaResponse(String correlationId) throws InterruptedException, TimeoutException {
        CompletableFuture<String> future = new CompletableFuture<>();
        responseMap.put(correlationId, future);

        try {
            // Wait for the response with a timeout, e.g., 30 seconds
            return future.get(30, TimeUnit.SECONDS);
        } catch (TimeoutException e) {
            throw e; // or handle timeout scenario
        } catch (Exception e) {
            throw new InterruptedException("Interrupted while waiting for Kafka response");
        } finally {
            // Clean up
            responseMap.remove(correlationId);
        }
    }

    // Kafka Listener method
    @KafkaListener(topics = "user-product-ownership-ok", groupId = "media-service-group")
    public void handleUserProductOwnership(String message) {
        String[] messageParts = message.split(" ");
        String correlationId = messageParts[0];
        String ownership = messageParts[2];

        // Complete the future when the Kafka message is received
        CompletableFuture<String> future = responseMap.get(correlationId);
        if (future != null) {
            future.complete(ownership);
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @ModelAttribute Media request,
            HttpServletRequest httpRequest) throws TimeoutException {
        try {
            ResponseEntity<String> badRequestResponse = validateFile(file);
            if (badRequestResponse != null)
                return badRequestResponse;

            String productId = request.getProductId();
            String userId = JwtService.getUserIdFromRequest(httpRequest);
            logger.info("mediaUserId: {}", userId);
            logger.info("mediaProductId: {}", productId);

            String correlationId = UUID.randomUUID().toString();
            kafkaSender.send("user-product-ownership", correlationId + " " + userId + " " + productId);

            String ownershipResponse = waitForKafkaResponse(correlationId);
            if (!"true".equals(ownershipResponse)) {
                return new ResponseEntity<>("User is not owner of the product", HttpStatus.FORBIDDEN);
            }

            Media savedFile = saveMedia(file, request);
            return new ResponseEntity<>(savedFile, HttpStatus.OK);
        } catch (IOException | InterruptedException e) {
            logger.error("Error in uploadFile method", e);
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private static ResponseEntity<String> validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("Please select a file!", HttpStatus.BAD_REQUEST);
        }

        if (file.getSize() > 2 * 1024 * 1024) { // 2MB
            return new ResponseEntity<>("File size should not exceed 2MB!", HttpStatus.BAD_REQUEST);
        }

        String fileType = file.getContentType();
        if (!Arrays.asList("image/jpeg", "image/png").contains(fileType)) {
            return new ResponseEntity<>("File type is not supported!", HttpStatus.BAD_REQUEST);
        }
        return null;
    }

    private Media saveMedia(MultipartFile file, Media request) throws IOException {
        String fileName = file.getOriginalFilename();
        assert fileName != null;

        BlobInfo blobInfo = this.bucket.create(fileName, file.getInputStream(), file.getContentType());
        long expiration = TimeUnit.DAYS.toSeconds(365);
        URL signedUrl = this.storage.signUrl(blobInfo, expiration, TimeUnit.SECONDS);

        Media savedInSaveMedia = mediaService.save(request, signedUrl.toString());

        return savedInSaveMedia;
    }

    @GetMapping(value = "/{productId}")
    public ResponseEntity<List<Media>> getMediaByProductId(@PathVariable String productId) {
        List<Media> media = mediaRepository.findByProductId(productId);
        return new ResponseEntity<>(media, HttpStatus.OK);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteMedia(@PathVariable String productId) throws MalformedURLException {
        List<Media> mediaList = mediaRepository.findByProductId(productId);

        for (Media media : mediaList) {
            extractFileNameAndDeleteFromStorage(media);
        }

        mediaRepository.deleteByProductId(productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedia(@PathVariable String id, @RequestParam("file") MultipartFile file, @ModelAttribute Media request) throws IOException {
        Optional<Media> existingMedia = mediaRepository.findById(id);
        if (existingMedia.isEmpty()) {
            return new ResponseEntity<>("Media not found", HttpStatus.NOT_FOUND);
        }

        Media retrievedMedia = existingMedia.get();
        request.setProductId(retrievedMedia.getProductId());
        extractFileNameAndDeleteFromStorage(retrievedMedia);
        Media savedFile = saveMedia(file, request);

        return new ResponseEntity<>(savedFile, HttpStatus.OK);
    }

    private void extractFileNameAndDeleteFromStorage(Media media) throws MalformedURLException {
        String imagePath = media.getImagePath();
        String filename = getFilenameFromImagePath(imagePath);
        BlobId blobId = BlobId.of(bucket.getName(), filename);
        storage.delete(blobId);
    }

    public String getFilenameFromImagePath(String imagePath) throws MalformedURLException {
        URL url = new URL(imagePath);
        String path = url.getPath();
        String filename = path.substring(path.lastIndexOf("/") + 1);
        return URLDecoder.decode(filename, StandardCharsets.UTF_8);
    }
}

