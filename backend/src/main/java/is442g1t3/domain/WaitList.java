package is442g1t3.domain;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

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
public class WaitList {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer waitListId;
  private String email;
  private String destination;
  private LocalDate date;

  public WaitList(String email, String destination, String date) {
    this.email = email;
    this.destination = destination;
    DateTimeFormatter formatters = DateTimeFormatter.ofPattern("dd/MM/uuuu");
    LocalDate localDate = LocalDate.parse(date, formatters);
    this.date = localDate;
  }

}
