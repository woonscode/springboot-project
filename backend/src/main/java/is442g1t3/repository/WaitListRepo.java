package is442g1t3.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import is442g1t3.domain.WaitList;

public interface WaitListRepo extends JpaRepository<WaitList, Integer> {
  WaitList findByWaitListId(Integer waitListId);

  WaitList[] findByEmail(String email);

  WaitList[] findByDateBetween(LocalDate startDate, LocalDate endDate);

  WaitList[] findByDestination(String destination);

  WaitList[] findByDestinationAndEmailAndDate(String destination, String email, LocalDate date);
}
