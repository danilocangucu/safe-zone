package info.opc.validators;
import info.opc.models.UserRole;
import info.opc.models.ValidRole;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RoleValidator implements ConstraintValidator<ValidRole, UserRole> {
    @Override
    public boolean isValid(UserRole value, ConstraintValidatorContext context) {
        if (value == null || value.toString().trim().isEmpty()) {
            return false;
        }
        return value.toString().equals("USER_CLIENT") || value.toString().equals("USER_SELLER");
    }
}



