package spring.terminal;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JsonEntityRepository extends JpaRepository<JsonEntity, Long> {}
