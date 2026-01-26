package saber71.springboot;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LabelRepository extends JpaRepository<Label, Long> {
  List<Label> searchByNamespace(String namespace);
}
