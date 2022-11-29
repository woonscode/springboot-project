package is442g1t3.domain;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class EmailQueue {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private int queueId;
  private String toEmail;
  private String userName;
  private String subject;
  private String message;
  private LocalDate dateQueued;
  private boolean sent;

  public EmailQueue(String to, String userName, String subject) {
    this.toEmail = to;
    this.userName = userName;
    this.subject = subject;
    this.dateQueued = LocalDate.now();
    this.sent = false;
  }

}
