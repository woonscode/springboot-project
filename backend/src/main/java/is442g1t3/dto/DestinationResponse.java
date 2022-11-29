package is442g1t3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DestinationResponse {
  String destination;
  String description;
  String imageBase64;
}
