package info.opc.controllers;

import info.opc.models.User;
import info.opc.repositories.UserRepository;
import info.opc.services.UserService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.kafka.core.KafkaTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class UsersController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/private/users")
    @PermitAll
    public ResponseEntity<?> findUser(
            @RequestHeader("Authorization") String authHeader) {
        String userId = userService.getUserIdFromHeader(authHeader);
        Optional<User> user = userRepository.findById(userId);
        return user.map(u -> {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userId", userId);
            userInfo.put("name", u.getName());
            userInfo.put("email", u.getEmail());
            userInfo.put("role", u.getRole());
            userInfo.put("avatar", u.getAvatar());
            return ResponseEntity.ok(userInfo);
        })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @PutMapping("/private/users")
    private ResponseEntity<Void> putProduct(
            @RequestBody User userUpdate,
            @RequestHeader("Authorization") String authHeader) {
        String userId = userService.getUserIdFromHeader(authHeader);
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        User updatedUser = new User(
                userId,
          userUpdate.getName(),
          userUpdate.getEmail(),
          passwordEncoder.encode(userUpdate.getPassword()),
          userUpdate.getRole(),
          userUpdate.getAvatar()
          );

        userRepository.save(updatedUser);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/private/users/avatar")
    private ResponseEntity<Void> updateAvatar(
            @RequestBody AvatarUpdateDTO avatarUpdate,
            @RequestHeader("Authorization") String authHeader) {
        String userId = userService.getUserIdFromHeader(authHeader);
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        user.setAvatar(avatarUpdate.getAvatar());
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/private/users")
    private ResponseEntity<Void> deleteUser(@RequestHeader("Authorization") String authHeader) {
        String userId = userService.getUserIdFromHeader(authHeader);
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(userId);
        // Send a message to Kafka topic after successful deletion
        kafkaTemplate.send("user-deletion-topic", userId);
        return ResponseEntity.noContent().build();
    }

}
