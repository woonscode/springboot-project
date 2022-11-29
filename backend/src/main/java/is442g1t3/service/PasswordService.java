package is442g1t3.service;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.slf4j.Logger;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import is442g1t3.domain.PasswordHash;
import is442g1t3.domain.User;
import is442g1t3.repository.PasswordHashRepo;
import is442g1t3.repository.UserRepo;
import is442g1t3.utils.CipherUtility;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PasswordService {
  private final PasswordHashRepo passwordHashRepo;
  private final UserRepo userRepo;
  private final CipherUtility cipherUtility;

  private int strength = 10;

  public boolean storePasswordHash(User user, String passwordEnc)
      throws InvalidKeyException, NoSuchAlgorithmException, NoSuchProviderException,
      NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
    try {
      String passwordDec = this.decryptRSA(passwordEnc);
      String hashedPasString = BCrypt.hashpw(passwordDec, BCrypt.gensalt(strength));
      log.info("PasswordService (user,passwordEnc) " + user + " " + hashedPasString);
      passwordHashRepo.save(new PasswordHash(hashedPasString, user));
      log.info(
          "Password hash stored for user " + user.getUsername() + " with hash " + hashedPasString);
      return true;
    } catch (RuntimeException e) {
      log.error(
          "Error storing password hash for user " + user.getUsername() + ": " + e.getMessage());
      return false;
    }
  }

  public boolean checkPassword(User user, String passwordEnc)
      throws InvalidKeyException, NoSuchAlgorithmException, NoSuchProviderException,
      NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
    if (passwordHashRepo.findByUser(user) != null) {
      String passwordDec = this.decryptRSA(passwordEnc);
      String storedHash = passwordHashRepo.findByUser(user).getHash();
      return BCrypt.checkpw(passwordDec, storedHash);
    } else {
      return false;
    }
  }

  private String decryptRSA(String passwordEnc)
      throws InvalidKeyException, NoSuchAlgorithmException, NoSuchProviderException,
      NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
    log.info(cipherUtility.getPair().getPrivate().toString());
    return cipherUtility.decrypt(passwordEnc, cipherUtility.getPair().getPrivate());
  }

  // Check if password exists
  public boolean passwordExists(User user) {
    try {
      if (user != null && passwordHashRepo.findByUser(user) != null) {
        log.info("Password Exists");
        return true;
      } else {
        return false;
      }
    } catch (RuntimeException e) {
      log.error(
          "Error checking if password exists for user " + user.getEmpId() + ": " + e.getMessage());
      throw e;
    }
  }

}
