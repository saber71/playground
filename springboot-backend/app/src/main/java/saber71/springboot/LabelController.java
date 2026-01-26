package saber71.springboot;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("label")
@Tag(name = "基础标签管理")
public class LabelController {

  private final LabelService labelService;

  public LabelController(LabelService labelService) {
    this.labelService = labelService;
  }

  @Operation(summary = "保存或更新标签")
  @PostMapping("save")
  public ResponseEntity<Label> save(@RequestBody Label label) {
    return ResponseEntity.ofNullable(labelService.save(label));
  }

  @Operation(summary = "查询指定命名空间下的标签")
  @GetMapping("search")
  public ResponseEntity<List<Label>> search(String namespace) {
    return ResponseEntity.ok(labelService.search(namespace));
  }
}
