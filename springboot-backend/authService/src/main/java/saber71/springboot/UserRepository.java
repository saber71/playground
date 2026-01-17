package saber71.springboot;

import java.util.Optional;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

  @Query(
      """
          select distinct u from User u
          where (:name is null
              or lower(u.name) like lower(concat('%', :name, '%') )
              or lower(u.displayName) like lower(concat('%', :name, '%') ))
              and u.deleted<>true
          """)
  Page<User> search(@Nullable @Param("name") String name, Pageable pageable);

  Optional<User> findUserByName(String name);
}
