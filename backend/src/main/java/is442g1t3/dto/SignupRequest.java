package is442g1t3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupRequest {
  private String email;
  private String name;
  private String userName;
  private String phoneNo;
  private String passwordEnc;

  // Get Id from email
  public String getEmpId() {
    return email.substring(0, email.indexOf("@"));
  }
}
