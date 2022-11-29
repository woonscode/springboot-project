package is442g1t3.domain;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CollectionReminderEmailQueue extends EmailQueue {

  private String passType;
  private List<String> passIdList;
  private String destinationName;
  private LocalDate loanDate;
  private String templateName;

  public CollectionReminderEmailQueue(String to, String userName, String subject, String passType,
      List<String> passIdList, String destinationName, LocalDate loanDate, String templateName) {
    super(to, userName, subject);
    this.passType = passType;
    this.passIdList = passIdList;
    this.destinationName = destinationName;
    this.loanDate = loanDate;
    this.templateName = templateName;
  }

  public CollectionReminderEmailQueue(String to, String userName, String subject, String passType,
      List<String> passIdList, String destinationName, LocalDate loanDate) {
    this(to, userName, subject, passType, passIdList, destinationName, loanDate, null);
  }
}
