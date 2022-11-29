package is442g1t3.domain;

import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int loanId;
  @JsonProperty
  private String borrowerId;
  @JsonProperty
  private List<String> passIds;

  private LocalDate bookingDate;
  private LocalDate loanDate;
  private LocalDate returnDate;
  private boolean collected;
  private boolean returned;

  @Override
  public String toString() {
    return String.format("Loan - id: %d borrowerId: %s passIds: %s", loanId, borrowerId,
        passIds.toString());
  }

}
