package info.opc.services;

import info.opc.repositories.MediaRepository;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import info.opc.models.Media;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final GridFsTemplate gridFsTemplate;

    public Media save(Media request, String filePath) throws IOException {
        var media = Media.builder()
                .id(request.getId())
                .imagePath(filePath)
                .productId(request.getProductId())
                .build();

        return mediaRepository.save(media);
    }

    // remove the media from the database
    @KafkaListener(topics = "product-deletion-topic", groupId = "media-group")
    public void delete(String productId) {
        mediaRepository.deleteByProductId(productId);
    }
}
