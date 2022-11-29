package is442g1t3.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

// Requirement 3b: Administrator is able to 'amend all email and letter templates'
@RestController
public class TemplateController {

  private static final org.slf4j.Logger log =
      org.slf4j.LoggerFactory.getLogger(LoanController.class);

  @GetMapping(value = "/user/templates/{name}")
  public byte[] loans(@PathVariable("name") String name) {
    log.info("Sending raw template: {}", name);
    File f = new File("templates/" + name);
    if (f.exists()) {
      try {
        return Files.readAllBytes(Path.of("templates/" + name));
      } catch (IOException e) {
        log.error("IO Exception: " + e.getMessage());
        return null;
      }
    } else {
      log.info("File not found!");
      return null;
    }
  }

  @PostMapping(value = "/user/templates/")
  public String uploadTemplate(@RequestParam("file") MultipartFile multipartFile)
      throws IOException {
    multipartFile.transferTo(Path.of("templates/" + multipartFile.getOriginalFilename()));
    log.info("Saved uploaded template file: " + multipartFile.getOriginalFilename());
    return "success";
  }

}
