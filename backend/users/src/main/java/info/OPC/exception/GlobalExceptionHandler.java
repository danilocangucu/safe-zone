package info.OPC.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String[]> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        // Check if the exception message contains "UserRole"
        if (e.getMessage().contains("UserRole")) {
            return ResponseEntity.badRequest().body(new String[] {"Invalid role. Role must be either USER_CLIENT or USER_SELLER."});
        }
        // If the exception is not related to UserRole, rethrow it
        throw e;
    }
}

