package is442g1t3.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import is442g1t3.domain.Pass;

public interface PassRepo extends JpaRepository<Pass, String> {
  List<Pass> findByDestination(String destination);
}
