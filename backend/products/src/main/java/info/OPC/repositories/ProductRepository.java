package info.OPC.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import info.OPC.models.Product;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    boolean existsByIdAndUserId(String id, String userId);
    void deleteAllByUserId(String userId);

    List<Product> findByUserId(String userId);
}
