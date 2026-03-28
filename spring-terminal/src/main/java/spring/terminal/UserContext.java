package spring.terminal;

import spring.terminal.entity.UserState;
import spring.terminal.entity.repository.UserStateRepo;

public class UserContext {
  private static UserState state = null;

  public static UserState getState() {
    if (state == null)
      state = SpringContext.getBean(UserStateRepo.class).findById(1L).orElse(new UserState());
    return state;
  }
}
