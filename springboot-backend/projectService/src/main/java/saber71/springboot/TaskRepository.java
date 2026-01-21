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
value = """
select t.*,
       array_agg(tl.label_id) as label_ids,
       array_agg(l.name) as labels,
       pt.project_id as project_id
    from task t
    join task_label tl on tl.task_id=t.id and tl.deleted<>true
    join project_task pt on pt.task_id=t.id and pt.deleted<>true
    join labels l on tl.label_id=l.id
""",nativeQuery = true)
  TaskVO findOne(Long id);

  boolean existsByName(String name);

  @Query(
      value =
          """
                select t.*,
                       array_agg(tl.label_id) as label_ids,
                       array_agg(l.name) as labels,
                       pt.project_id as project_id
                from task t
                join task_label tl on tl.task_id=t.id and tl.deleted<>true
                join project_task pt on pt.task_id=t.id and pt.deleted<>true
                join labels l on tl.label_id=l.id
                where (:name is null or lower(t.name) like lower(concat('%',:name,'%')))
                    and (:labels is null or cardinality(:labels) = 0  or tl.label_id = any(:labels))
                    and (:status is null or t.status=:status)
                    and (:priority is null or t.priority=:priority)
                    and (:projectId is null or pt.project_id=:projectId)
                group by t.id
              """,
      nativeQuery = true)
  Page<TaskVO> search(
      @Nullable @Param("name") String name,
      @Nullable @Param("labels") List<Long> labels,
      @Nullable @Param("status") Task.Status status,
      @Nullable @Param("priority") Task.Priority priority,
      @Nullable @Param("projectId") Long projectId,
      Pageable pageable);
}
