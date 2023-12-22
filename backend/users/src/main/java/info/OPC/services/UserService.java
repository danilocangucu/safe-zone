package info.OPC.services;

import info.OPC.configs.JwtService;
import info.OPC.models.User;
import info.OPC.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public String getUserIdFromHeader(String authHeader) {
        String userEmail = jwtService.extractSubject(authHeader.substring(7));
        Optional<User> user = userRepository.findByEmail(userEmail);
        return user.map(User::getId).orElse(null);
    }
}
