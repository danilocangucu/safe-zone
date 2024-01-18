import info.opc.configs.JwtService;
import info.opc.models.User;
import info.opc.models.UserRole;
import info.opc.repositories.UserRepository;
import info.opc.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceTest.class);

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        // Example setup if needed
    }

    @Test
    public void getUserIdFromHeader_WhenUserExists() {
        String fakeToken = "Bearer abcdef";
        String expectedUserId = "12345";
        String userEmail = "test@example.com";
        UserRole role = UserRole.USER_CLIENT;
        String avatar = "defaultAvatar.png";
        User mockUser = new User("12345", "John Doe", "john.doe@example.com", "password123", role, avatar);
        mockUser.setId(expectedUserId);

        when(jwtService.extractSubject(fakeToken.substring(7))).thenReturn(mockUser.getEmail());
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        String userId = userService.getUserIdFromHeader(fakeToken);

        assertNotNull(userId);
        assertEquals(expectedUserId, userId);
        logger.info("User ID retrieved successfully for email '{}'", userEmail);
    }

    @Test
    public void getUserIdFromHeader_WhenUserDoesNotExist() {
        String fakeToken = "Bearer abcdef";
        String userEmail = "nonexistent@example.com";

        when(jwtService.extractSubject(fakeToken.substring(7))).thenReturn(userEmail);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        String userId = userService.getUserIdFromHeader(fakeToken);

        assertNull(userId);
        logger.info("No user found for email '{}'", userEmail);
    }
}
