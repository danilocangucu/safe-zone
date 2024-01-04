import info.OPC.controllers.MediaController;
import info.OPC.models.Media;
import info.OPC.repositories.MediaRepository;
import info.OPC.services.KafkaSender;
import info.OPC.services.MediaService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class MediaControllerTest {

    @Test
    public void uploadFileTest() throws IOException, TimeoutException {
        // Create mock objects
        MediaService mediaService = Mockito.mock(MediaService.class);
        MediaRepository mediaRepository = Mockito.mock(MediaRepository.class);
        ResourceLoader resourceLoader = Mockito.mock(ResourceLoader.class);
        KafkaSender kafkaSender = Mockito.mock(KafkaSender.class);
        HttpServletRequest httpServletRequest = Mockito.mock(HttpServletRequest.class);

        // Create a mock multipart file
        MultipartFile file = new MockMultipartFile("data", "hello.txt", "text/plain", "Hello World".getBytes());

        // Create a mock Media object
        Media media = new Media("id", "path", "productId");
        media.setProductId("product1");

        // Create a MediaController instance and inject the mock objects
        MediaController controller = new MediaController(mediaService, mediaRepository, resourceLoader, kafkaSender);

        // Call the uploadFile method
        ResponseEntity<?> response = controller.uploadFile(file, media, httpServletRequest);

        // Check the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
