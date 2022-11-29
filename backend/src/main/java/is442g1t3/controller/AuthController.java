package is442g1t3.controller;

import org.springframework.web.bind.annotation.RestController;

import is442g1t3.domain.InviteLink;
import is442g1t3.domain.JWT;
import is442g1t3.domain.User;
import is442g1t3.dto.LoginRequest;
import is442g1t3.dto.ResponseSchema;
import is442g1t3.dto.SignupRequest;
import is442g1t3.dto.UserDetailsResponse;
import is442g1t3.service.AuthService;
import is442g1t3.service.InviteLinkService;
import is442g1t3.service.JwtService;
import is442g1t3.service.UserService;
import is442g1t3.utils.CipherUtility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
  private final JwtService jwtService;
  private final UserService userService;
  private final AuthService authService;
  private final CipherUtility cipherUtility;
  private final InviteLinkService inviteLinkService;

  @Value("${my.secretkey}")
  private String secretKey;

  // Sample Response Format

  @GetMapping(value = "/testResponse/{bool}")
  public ResponseEntity<HashMap<String, Object>> test(@PathVariable boolean bool) {
    ResponseEntity<HashMap<String, Object>> response;
    if (!bool) {
      response = ResponseEntity.status(401)
          .body(new ResponseSchema(401, "Invalid Request Params").getErrorResponse());
    } else {
      response = ResponseEntity.status(200)
          .body(new ResponseSchema(200, (Object) "Valid Request").getSuccessResponse());
    }
    return response;
  }

  @PostMapping("/signup")
  public ResponseEntity<HashMap<String, Object>> signup(@RequestBody SignupRequest signupRequest) {
    User user;
    ResponseEntity<HashMap<String, Object>> response;
    try {
      user = new User(signupRequest.getEmpId(), signupRequest.getEmail(),
          signupRequest.getUserName(), signupRequest.getPhoneNo(), signupRequest.getName());
      userService.saveUser(user);

      // Manually encrypt the password first - will be done at freontend
      String pwEnc = cipherUtility.encrypt(signupRequest.getPasswordEnc(),
          cipherUtility.getPair().getPublic());
      log.info("Encrypted password: " + pwEnc);
      user = authService.addPassword(signupRequest.getEmpId(), pwEnc);
      log.info("User: " + user);

      if (user != null) {
        // Remove from invite link
        inviteLinkService.deleteInviteLink(signupRequest.getEmail());
        JWT jwt = new JWT(user.getEmpId(), 60, user.getRoleArray());

        response = ResponseEntity.status(200)
            .body(new ResponseSchema(200, new UserDetailsResponse(user.getEmpId(),
                user.getRoleArray(), jwtService.generateJwt(jwt, secretKey)).toHashMap())
                    .getSuccessResponse());
      } else {
        response = ResponseEntity.status(401)
            .body(new ResponseSchema(401, "Invalid Request Params").getErrorResponse());
      }
    } catch (Exception e) {
      response = ResponseEntity.status(402)
          .body(new ResponseSchema(402, e.getMessage()).getErrorResponse());
      e.printStackTrace();
    }
    return response;
  }

  @PostMapping("/login")
  public ResponseEntity<HashMap<String, Object>> login(@RequestBody LoginRequest loginRequest) {
    User user;
    ResponseEntity<HashMap<String, Object>> response;
    try {
      String pwEnc =
          cipherUtility.encrypt(loginRequest.getPasswordEnc(), cipherUtility.getPair().getPublic());
      user = authService.loginUser(loginRequest.getEmpId(), pwEnc);

      log.info("User Controller " + user);
      if (user != null) {
        JWT jwt = new JWT(user.getEmpId(), 60, user.getRoleArray());

        response = ResponseEntity.status(200)
            .body(new ResponseSchema(200, new UserDetailsResponse(user.getEmpId(),
                user.getRoleArray(), jwtService.generateJwt(jwt, secretKey)).toHashMap())
                    .getSuccessResponse());
      } else {
        response = ResponseEntity.status(401)
            .body(new ResponseSchema(401, "Invalid Request Params").getErrorResponse());
      }
    } catch (Exception e) {
      response = ResponseEntity.status(402)
          .body(new ResponseSchema(402, e.getMessage()).getErrorResponse());
      e.printStackTrace();
    }
    return response;
  }

  @PostMapping("/checkEmail")
  public ResponseEntity<HashMap<String, Object>> checkEmail(@RequestBody InviteLink email) {
    log.info(email.getEmpEmail());
    try {
      if (inviteLinkService.generateInviteLinkAndSendEmail(email.getEmpEmail())) {
        return ResponseEntity.status(200)
            .body(new ResponseSchema(200, (Object) "Check your inbox").getSuccessResponse());
      } else {
        return ResponseEntity.status(401)
            .body(new ResponseSchema(401, "Something went wrong").getErrorResponse());
      }
    } catch (Exception e) {
      return ResponseEntity.status(402)
          .body(new ResponseSchema(402, e.getMessage()).getErrorResponse());
    }
  }

  @GetMapping("/retrieveEmail/{code}")
  public ResponseEntity<HashMap<String, Object>> retrieveEmail(@PathVariable String code) {
    try {
      String email = inviteLinkService.getEmailFromInviteCode(code);
      if (email != null) {
        return ResponseEntity.status(200)
            .body(new ResponseSchema(200, (Object) email).getSuccessResponse());
      } else {
        return ResponseEntity.status(401)
            .body(new ResponseSchema(401, "Invite Link is not valid").getErrorResponse());
      }
    } catch (Exception e) {
      return ResponseEntity.status(402)
          .body(new ResponseSchema(402, e.getMessage()).getErrorResponse());
    }
  }
}
