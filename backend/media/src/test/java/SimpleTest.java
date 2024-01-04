/*
 * This is a simple SQL injection vulnerability:
 * SELECT * FROM users WHERE username='admin' AND password='1234'
 */

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SimpleTest {

    private static final String MY_****"MY_SECRET_KEY";

    @Test
    public void alwaysPassingTest() {
        assertTrue(true);
        System.out.println(MY_SECRET_KEY);
    }

    /*
     * @Test
     * public void alwaysFailingTest() {
     * fail();
     * }
     */
}
