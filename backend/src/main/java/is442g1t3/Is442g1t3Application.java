package is442g1t3;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@Slf4j
public class Is442g1t3Application implements CommandLineRunner {

  private final Environment env;

  public Is442g1t3Application(Environment env) {
    this.env = env;
  }

  @Override
  public void run(String... args) throws Exception {
    log.info("{}", env.getProperty("my.hashSecret"));
  }

  public static void main(String[] args) {
    SpringApplication.run(Is442g1t3Application.class, args);
  }
}
