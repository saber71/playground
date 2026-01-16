package saber71.springboot;

public class UserContext {
  private static final ThreadLocal<Long> context = new ThreadLocal<>();

  public static void setUID(Long uid){
    context.set(uid);
  }

  public static Long getUID(){
    return context.get();
  }

  public static void clear(){
    context.remove();
  }
}
