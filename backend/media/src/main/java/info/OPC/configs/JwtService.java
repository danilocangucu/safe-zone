package info.OPC.configs;

import java.util.Date;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import javax.crypto.KeyGenerator;
import java.security.NoSuchAlgorithmException;

@Service
public class JwtService {
    private static SecretKey generateSecretKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(128); // Key size
        return keyGenerator.generateKey();
    }

    private static final String SECRET_KEY;

    static {
        try {
            SECRET_KEY = String.valueOf(generateSecretKey());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public static String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public static String extractUserId(String token) {
        return extractClaim(token, Claims::getId);
    }

    public static <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public static String extractTokenFromRequestHeader(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        return authHeader.substring(7);
    }

    public static boolean isTokenValid(String token) {
        return !isTokenExpired(token);
    }

    public static boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private static Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private static Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private static SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public enum ExtractType {
        SUBJECT,
        USER_ID,

        TOKEN_VALIDITY,
    }

    public static Object getValueFromServlet(HttpServletRequest request, ExtractType type) {
        String token = JwtService.extractTokenFromRequestHeader(request);
        return switch (type) {
            case SUBJECT -> JwtService.extractSubject(token);
            case USER_ID -> JwtService.extractUserId(token);
            case TOKEN_VALIDITY -> JwtService.isTokenValid(token);
        };
    }

    public static String getUserIdFromRequest(HttpServletRequest request) {
        if (!(Boolean) JwtService.getValueFromServlet(request, JwtService.ExtractType.TOKEN_VALIDITY)) {
            return null;
        }
        String id = (String) JwtService.getValueFromServlet(request, JwtService.ExtractType.USER_ID);
        return id.isEmpty() ? null : id;
    }


}
