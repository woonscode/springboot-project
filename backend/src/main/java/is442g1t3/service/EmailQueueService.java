package is442g1t3.service;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import is442g1t3.domain.CollectionReminderEmailQueue;
import is442g1t3.domain.EmailQueue;
import is442g1t3.domain.PaymentReminderEmailQueue;
import is442g1t3.domain.ReturnReminderEmailQueue;
import is442g1t3.repository.CollectionReminderEmailQueueRepo;
import is442g1t3.repository.EmailQueueRepo;
import is442g1t3.repository.ReturnReminderQueueRepo;
import is442g1t3.repository.PaymentReminderEmailQueueRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailQueueService {
  private final EmailQueueRepo emailQueueRepo;
  private final CollectionReminderEmailQueueRepo collectionReminderEmailQueueRepo;
  private final ReturnReminderQueueRepo returnReminderQueueRepo;
  private final PaymentReminderEmailQueueRepo paymentReminderEmailQueueRepo;

  public void publishToCollectionReminderQueue(CollectionReminderEmailQueue queue){
    CollectionReminderEmailQueue existingQueue = collectionReminderEmailQueueRepo.findByToEmailAndLoanDateAndDestinationName(queue.getToEmail(), queue.getLoanDate(),queue.getDestinationName());
    if (existingQueue == null) {
      collectionReminderEmailQueueRepo.save(queue);
    }
  }

  public void publishToPaymentReminderQueue(PaymentReminderEmailQueue queue){
    PaymentReminderEmailQueue existingQueue = paymentReminderEmailQueueRepo.findByToEmailAndAmount(queue.getToEmail(), queue.getAmount());
    if (existingQueue == null) {
      paymentReminderEmailQueueRepo.save(queue);
    }
  }

  public void publishToReturnReminderQueue(ReturnReminderEmailQueue queue){
    // check if queue is already in the database
    ReturnReminderEmailQueue existingQueue = returnReminderQueueRepo.findByToEmailAndDestinationName(queue.getToEmail(), queue.getDestinationName());
    if (existingQueue == null) {
      returnReminderQueueRepo.save(queue);
    }
  }

  public void updateEmailSent(EmailQueue queue){
    queue.setSent(true);
    emailQueueRepo.save(queue);
  }

  public void deleteEmailQueue(EmailQueue queue){
    if (queue instanceof CollectionReminderEmailQueue) {
      collectionReminderEmailQueueRepo.delete((CollectionReminderEmailQueue) queue);
    } else if (queue instanceof PaymentReminderEmailQueue) {
      paymentReminderEmailQueueRepo.delete((PaymentReminderEmailQueue) queue);
    } else if (queue instanceof ReturnReminderEmailQueue) {
      returnReminderQueueRepo.delete((ReturnReminderEmailQueue) queue);
    }
  }
  
  public List<EmailQueue> getAllEmailQueue(){
    List<EmailQueue> queue = emailQueueRepo.findAll();
    return queue;
  }

  // Cron schedule to delete all emails that have been sent at 23:59pm every day
  @Scheduled(cron = "0 59 23 * * *")
  public void deleteSentEmails(){
    List<EmailQueue> queue = emailQueueRepo.findAll();
    for (EmailQueue emailQueue : queue) {
      if (emailQueue.isSent()) {
        deleteEmailQueue(emailQueue);
      }
    }
  }

}
