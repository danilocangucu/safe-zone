import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SimpleTest {
    @Test
    public void alwaysPassingTestX() {
        assertTrue(true);
    }

    @Test
    public void alwaysPassingTestXX() {
        assertTrue(true);
    }

    @Test
    public void alwaysFailingTest() {
        fail();
    }

}