package spring.terminal.repository;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;
import spring.terminal.entity.BaseEntity;

public interface BaseEntityRepository<T extends BaseEntity, ID>
    extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {
  default List<T> findAll(@NotNull Consumer<SpecificationBuilder<T>> builderConsumer) {
    SpecificationBuilder<T> builder = SpecificationBuilder.create();
    builderConsumer.accept(builder);
    return findAllBySpecifications(builder.build());
  }

  default Page<T> findAll(
      @NotNull Consumer<SpecificationBuilder<T>> builderConsumer, Pageable pageable) {
    SpecificationBuilder<T> builder = SpecificationBuilder.create();
    builderConsumer.accept(builder);
    return findAllBySpecifications(builder.build(), pageable);
  }

  default List<T> findAllBySpecifications(Specification<T>... specifications) {
    if (specifications == null || specifications.length == 0) {
      return findAll();
    }

    List<Specification<T>> validSpecs =
        Arrays.stream(specifications).filter(Objects::nonNull).toList();

    if (validSpecs.isEmpty()) {
      return findAll();
    }

    Specification<T> combined = validSpecs.getFirst();
    for (int i = 1; i < validSpecs.size(); i++) {
      combined = combined.and(validSpecs.get(i));
    }

    return findAll(combined);
  }

  default Page<T> findAllBySpecifications(Specification<T>[] specifications, Pageable pageable) {
    if (specifications == null || specifications.length == 0) {
      return findAll(pageable);
    }

    List<Specification<T>> validSpecs =
        Arrays.stream(specifications).filter(Objects::nonNull).toList();

    if (validSpecs.isEmpty()) {
      return findAll(pageable);
    }

    Specification<T> combined = validSpecs.getFirst();
    for (int i = 1; i < validSpecs.size(); i++) {
      combined = combined.and(validSpecs.get(i));
    }

    return findAll(combined, pageable);
  }

  @Transactional
  default void softDelete(@NotNull T entity) {
    entity.setSoftDelete();
    save(entity);
  }

  @Transactional
  default void softDeleteById(ID id) {
    findById(id)
        .ifPresent(
            entity -> {
              entity.setSoftDelete();
              save(entity);
            });
  }

}
