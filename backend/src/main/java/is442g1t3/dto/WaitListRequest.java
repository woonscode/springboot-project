package is442g1t3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WaitListRequest {
  private String email;
  private String destination;
  private String date;
}

