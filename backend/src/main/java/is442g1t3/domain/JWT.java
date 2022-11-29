package is442g1t3.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JWT {
  private String username;
  private int validityInMinutes;
  private String[] roles;
}
