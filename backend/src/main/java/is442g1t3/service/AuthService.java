package is442g1t3.service;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.springframework.stereotype.Service;
import is442g1t3.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
  private final PasswordService passwordService;
  private final UserService userService;

  public User addPassword(String empId, String passwordEnc)
      throws InvalidKeyException, NoSuchAlgorithmException, NoSuchProviderException,
      NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
    log.info("empId: " + empId);
    log.info("passwordEnc: " + passwordEnc);
    try {
      User user = userService.getUser(empId);
      if (passwordService.passwordExists(user)) {
        log.info("Password Exists");
        return loginUser(empId, passwordEnc);
      }
      if (user != null && passwordService.storePasswordHash(user, passwordEnc)) {
        return user;
      } else {
        return null;
      }
    } catch (RuntimeException e) {
      log.info("Error adding password for user " + empId + ": " + e.getMessage());
      throw e;
    }
  }

  public User loginUser(String empId, String passwordEnc)
      throws InvalidKeyException, NoSuchAlgorithmException, NoSuchProviderException,
      NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
    User user = userService.getUser(empId);
    log.info("Auth Service User: " + user);
    if (user != null && passwordService.checkPassword(user, passwordEnc)) {
      return user;
    } else {
      return null;
    }
  }

}
