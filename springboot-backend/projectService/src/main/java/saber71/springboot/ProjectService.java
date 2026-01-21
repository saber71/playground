package saber71.springboot;

import java.util.Optional;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

  private final ProjectRepository projectRepository;

  public ProjectService(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  public Project save(@NonNull Project dto) {
    var project = RepositoryHelper.findById(projectRepository, dto.getId()).orElse(new Project());
    ObjectHelper.assign(project, dto);
    return projectRepository.save(project);
  }

  public Page<Project> search(Project.@NonNull SearchParam param) {
    return projectRepository.search(
        Optional.ofNullable(param.getName()).orElse(""),
        param.getArchive(),
        param.getStatus(),
        param.getPageable());
  }

  public boolean setDeleted(String ids) {
    var longList = ListHelper.splitMapLong(ids);
    RepositoryHelper.setDeleted("project", longList);
    RepositoryHelper.setDeleted("project_task", WhereClause.in("project_id", longList));
    return true;
  }

  public boolean existName(String name) {
    return projectRepository.existsByName(name);
  }
}
