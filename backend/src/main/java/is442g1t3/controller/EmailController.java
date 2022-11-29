package is442g1t3.controller;

import java.io.IOException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import is442g1t3.domain.EmailMessage;
import is442g1t3.service.EmailSender;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/user")
@Slf4j

public class EmailController {

  private final EmailSender emailSender;

  public EmailController(EmailSender emailSender) {
    this.emailSender = emailSender;
  }

  @PostMapping("/send-email")
  public ResponseEntity sendEmail(@RequestBody EmailMessage emailMessage) {
    if (emailMessage.getTemplate() != null) {
      try {
        emailSender.sendEmailWithDefaultAttachment(emailMessage.getTo(), emailMessage.getSubject(),
            emailMessage.getTemplate(), emailMessage.getArgs());
      } catch (Exception e) {
        log.error("IO exception for email attachment");
        return ResponseEntity.internalServerError().build();
      }
    } else {
      this.emailSender.sendEmail(emailMessage.getTo(), emailMessage.getSubject(),
          emailMessage.getMessage());
    }
    return ResponseEntity.ok("Success");
  }
}

