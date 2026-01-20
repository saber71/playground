package saber71.springboot;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectTaskRepository extends JpaRepository<ProjectTask, Long> {
  @Query(
"""
    select distinct pt from ProjectTask pt
        where pt.projectId=:projectId
            and pt.taskId in (:taskIds)
    """)
  List<ProjectTask> searchByProjectAndTasks(@Param("projectId") Long projectId,@Param("taskIds") List<Long> taskIds);
}
