import info.opc.models.Media;
import info.opc.repositories.MediaRepository;
import info.opc.services.KafkaSender;
import info.opc.services.MediaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.io.IOException;

@ExtendWith(MockitoExtension.class)
public class ServicesTest {

    private static final Logger logger = LoggerFactory.getLogger(ServicesTest.class);

    // Mocks for KafkaSenderTest
    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private KafkaSender kafkaSender;

    // Mocks for MediaServiceTest
    @Mock
    private MediaRepository mediaRepository;

    @Mock
    private GridFsTemplate gridFsTemplate;

    @InjectMocks
    private MediaService mediaService;

    @Test
    public void testKafkaSend() {
        String topic = "testTopic";
        Object message = new Object();

        kafkaSender.send(topic, message);

        verify(kafkaTemplate).send(topic, message);
        logger.info("Sent message to topic '{}'", topic);
    }

    @Test
    public void testMediaSave() throws IOException {
        String id = "123";
        String filePath = "test/path";
        String productId = "p123";

        Media mockMedia = new Media(id, filePath, productId);

        when(mediaRepository.save(any(Media.class))).thenReturn(mockMedia);

        Media savedMedia = mediaService.save(mockMedia, filePath);

        verify(mediaRepository).save(any(Media.class));
        logger.info("Saved media with ID '{}'", savedMedia.getId());
    }

    @Test
    public void testMediaDelete() {
        String productId = "p123";

        mediaService.delete(productId);

        verify(mediaRepository).deleteByProductId(productId);
        logger.info("Deleted media for product ID '{}'", productId);
    }
}
