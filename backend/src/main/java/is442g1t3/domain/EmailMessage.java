package is442g1t3.domain;

import java.util.HashMap;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EmailMessage {
  private String to;
  private String subject;
  private String message;
  private String template;
  private HashMap<String, String> args;
}
