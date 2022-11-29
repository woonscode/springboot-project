package is442g1t3.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DigitalPass extends Pass {
  // Placeholder: changed the name from "passId" in the diagram
  @JsonProperty
  private String digitalPassId;
}
