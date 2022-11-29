package is442g1t3.service;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import is442g1t3.domain.JWT;
import is442g1t3.domain.Role;
import is442g1t3.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {

  private final UserService userService;

  public Key getHMACKey(String secret) {
    return new SecretKeySpec(Base64.getDecoder().decode(secret),
        SignatureAlgorithm.HS256.getJcaName());
  }

  public String generateJwt(JWT jwt, String secret) {
    Instant now = Instant.now();
    // Concatenate the roles into a single string
    log.info(jwt.getUsername());
    return Jwts.builder().setId(UUID.randomUUID().toString()).setSubject(jwt.getUsername())
        .claim("id", jwt.getUsername()).setIssuedAt(Date.from(now))
        .setExpiration(Date.from(now.plus(600, ChronoUnit.MINUTES))).signWith(getHMACKey(secret))
        .compact();
  }

/**
 * Parses the JWT and converts it into its claims to be used in other functions
 * @return claims associated with the JWT
 */

  public Jws<Claims> parseJwt(String jwt, String secret) {
    // Format String to remove Bearer
    return Jwts.parserBuilder().setSigningKey(getHMACKey(secret)).build().parseClaimsJws(jwt);
  }

  public Boolean validateJwt(String jwtString, String role, String secret) {
    // Auth Route allow all
    if (role.equals("")) {
      return true;
    }
    role = role.toLowerCase();
    Jws<Claims> jwt = parseJwt(jwtString, secret);

    // Check if the JWT has expired
    if (jwt.getBody().getExpiration().before(new Date())) {
      throw new RuntimeException("JWT has expired");
    }

    // Get user id from jwt
    String id = this.getId(jwtString, secret);

    // Get user from userService
    User user = userService.getUser(id);
    if (user == null) {
      throw new RuntimeException("User not found");
    }

    if (user.getRoles().contains(new Role(role))) {
      return true;
    } else {
      throw new RuntimeException("User does not have role");
    }
  }

  // Get id from JWT
  public String getId(String jwtString, String secret) {
    Jws<Claims> jwt = parseJwt(jwtString, secret);
    return jwt.getBody().get("id", String.class);
  }

  // Get user from JWT
  public User getUser(String jwtString, String secret) {
    String id = this.getId(jwtString, secret);
    return userService.getUser(id);
  }

/**
 * Checks whether the user details in the JWT is an administrator or if it is the expected user
 * @return boolean, true if user is validated, false if not
 */

  // Check if user is admin or self
  public Boolean validateAdminOrSelf(String jwtString, String id, String secret) {
    // Remove Bearer
    jwtString = jwtString.replace("Bearer ", "");
    log.info("Validate Admin or Self" + jwtString);

    // Check if user is admin
    try {
      validateJwt(jwtString, "admin", secret);
      return true;
    } catch (Exception e) {
      log.error("Not admin");
    }

    log.info("THIS JWT: " + this.getId(jwtString, secret));
    // Check if user is self
    try {
      validateJwt(jwtString, "", secret);
      String jwtId = this.getId(jwtString, secret);
      log.info("THIS JWT: " + jwtId);
      if (jwtId.equals(id)) {
        return true;
      }
    } catch (Exception e) {
      log.error("Not self");
    }

    return false;
  }
}
