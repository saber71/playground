package spring.terminal.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.Getter;
import org.jetbrains.annotations.NotNull;
import spring.terminal.UserContext;

@Getter
public class ModifiableValue {
  private final double baseValue;
  private List<Bonus> bonuses = new ArrayList<>();

  public ModifiableValue(double baseValue) {
    this.baseValue = baseValue;
  }

  public void addSource(@NotNull Bonus bonus) {
    remove(bonus.sourceId);
    bonuses.add(bonus);
  }

  public double getValue() {
    Long curTime = UserContext.getState().getCurGameTime();
    double result = baseValue;
    List<Bonus> needRemove = new ArrayList<>();
    for (Bonus bonus : bonuses) {
      if (bonus.appliedAt + bonus.duration < curTime) needRemove.add(bonus);
      else {
        if (bonus.type == BonusType.VALUE) result += bonus.amount;
        else result *= 1 + bonus.amount;
      }
    }
    bonuses.removeAll(needRemove);
    return result;
  }

  public void remove(Long sourceId) {
    var needRemove = bonuses.stream().filter(i -> Objects.equals(i.sourceId, sourceId)).toList();
    bonuses.removeAll(needRemove);
  }

  public enum BonusType {
    PERCENTAGE,
    VALUE;
  }

  public record Bonus(
      Long sourceId, // 来源id
      String sourceName, // 来源名称
      double amount, // 加成值
      BonusType type, // 加成类型，百分比/绝对数值
      Long appliedAt, // 施加时间
      Long duration // 持续时间
      ) {}
}
