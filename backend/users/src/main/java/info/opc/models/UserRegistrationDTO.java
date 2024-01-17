package info.opc.models;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserRegistrationDTO {
    @NotNull(message = "Name cannot be null")
    @NotBlank(message = "Name cannot be blank")
    @Size(min=1, max=20, message = "Name must be between 1 and 20 characters")
    private String name;

    @NotNull(message = "Email cannot be null")
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Size(min=1, max=40, message = "Email must be between 1 and 40 characters")
    private String email;

    @NotNull(message = "Password cannot be null")
    @NotBlank(message = "Password cannot be blank")
    @Size(min=1, max=20, message = "Password must be between 1 and 20 characters")
    private String password;

    @JsonDeserialize(using = UserRoleDeserializer.class)
    @ValidRole
    private UserRole role;
}

