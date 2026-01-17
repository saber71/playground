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

/** RSA加密解密服务类 提供基于RSA算法的加密、解密功能 */
@Service
public class RsaService {

  private static final Base64.Decoder base64Decoder = Base64.getDecoder();
  private static final Base64.Encoder base64Encoder = Base64.getEncoder();
  private final PublicKey publicKey;
  private final PrivateKey privateKey;
  private final RsaProperties rsaProperties;

  /**
   * 构造函数，初始化RSA密钥对
   *
   * @param rsaProperties RSA配置属性对象，包含公钥和私钥信息
   */
  public RsaService(RsaProperties rsaProperties) {
    this.rsaProperties = rsaProperties;
    // 解码并生成RSA公钥和私钥
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

  /**
   * 获取公钥字符串
   *
   * @return 返回Base64编码的公钥字符串
   */
  public String getPublicKey() {
    return rsaProperties.getPublicKey();
  }

  /**
   * 使用RSA公钥加密明文数据
   *
   * @param plain 待加密的明文字符串，不能为空
   * @return 返回Base64编码的加密后密文字符串
   */
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

  /**
   * 使用RSA私钥解密密文数据
   *
   * @param encrypted Base64编码的待解密密文字符串
   * @return 返回解密后的明文字符串
   */
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
      return "";
    }
  }
}
