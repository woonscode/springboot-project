package is442g1t3.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordHash {
  @Id
  private String hash;

  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "empId", referencedColumnName = "empId", nullable = false)
  private User user;

  public String findByUser(User user) {
    return this.hash;
  }
}
