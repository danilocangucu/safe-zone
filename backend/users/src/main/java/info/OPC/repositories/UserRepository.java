package info.OPC.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import info.OPC.models.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
