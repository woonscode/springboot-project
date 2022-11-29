package is442g1t3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import is442g1t3.domain.EmailQueue;

public interface EmailQueueRepo extends JpaRepository<EmailQueue, Integer> {

}
