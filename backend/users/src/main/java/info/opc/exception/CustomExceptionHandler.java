package info.opc.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;

@ControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex) {
        List<String> errors = ex.getErrors();

        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setMessage("Validation failed");
        errorResponse.setDetails(errors);

        return ResponseEntity.badRequest().body(errorResponse);
    }


}

