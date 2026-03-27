package spring.terminal.json;

import java.util.List;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import spring.terminal.entity.repository.BaseEntityRepository;

public interface JsonEntityRepository extends BaseEntityRepository<JsonEntity, Long> {

  @Query("SELECT e FROM JsonEntity e WHERE e.data[:key] = :value")
  @Nullable
  JsonEntity findFirstByKeyValue(
      @Param("key") @NotNull String key, @Param("value") @NotNull Object value);

  @Query("SELECT e FROM JsonEntity e WHERE KEY(e.data) = :key")
  @NotNull
  List<JsonEntity> queryByDataKey(@Param("key") @NotNull String key);

  @Query("SELECT e FROM JsonEntity e WHERE e.data[:key] = :value")
  @NotNull
  List<JsonEntity> queryByKeyValue(
      @Param("key") @NotNull String key, @Param("value") @NotNull Object value);
}
