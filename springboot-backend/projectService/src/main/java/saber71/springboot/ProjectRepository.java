package saber71.springboot;

import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {
  @Query(
      """
          select distinct p from Project p
              where (:name is null or lower(p.name) like lower(concat('%', :name, '%') ) )
                  and (:archive is null or p.archive=:archive)
                  and (:status is null or p.status=:status)
          and p.deleted<>true
          """)
  Page<Project> search(
      @Nullable @Param("name") String name,
      @Nullable @Param("archive") Boolean archive,
      @Nullable @Param("status") Project.Status status,
      Pageable pageable);

  boolean existsByName(String name);
}
