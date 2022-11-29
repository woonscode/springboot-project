package is442g1t3.security;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.filter.GenericFilterBean;
import is442g1t3.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@RequiredArgsConstructor
@Slf4j
public class CustomFilter extends GenericFilterBean {

  private String hashSecret;
  @Autowired
  private JwtService jwtService;

  @Override
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
      throws IOException, ServletException {
    var request = (HttpServletRequest) req;
    var response = (HttpServletResponse) res;

    // // Adding CORS headers
    response.addHeader("Access-Control-Allow-Credentials", "true");
    response.addHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET, DELETE, PUT");
    response.addHeader("Access-Control-Max-Age", "3600");
    response.addHeader("Access-Control-Allow-Headers",
        "x-requested-with, Authorization, Content-Type,Accept, authorization, credential, X-XSRF-TOKEN");

    // Access path prefix
    String access = request.getRequestURI().split("/")[1];
    // If access is "auth", change to ""
    if (access.equals("auth")) {
      access = "";
    }
    log.info("Access: " + access);
    String authHeader = request.getHeader("Authorization");
    try {
      if (access != "") {
        log.info(authHeader);
        checkAccess(authHeader, access);
      }
      log.info("Continue");
      chain.doFilter(req, res);
      log.info("Done");
    } catch (Exception e) {
      // Initialise a new response with error Message
      response.setStatus(401);
      // Get write to write to response in JSON
      response.setContentType("application/json");
      response.setCharacterEncoding("UTF-8");
      response.getWriter()
          .write("{\"error\": \"" + e.getMessage() + "\"" + "," + "\n\"status\": \"401\"}");
    }
  }


  private boolean checkAccess(String jwt, String role) {
    if (role.equals("")) {
      return true;
    }

    log.info("Checking access");
    String jwtFormatted = jwt.replace("Bearer ", "");
    try {
      jwtService.validateJwt(jwtFormatted, role, this.hashSecret);
      return true;
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

}

