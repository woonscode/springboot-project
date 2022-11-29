package is442g1t3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import is442g1t3.domain.ReturnReminderEmailQueue;

public interface ReturnReminderQueueRepo extends JpaRepository<ReturnReminderEmailQueue, Integer> {

  public ReturnReminderEmailQueue findByToEmailAndDestinationName(String email, String destinationName);

}
