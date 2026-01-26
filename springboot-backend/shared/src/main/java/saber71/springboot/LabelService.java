package saber71.springboot;

import java.util.List;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

@Service
public class LabelService {

  private final LabelRepository labelRepository;

  public LabelService(LabelRepository labelRepository) {
    this.labelRepository = labelRepository;
  }

  public Label save(@NonNull Label dto) {
    var label = RepositoryHelper.findById(labelRepository, dto.getId()).orElse(new Label());
    ObjectHelper.assign(label, dto);
    return labelRepository.save(label);
  }

  public boolean setDeleted(String ids) {
    var longList = ListHelper.splitMapLong(ids);
    RepositoryHelper.setDeleted("label", longList);
    return true;
  }

  public List<Label> search(String namespace) {
    return labelRepository.searchByNamespace(namespace);
  }
}
