package spring.terminal.entity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import spring.terminal.entity.UserState;

public interface UserStateRepo extends JpaRepository<UserState, Long> {}
