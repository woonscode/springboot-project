package is442g1t3.dto;

import java.util.HashMap;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDetailsResponse {
  private String username;
  private String[] role;
  private String jwt;



  public HashMap<String, Object> toHashMap() {
    HashMap<String, Object> response = new HashMap<>();
    response.put("username", this.username);
    response.put("role", this.role);
    response.put("jwt", this.jwt);
    return response;
  }
}
