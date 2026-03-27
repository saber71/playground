package spring.terminal.entity.repository;

import java.util.ArrayList;
import java.util.List;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.domain.Specification;
import spring.terminal.entity.BaseEntity;

public interface SpecificationBuilder<T> {
  @Contract(" -> new")
  static <T extends BaseEntity> @NotNull SpecificationBuilderImpl<T> create() {
    return new SpecificationBuilderImpl<>();
  }

  Specification<T>[] build();

  class SpecificationBuilderImpl<T extends BaseEntity> implements SpecificationBuilder<T> {
    private final List<Specification<T>> specifications = new ArrayList<>();

    public Specification<T>[] build() {
      //noinspection unchecked
      return specifications.toArray(Specification[]::new);
    }

    public SpecificationBuilderImpl<T> eq(String field, Object value) {
      if (value != null) {
        specifications.add((root, query, cb) -> cb.equal(root.get(field), value));
      }
      return this;
    }

    public <Y extends Comparable<? super Y>> SpecificationBuilderImpl<T> ge(String field, Y value) {
      if (value != null) {
        specifications.add((root, query, cb) -> cb.greaterThanOrEqualTo(root.get(field), value));
      }
      return this;
    }

    public <Y extends Comparable<? super Y>> SpecificationBuilderImpl<T> gt(String field, Y value) {
      if (value != null) {
        specifications.add((root, query, cb) -> cb.greaterThan(root.get(field), value));
      }
      return this;
    }

    public SpecificationBuilderImpl<T> in(String field, List<?> values) {
      if (values != null && !values.isEmpty()) {
        specifications.add((root, query, cb) -> root.get(field).in(values));
      }
      return this;
    }

    public <Y extends Comparable<? super Y>> SpecificationBuilderImpl<T> le(String field, Y value) {
      if (value != null) {
        specifications.add((root, query, cb) -> cb.lessThanOrEqualTo(root.get(field), value));
      }
      return this;
    }

    public SpecificationBuilderImpl<T> like(String field, String value) {
      if (value != null && !value.isEmpty()) {
        specifications.add((root, query, cb) -> cb.like(root.get(field), "%" + value + "%"));
      }
      return this;
    }

    public <Y extends Comparable<? super Y>> SpecificationBuilderImpl<T> lt(String field, Y value) {
      if (value != null) {
        specifications.add((root, query, cb) -> cb.lessThan(root.get(field), value));
      }
      return this;
    }
  }
}
