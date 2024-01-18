package info.opc.models;

import jakarta.validation.constraints.*;
import lombok.*;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@AllArgsConstructor
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    @NotNull(message = "Name cannot be null")
    @Size(min=2, max=30, message="Name must be between 2 and 30 characters")
    private String name;
    @NotNull(message = "Description cannot be null")
    @Size(min=2, max=50, message="Description must be between 2 and 50 characters")
    private String description;
    @NotNull(message = "Quantity cannot be null")
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    @Max(value = 9999, message = "Quantity must be less than or equal to 9999")
    private Integer quantity;
    @NotNull(message = "Price cannot be null")
    @Min(value = 0, message = "Price must be greater than or equal to 0")
    @Max(value = 9999, message = "Price must be less than or equal to 9999")
    private Double price;
    @NotNull(message = "userId cannot be null")
    private String userId;
}
