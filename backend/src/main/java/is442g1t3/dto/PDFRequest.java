package is442g1t3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PDFRequest {
  private String title;
  private String paragraph;
  private String imageBase64;
  private String[] header;
  private String[][] data;
}
