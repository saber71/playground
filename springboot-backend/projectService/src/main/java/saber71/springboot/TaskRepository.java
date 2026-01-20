package saber71.springboot;

import java.util.List;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {
  @Query(
      """
    select distinct t from Task t
        join ProjectTask pt on pt.taskId=t.id
            where pt.projectId=:projectId and pt.deleted<>true
    """)
  List<Task> getTasksByProjectId(@Param("projectId") Long projectId);

  boolean existsByName(String name);

  @Query(
      value =
          """
              select distinct t from task t
                                join task_label tl on tl.task_id=t.id
                                join project_task pt on pt.task_id=t.id
              where (:name is null or lower(t.name) like lower(concat('%',:name,'%')))
                  and (:labels is null or cardinality(:labels) = 0  or tl.label_id = any(:labels))
                  and (:status is null or t.status=:status)
                  and (:priority is null or t.priority=:priority)
                  and (:projectId is null or pt.project_id=:projectId)
              """,
      nativeQuery = true)
  Page<Task> search(
      @Nullable @Param("name") String name,
      @Nullable @Param("labels") List<Long> labels,
      @Nullable @Param("status") Task.Status status,
      @Nullable @Param("priority") Task.Priority priority,
      @Nullable @Param("projectId") Long projectId,
      Pageable pageable);
}
