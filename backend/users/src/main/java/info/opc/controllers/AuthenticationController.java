package info.opc.controllers;

import info.opc.models.UserRegistrationDTO;
import info.opc.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import info.opc.auth.AuthenticationRequest;
import info.opc.auth.AuthenticationResponse;
import info.opc.auth.AuthenticationService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/public")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody UserRegistrationDTO registrationDTO,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            return createAndSendErrorResponse(bindingResult);
        }
        if (userRepository.findByEmail(registrationDTO.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.register(registrationDTO));
    }


    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @Valid @RequestBody AuthenticationRequest request,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            return createAndSendErrorResponse(bindingResult);
        }
        try {
            AuthenticationResponse response = service.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    private ResponseEntity<List<String>> createAndSendErrorResponse(BindingResult bindingResult) {
        List<String> errors = bindingResult.getAllErrors()
                .stream()
                .map(ObjectError::getDefaultMessage)
                .collect(Collectors.toList());
        return ResponseEntity.badRequest().body(errors);
    }
}
