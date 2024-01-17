package info.opc.models;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@AllArgsConstructor
@Document(collection = "media")
public class Media {
    @Id
    private String id;
    @NotNull
    private String imagePath;
    @NotNull
    private String productId;
}
