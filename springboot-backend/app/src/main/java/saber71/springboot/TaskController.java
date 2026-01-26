package saber71.springboot;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("task")
@Tag(name = "任务管理")
public class TaskController {

  private final TaskService taskService;

  public TaskController(TaskService taskService) {
    this.taskService = taskService;
  }

  @GetMapping("find-one")
  public ResponseEntity<TaskVO> findOne(Long id) {
    return ResponseEntity.ofNullable(taskService.findOne(id));
  }

  @PostMapping("save")
  @Operation(summary = "更新或创建任务")
  public ResponseEntity<TaskVO> save(@RequestBody Task task) {
    return ResponseEntity.ofNullable(taskService.save(task));
  }

  @DeleteMapping("delete")
  @Operation(summary = "删除任务")
  public ResponseEntity<Boolean> delete(String ids) {
    return ResponseEntity.ok(taskService.setDeleted(ListHelper.splitMapLong(ids)));
  }

  @GetMapping("search")
  @Operation(summary = "分页搜索")
  public ResponseEntity<Page<TaskVO>> search(Task.SearchParam param) {
    return ResponseEntity.ok(taskService.search(param));
  }

  @GetMapping("exist-name")
  @Operation(summary = "检查名字是否重复")
  public ResponseEntity<Boolean> existName(String name) {
    return ResponseEntity.ok(taskService.existName(name));
  }

  @DeleteMapping("delete-labels")
  @Operation(summary = "删除任务上的标签")
  public ResponseEntity<Boolean> deleteLabels(String labelIds, Long taskId) {
    return ResponseEntity.ok(taskService.deleteLabel(taskId, ListHelper.splitMapLong(labelIds)));
  }

  @PostMapping("create-labels")
  @Operation(summary = "创建任务上的标签")
  public ResponseEntity<Boolean> createLabels(Long taskIds, String labelIds) {
    return ResponseEntity.ok(taskService.createLabel(taskIds, ListHelper.splitMapLong(labelIds)));
  }
}
