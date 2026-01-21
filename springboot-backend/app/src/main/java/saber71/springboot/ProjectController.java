package saber71.springboot;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("project")
@Tag(name = "项目管理")
public class ProjectController {

  private final ProjectService projectService;

  public ProjectController(ProjectService projectService) {
    this.projectService = projectService;
  }

  @PostMapping("save")
  @Operation(summary = "更新或保存项目")
  public ResponseEntity<Project> save(@RequestBody Project project) {
    return ResponseEntity.ofNullable(projectService.save(project));
  }

  @GetMapping("search")
  @Operation(summary = "分页搜索")
  public ResponseEntity<Page<Project>> search(Project.SearchParam param) {
    return ResponseEntity.ok(projectService.search(param));
  }

  @DeleteMapping("delete")
  @Operation(summary = "删除项目")
  public ResponseEntity<Boolean> delete(String ids) {
    return ResponseEntity.ok(projectService.setDeleted(ids));
  }

  @GetMapping("exist-name")
  @Operation(summary = "检查名字是否重复")
  public ResponseEntity<Boolean> existName(String name) {
    return ResponseEntity.ok(projectService.existName(name));
  }
}
