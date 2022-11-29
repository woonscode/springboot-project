package is442g1t3.domain;

import java.util.List;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReturnReminderEmailQueue extends EmailQueue {
  private String destinationName;
  private String nextUserName;
  private String nextUserName2;
  private List<String> nextUserPassIdList;
  private List<String> nextUserPassIdList2;
  private List<String> gopPassIdList;
  private String templateName;

  public ReturnReminderEmailQueue(String to, String userName, String subject, String destinationName, String nextUserName, List<String> nextUserPassIdList, String nextUserName2, List<String> nextUserPassIdList2, List<String> gopPassIdList, String templateName) {
    super(to, userName, subject);
    this.destinationName = destinationName;
    this.nextUserName = nextUserName;
    this.nextUserPassIdList = nextUserPassIdList;
    this.nextUserName2 = nextUserName2;
    this.nextUserPassIdList2 = nextUserPassIdList2;
    this.gopPassIdList = gopPassIdList;
    this.templateName = templateName;
  }

  public ReturnReminderEmailQueue(String to, String userName, String subject, String destinationName, String nextUserName, List<String> nextUserPassIdList, String nextUserName2, List<String> nextUserPassIdList2, List<String> gopPassIdList) {
    this(to, userName, subject, destinationName, nextUserName, nextUserPassIdList, nextUserName2, nextUserPassIdList2, gopPassIdList,"");
  }

}
