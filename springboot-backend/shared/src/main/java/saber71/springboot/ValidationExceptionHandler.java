package saber71.springboot;

import java.util.HashMap;
import java.util.Map;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** 全局异常处理器，用于处理方法参数验证异常 */
@RestControllerAdvice
public class ValidationExceptionHandler {
  /**
   * 处理方法参数验证异常
   *
   * @param exception 方法参数验证异常对象，包含验证失败的详细信息
   * @return 返回包含验证错误字段和消息的Map，状态码为400 Bad Request
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(
      @NonNull MethodArgumentNotValidException exception) {
    Map<String, String> map = new HashMap<>();

    // 遍历所有验证错误，提取字段名和错误消息
    for (ObjectError error : exception.getBindingResult().getAllErrors()) {
      var fieldName = ((FieldError) error).getField();
      map.put(fieldName, error.getDefaultMessage());
    }
    return ResponseEntity.badRequest().body(map);
  }
}
