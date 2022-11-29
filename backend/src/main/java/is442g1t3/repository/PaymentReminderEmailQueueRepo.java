package is442g1t3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import is442g1t3.domain.PaymentReminderEmailQueue;

public interface PaymentReminderEmailQueueRepo extends JpaRepository<PaymentReminderEmailQueue, Integer> {
  public PaymentReminderEmailQueue findByToEmailAndAmount(String toEmail, Double amount);
}
