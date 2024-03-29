package info.opc.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import info.opc.models.Media;

import java.util.List;

public interface MediaRepository extends MongoRepository<Media, String> {
    List<Media> findByProductId(String productId);

    void deleteByProductId(String productId);

}
