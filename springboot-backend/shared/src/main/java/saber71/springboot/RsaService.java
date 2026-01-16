package saber71.springboot;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import saber71.springboot.properties.RsaProperties;

@Service
public class RsaService {

  private static final Base64.Decoder base64Decoder = Base64.getDecoder();
  private static final Base64.Encoder base64Encoder = Base64.getEncoder();
  private final PublicKey publicKey;
  private final PrivateKey privateKey;
  private final RsaProperties rsaProperties;

  public RsaService(RsaProperties rsaProperties) {
    this.rsaProperties = rsaProperties;
    try {
      publicKey =
          KeyFactory.getInstance("RSA")
              .generatePublic(
                  new X509EncodedKeySpec(base64Decoder.decode(rsaProperties.getPublicKey())));
      privateKey =
          KeyFactory.getInstance("RSA")
              .generatePrivate(
                  new PKCS8EncodedKeySpec(base64Decoder.decode(rsaProperties.getPrivateKey())));
    } catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
      throw new RuntimeException(e);
    }
  }

  public String getPublicKey() {
    return rsaProperties.getPublicKey();
  }

  public String encrypt(@NonNull String plain) {
    try {
      var cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
      cipher.init(Cipher.ENCRYPT_MODE, publicKey);
      var encrypted = cipher.doFinal(plain.getBytes(StandardCharsets.UTF_8));
      return base64Encoder.encodeToString(encrypted);
    } catch (NoSuchAlgorithmException
        | NoSuchPaddingException
        | InvalidKeyException
        | IllegalBlockSizeException
        | BadPaddingException e) {
      throw new RuntimeException(e);
    }
  }

  public String decrypt(String encrypted) {
    try {
      var cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
      cipher.init(Cipher.DECRYPT_MODE, privateKey);
      var decrypted = cipher.doFinal(base64Decoder.decode(encrypted));
      return new String(decrypted, StandardCharsets.UTF_8);
    } catch (NoSuchAlgorithmException
        | NoSuchPaddingException
        | InvalidKeyException
        | IllegalBlockSizeException
        | BadPaddingException e) {
      throw new RuntimeException(e);
    }
  }
}
