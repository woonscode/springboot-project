package is442g1t3.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class LoginRequest {
  @JsonProperty("email")
  String email;
  @JsonProperty("password")
  String passwordEnc;

  public String getEmpId() {
    return email.substring(0, email.indexOf("@"));
  }
}
