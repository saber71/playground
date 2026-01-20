package saber71.springboot;

import java.util.List;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

  private final ProjectRepository projectRepository;
  private final ProjectTaskRepository projectTaskRepository;

  public ProjectService(
      ProjectRepository projectRepository,
      ProjectTaskRepository projectTaskRepository) {
    this.projectRepository = projectRepository;
    this.projectTaskRepository = projectTaskRepository;
  }

  public Project save(@NonNull Project dto) {
    var project = RepositoryHelper.findById(projectRepository, dto.getId()).orElse(new Project());
    ObjectHelper.assign(project, dto);
    return projectRepository.save(project);
  }

  public Page<Project> search(Project.@NonNull SearchParam param) {
    return projectRepository.search(
        param.getName(), param.getArchive(), param.getStatus(), param.getPageable());
  }

  public void setDeleted(String ids) {
    var longList = ListHelper.splitMapLong(ids);
    RepositoryHelper.setDeleted("project", longList);
    RepositoryHelper.setDeleted("project_task", longList, "project_id");
  }

  public void toRelateTask(Long projectId, @NonNull List<Long> taskIds) {
    projectTaskRepository.saveAll(
        taskIds.stream()
            .map(
                i -> {
                  var pt = new ProjectTask();
                  pt.setProjectId(projectId);
                  pt.setTaskId(i);
                  return pt;
                })
            .toList());
  }

  public boolean existName(String name) {
    return projectRepository.existsByName(name);
  }
}
