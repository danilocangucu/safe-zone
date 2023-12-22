package info.OPC.models;
import info.OPC.validators.RoleValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = RoleValidator.class)
public @interface ValidRole {
    String message() default "Role must be either USER_CLIENT or USER_SELLER";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
