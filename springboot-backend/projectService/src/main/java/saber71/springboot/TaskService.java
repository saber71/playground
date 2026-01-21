package saber71.springboot;

import java.util.List;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

  private final TaskRepository taskRepository;
  private final ProjectTaskRepository projectTaskRepository;
  private final TaskLabelRepository taskLabelRepository;

  public TaskService(
      TaskRepository taskRepository,
      ProjectTaskRepository projectTaskRepository,
      TaskLabelRepository taskLabelRepository) {
    this.taskRepository = taskRepository;
    this.projectTaskRepository = projectTaskRepository;
    this.taskLabelRepository = taskLabelRepository;
  }

  public TaskVO save(@NonNull Task dto) {
    var task = RepositoryHelper.findById(taskRepository, dto.getId()).orElse(new Task());
    ObjectHelper.assign(task, dto);
    task = taskRepository.save(task);
    if (task.getId() == null) {
      var pt = new ProjectTask();
      pt.setTaskId(task.getId());
      pt.setProjectId(dto.getProjectId());
      projectTaskRepository.save(pt);
    }
    return taskRepository.findOne(task.getId());
  }

  public boolean setDeleted(String ids) {
    var longList = ListHelper.splitMapLong(ids);
    RepositoryHelper.setDeleted("task", longList);
    RepositoryHelper.setDeleted("project_task", WhereClause.in("task_id", longList));
    RepositoryHelper.setDeleted("task_label", WhereClause.in("task_id", longList));
    return true;
  }

  public boolean existName(String name) {
    return taskRepository.existsByName(name);
  }

  public Page<TaskVO> search(Task.@NonNull SearchParam param) {
    return taskRepository.search(
        param.getName(),
        param.getLabels(),
        param.getStatus(),
        param.getPriority(),
        param.getProjectId(),
        param.getPageable());
  }

  public boolean deleteLabel(Long taskId, List<Long> labelIds) {
    RepositoryHelper.setDeleted(
        "task_label", WhereClause.in("label_id", labelIds), WhereClause.equal("task_id", taskId));
    return true;
  }

  public boolean createLabel(Long taskId, List<Long> labelIds) {
    var task = taskRepository.findOne(taskId);
    var listDiff = ListDiff.of(labelIds, task.getLabelIds());
    var taskLabels =
        listDiff.added().stream()
            .map(
                i -> {
                  var tl = new TaskLabel();
                  tl.setTaskId(taskId);
                  tl.setLabelId(i);
                  return tl;
                })
            .toList();
    taskLabelRepository.saveAll(taskLabels);
    return true;
  }
}
