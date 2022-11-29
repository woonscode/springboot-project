package is442g1t3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import is442g1t3.domain.Destination;

public interface DestinationRepo extends JpaRepository<Destination, String> {
}
