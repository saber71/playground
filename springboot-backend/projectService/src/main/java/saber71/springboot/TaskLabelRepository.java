package saber71.springboot;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskLabelRepository extends JpaRepository<TaskLabel, Long> {}
