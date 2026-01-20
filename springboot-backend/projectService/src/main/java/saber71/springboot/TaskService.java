package saber71.springboot;

import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

  private final TaskRepository taskRepository;

  public TaskService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  public Task save(@NonNull Task dto) {
    var task = RepositoryHelper.findById(taskRepository, dto.getId()).orElse(new Task());
    ObjectHelper.assign(task, dto);
    return taskRepository.save(task);
  }

  public void setDeleted(String ids) {
    var longList = ListHelper.splitMapLong(ids);
    RepositoryHelper.setDeleted("task", longList);
    RepositoryHelper.setDeleted("project_task", longList, "task_id");
  }

  public boolean existName(String name) {
    return taskRepository.existsByName(name);
  }

  public Page<Task> search(Task.@NonNull SearchParam param) {
    return taskRepository.search(
        param.getName(),
        param.getLabels(),
        param.getStatus(),
        param.getPriority(),
        param.getProjectId(),
        param.getPageable());
  }
}
