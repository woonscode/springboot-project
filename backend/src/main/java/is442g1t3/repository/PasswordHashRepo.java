package is442g1t3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import is442g1t3.domain.PasswordHash;
import is442g1t3.domain.User;

public interface PasswordHashRepo extends JpaRepository<PasswordHash, String> {
  PasswordHash findByUser(User user);
}
