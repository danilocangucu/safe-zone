package info.opc.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import info.opc.models.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
