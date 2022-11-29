package is442g1t3.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentReminderEmailQueue extends EmailQueue {

  @Column
  private Double amount;
  @Column
  private String templateName;

  public PaymentReminderEmailQueue(String to, String userName, String subject, Double amount,
      String templateName) {
    super(to, userName, subject);
    this.amount = amount;
    this.templateName = templateName;
  }

  public PaymentReminderEmailQueue(String to, String userName, String subject, Double amount) {
    this(to, userName, subject, amount, null);
  }
}
