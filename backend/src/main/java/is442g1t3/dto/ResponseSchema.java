package is442g1t3.dto;

import java.util.HashMap;

public class ResponseSchema {
  private Integer status;
  private Object data;
  private String error;

  public ResponseSchema(Integer status) {
    this.status = status;
    this.data = null;
  }

  public ResponseSchema(Integer status, Object data) {
    this.status = status;
    this.data = data;
  }

  public ResponseSchema(Integer status, String error) {
    this.status = status;
    this.error = error;
  }

  // Helper function to format successful response
  public HashMap<String, Object> getSuccessResponse() {
    HashMap<String, Object> response = new HashMap();
    response.put("data", this.data);
    response.put("status", this.status);
    return response;
  }

  // Helper function to format error response
  public HashMap<String, Object> getErrorResponse() {
    HashMap<String, Object> response = new HashMap();
    response.put("error", this.error);
    response.put("status", this.status);
    return response;
  }
}
