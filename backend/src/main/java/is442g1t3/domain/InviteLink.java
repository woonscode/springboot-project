package is442g1t3.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@RequiredArgsConstructor
public class InviteLink {
  @Id
  private String empEmail;
  private String code;

  public InviteLink(String empEmail) {
    this.empEmail = empEmail;
  }

}
