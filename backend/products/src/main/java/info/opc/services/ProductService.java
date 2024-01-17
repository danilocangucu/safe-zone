package info.opc.services;

import org.springframework.stereotype.Service;

import info.opc.models.Product;
import info.opc.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.annotation.KafkaListener;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final KafkaTemplate<String, String> kafkaTemplate; // Kafka Template for sending messages

    public Product save(Product request) {
        var product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .description(request.getDescription())
                .userId(request.getUserId())
                .quantity(request.getQuantity())
                .build();

        return productRepository.save(product);
    }

    public List<Product> findAllFromUser(String userId) {
        return productRepository.findByUserId(userId);
    }

    public void sendDeleteProductMessage(String productId) {
        kafkaTemplate.send("product-deletion-topic", productId);
    }

    public void deleteProductsByUserId(String userId) {
        List<Product> products = findAllFromUser(userId);
        for (Product product : products) {
            // Send a delete message for each product
            sendDeleteProductMessage(product.getId());
            // Delete the product
            productRepository.deleteById(product.getId());
        }
    }

    @KafkaListener(topics = "user-deletion-topic", groupId = "product-service-group")
    public void handleUserDeletion(String userId) {
        deleteProductsByUserId(userId);
    }

    @KafkaListener(topics = "user-product-ownership", groupId = "product-service-group")
    public void handleUserProductOwnership(String message) {
        String[] messageParts = message.split(" ");
        String correlationId = messageParts[0];
        String userId = messageParts[1];
        String productId = messageParts[2];

        boolean isOwner = false;
        List<Product> products = findAllFromUser(userId);
        for (Product product : products) {
            if (product.getId().equals(productId)) {
                isOwner = true;
                break; // Break loop if ownership is confirmed
            }
        }
        // Send response back to Kafka with the correlation ID
        String ownershipResponse = isOwner ? "true" : "false";
        kafkaTemplate.send("user-product-ownership-ok", correlationId + " " + productId + " " + ownershipResponse);
    }
}