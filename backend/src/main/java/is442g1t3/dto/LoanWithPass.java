package is442g1t3.dto;

import java.time.LocalDate;
import java.util.List;

import is442g1t3.domain.Pass;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoanWithPass {
  private int loanId;
  private String borrowerId;
  private List<Pass> passes;
  private LocalDate bookingDate;
  private LocalDate loanDate;
  private LocalDate returnDate;
  private boolean collected;
  private boolean returned;

  public Boolean getCollected() {
    return collected;
  }

  public Boolean getReturned() {
    return returned;
  }
}
