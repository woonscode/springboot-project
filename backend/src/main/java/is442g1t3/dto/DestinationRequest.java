package is442g1t3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class DestinationRequest {
  String destination;
  String description;
  String image;

  public DestinationRequest(String destination) {
    this.destination = destination;
  }
}
