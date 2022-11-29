package is442g1t3.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pass {
  @Id
  @JsonProperty
  @Column(unique = true)
  private String passId;
  @JsonProperty
  private String destination;
  @JsonProperty
  private String admissionDetails;
  @JsonProperty
  private String status;
  @JsonProperty
  private double replacementFee;

  @Override
  public String toString() {
    return String.format("Pass - passId : %s, destination : %s", passId, destination);
  }
}
