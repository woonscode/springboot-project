package is442g1t3.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import is442g1t3.domain.Role;

public interface RoleRepo extends JpaRepository<Role, String> {
}
