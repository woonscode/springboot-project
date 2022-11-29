package is442g1t3.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import is442g1t3.domain.CollectionReminderEmailQueue;

public interface CollectionReminderEmailQueueRepo
    extends JpaRepository<CollectionReminderEmailQueue, Integer> {
  List<CollectionReminderEmailQueue> findByToEmail(String email);

  List<CollectionReminderEmailQueue> findByLoanDate(LocalDate loanDate);

  List<CollectionReminderEmailQueue> findByToEmailAndLoanDate(String email, LocalDate loanDate);
  CollectionReminderEmailQueue findByToEmailAndLoanDateAndDestinationName(String email, LocalDate loanDate, String destination);
}
