package is442g1t3.utils;

import java.security.InvalidKeyException;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CipherUtility {
  private static KeyPairGenerator keyPairGenerator = null;
  private KeyPair keyPair = null;

  private final SecureRandom random = new SecureRandom();

  public KeyPair getKeyPair() {
    return keyPairGenerator.genKeyPair();
  }

  public String encrypt(String content, Key pubKey)
      throws NoSuchAlgorithmException, NoSuchProviderException, NoSuchPaddingException,
      InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    byte[] contentBytes = content.getBytes();
    Cipher cipher = Cipher.getInstance("RSA");
    cipher.init(Cipher.ENCRYPT_MODE, pubKey);
    byte[] cipherContent = cipher.doFinal(contentBytes);
    String encoded = Base64.getEncoder().encodeToString(cipherContent);
    return encoded;
  }

  public String decrypt(String cipherContent, Key privKey)
      throws NoSuchAlgorithmException, NoSuchProviderException, NoSuchPaddingException,
      InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    Cipher cipher = Cipher.getInstance("RSA");
    cipher.init(Cipher.DECRYPT_MODE, privKey);
    byte[] cipherContentBytes = Base64.getDecoder().decode(cipherContent.getBytes());
    byte[] decryptedContent = cipher.doFinal(cipherContentBytes);
    String decoded = new String(decryptedContent);
    return decoded;
  }

  public String encodeKey(Key key) {
    byte[] keyBytes = key.getEncoded();
    String encodedKeyStr = Base64.getEncoder().encodeToString(keyBytes);
    return encodedKeyStr;
  }

  public PublicKey decodePublicKey(String keyStr)
      throws NoSuchAlgorithmException, InvalidKeySpecException {
    byte[] keyBytes = Base64.getDecoder().decode(keyStr);
    X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    PublicKey key = keyFactory.generatePublic(spec);
    return key;
  }

  public PrivateKey decodePrivateKey(String keyStr)
      throws NoSuchAlgorithmException, InvalidKeySpecException {
    byte[] keyBytes = Base64.getDecoder().decode(keyStr);
    PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    PrivateKey key = keyFactory.generatePrivate(keySpec);
    return key;
  }

  public KeyPair getPair() {
    return keyPair;
  }

  @PostConstruct
  private void init() {
    try {
      if (keyPairGenerator == null)
        keyPairGenerator = KeyPairGenerator.getInstance("RSA");
      var keyPair = this.getKeyPair();
      var pubKey = keyPair.getPublic();
      var privKey = keyPair.getPrivate();
      this.keyPair = keyPair;
      log.info("KeyPairGenerator initialized, Public" + this.encodeKey(pubKey));
      log.info(" Private" + this.encodeKey(privKey));
      keyPairGenerator.initialize(1024, random);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

}
