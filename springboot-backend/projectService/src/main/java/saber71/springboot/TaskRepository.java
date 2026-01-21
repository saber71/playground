package saber71.springboot;

import java.util.List;
import java.util.Map;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {
  @Query(
      value =
          """
                  select  t.*,
                     pt.project_id AS project_id,
                     coalesce(array_agg(tl.label_id) filter ( where tl.label_id is not null ), array[]::bigint[]) as label_ids,
                     coalesce(array_agg(l.name) filter ( where l.name is not null ), array[]::varchar[]) as labels
                  from springboot_backend.task t
                  left join springboot_backend.task_label tl on tl.task_id=t.id and tl.deleted<>true
                  left join springboot_backend.project_task pt on pt.task_id=t.id and pt.deleted<>true
                  left join springboot_backend.label l on tl.label_id=l.id
                  where t.id=:id and t.deleted<>true
                  group by t.id, pt.project_id
              """,
      nativeQuery = true)
  Map<String, Object> findOne(@Param("id") Long id);

  boolean existsByName(String name);

  @Query(
      value =
          """
                select t.*,
                       array_agg(tl.label_id) as label_ids,
                       array_agg(l.name) as labels,
                       pt.project_id as project_id
                from springboot_backend.task t
                join springboot_backend.task_label tl on tl.task_id=t.id and tl.deleted<>true
                join springboot_backend.project_task pt on pt.task_id=t.id and pt.deleted<>true
                join springboot_backend.label l on tl.label_id=l.id
                where lower(t.name) like lower(concat('%',:name,'%'))
                    and (array_length(coalesce(:labels,array[]::bigint[]), 1) is null  or tl.label_id = any(coalesce(:labels,array[]::bigint[])))
                    and (cast(:status as smallint) is null or t.status=:status)
                    and (cast(:priority as smallint) is null or t.priority=:priority)
                    and (cast(:projectId as bigint) is null or pt.project_id=:projectId)
                    and t.deleted<>true
                group by t.id, pt.project_id
              """,
      nativeQuery = true)
  Page<TaskVO> search(
      @Param("name") String name,
      @Nullable @Param("labels") List<Long> labels,
      @Nullable @Param("status") Task.Status status,
      @Nullable @Param("priority") Task.Priority priority,
      @Nullable @Param("projectId") Long projectId,
      Pageable pageable);
}
