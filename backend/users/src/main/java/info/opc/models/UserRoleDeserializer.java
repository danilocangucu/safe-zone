package info.opc.models;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

public class UserRoleDeserializer extends JsonDeserializer<UserRole> {
    @Override
    public UserRole deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        if (value.equalsIgnoreCase("CLIENT")) {
            return UserRole.USER_CLIENT;
        } else if (value.equalsIgnoreCase("SELLER")) {
            return UserRole.USER_SELLER;
        } else {
            throw new JsonParseException(p, "Invalid role. Role must be either USER_CLIENT or USER_SELLER.");
        }
    }
}


