package saber71.springboot.project;

import java.util.List;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import saber71.springboot.RepositoryHelper;
import saber71.springboot.WhereClause;

@Aspect
@Component
public class LabelServiceAspect {
  @Pointcut("execution(* saber71.springboot.LabelService.setDeleted(..))")
  public void setDeletedPointcut() {}

  @Around("setDeletedPointcut()")
  public Object preSetDeleted(@NonNull ProceedingJoinPoint point) throws Throwable {
    @SuppressWarnings("unchecked") List<Long> ids= (List<Long>) point.getArgs()[0];
    RepositoryHelper.setDeleted(
        "task_label", WhereClause.in("label_id", ids));
    return point.proceed();
  }
}
