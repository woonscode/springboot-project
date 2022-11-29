package is442g1t3.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import is442g1t3.domain.User;

public interface UserRepo extends JpaRepository<User, String> {
  List<User> findByEmail(String email);
}
