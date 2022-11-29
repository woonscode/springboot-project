package is442g1t3.service;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import is442g1t3.domain.PaymentReminderEmailQueue;
import is442g1t3.domain.Role;
import is442g1t3.domain.User;
import is442g1t3.repository.PasswordHashRepo;
import is442g1t3.repository.RoleRepo;
import is442g1t3.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
  @Autowired
  private UserRepo userRepo;
  @Autowired
  private RoleRepo roleRepo;
  @Autowired
  private PasswordHashRepo passwordHashRepo;

  private final EmailQueueService emailQueueService;

  public void saveUser(User user) throws SQLIntegrityConstraintViolationException{
    // Check if user already exists
    if (userRepo.existsById(user.getEmpId())) {
      return;
    }
    Role role = new Role("user");
    user.getRoles().add(role);
    roleRepo.save(role);
    userRepo.save(user);
  }

  public void addUserRole(String id, Role r) {
    log.info("Adding Role");
    User user = userRepo.findById(id).get();
    List<Role> roleLs = getAllRoles();
    try {
      if (!roleLs.contains(r)) {
        roleRepo.save(r);
      }
      user.getRoles().add(r);
      log.info("USer" + user);
      userRepo.save(user);
    } catch (InvalidDataAccessApiUsageException e) {
      log.error(e.getMessage());
      throw new RuntimeException("User Already has roles");
    }

  }

  public void deleteUserRole(String id, Role r) {
    if (id == null || r == null) {
      throw new IllegalArgumentException("Invalid email or role");
    }
    try {
      User user = userRepo.findById(id).get();
      if (user == null) {
        throw new NoSuchElementException("User not found");
      }
      if (user.getRoles().contains(r)) {
        user.getRoles().remove(r);
        userRepo.save(user);
      } else {
        throw new RuntimeException("User does not have this role");
      }
    } catch (NoSuchElementException e) {
      throw new RuntimeException("User does not exist");
    }
  }

  public List<User> getAllUsers() {
    return userRepo.findAll();
  }

  public User getUser(String empId) {
    try {
      User user = userRepo.findById(empId).get();
      return user;
    } catch (NoSuchElementException e) {
      throw new RuntimeException("User does not exist");
    }
  }

  public void deleteUser(String empId) {
    try {
      User user = userRepo.findById(empId).get();
      // Delete passwordHash
      passwordHashRepo.delete(passwordHashRepo.findByUser(user));
      // Delete user
      userRepo.delete(user);
    } catch (Exception e) {
      log.error(e.getMessage());
      throw new RuntimeException("User does not exist");
    }
  }

  public Boolean updateUser(String email, User user) {
    String empId = email.split("@")[0];
    System.out.println("User ID: " + empId);
    try {
      User updatedUser = userRepo.findById(empId).get();
      System.out.println("Updated User: " + updatedUser);
      updatedUser.setUsername(user.getUsername());
      updatedUser.setEmail(user.getEmail());
      updatedUser.setName(user.getName());
      updatedUser.setPhoneNo(user.getPhoneNo());
      updatedUser.setFine(user.getFine());
      userRepo.save(updatedUser);
      return true;
    } catch (Exception e) {
      log.error(e.toString());
      if (e instanceof NoSuchElementException) {
        throw new RuntimeException("User does not exist");
      }
      throw new RuntimeException("Error updating user");
    }
  }

  public List<Role> getAllRoles() {
    return roleRepo.findAll();
  }

  public Boolean addNewRole(Role role) {
    if (roleRepo.existsById(role.getRole())) {
      throw new RuntimeException("Role already exist!");
    } else {
      roleRepo.save(role);
      return true;
    }
  }

  public Boolean deleteRole(Role role) {
    if (roleRepo.existsById(role.getRole())) {
      roleRepo.deleteById(role.getRole());
      return true;
    } else {
      throw new RuntimeException("Role does not exist!");
    }
  }

  public boolean updateRoles(String email, List<Role> roleArr) {
    String id = email.split("@")[0];
    // Get user's role
    try {
      User user = userRepo.findById(id).get();
      Collection<Role> userRole = user.getRoles();
      for (Role r : userRole) {
        if (!roleArr.contains(r)) {
          deleteUserRole(id, r);
        }
      }
      for (Role r : roleArr) {
        if (!userRole.contains(r)) {
          addUserRole(id, r);
        }
      }
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    return true;
  }

/**
 * Clears all fines for the associated email
 * @param email email to clear fine for
 */

  public void clearFine(String email) {
    String id = email.split("@")[0];
    User user = userRepo.findById(id).get();
    user.setFine(0.0);
    userRepo.save(user);
  }

  public Boolean checkEmailExists(String email) {
    List<User> userLs = userRepo.findByEmail(email);
    return userLs.size() > 0;
  }

  public List<Map<String, Object>> getUsersWithFines() {
    List<User> userLs = userRepo.findAll();
    List<Map<String, Object>> userMap = new ArrayList<>();
    for (User u : userLs) {
      Map<String, Object> details = new HashMap<>();
      if (u.getFine() > 0) {
        details.put("email", u.getEmail());
        details.put("fine", u.getFine());
        details.put("name", u.getName());
        userMap.add(details);
      }
    }
    return userMap;
  }

  @Scheduled(fixedDelay = 10000)
  public void checkFine(){
    List<Map<String,Object>> results = getUsersWithFines();
    if (results.size() == 0) {
      System.out.println("No users with fines");
    }else{
      for (Map<String,Object> result: results){
        String email = (String) result.get("email");
        Double fine = (Double) result.get("fine");
        String name = (String) result.get("name");
        String subject = "Fine Reminder";
        String templateName = "fine.html";
        PaymentReminderEmailQueue paymentReminderEmailQueue = new PaymentReminderEmailQueue(email, name, subject, fine,templateName);
        emailQueueService.publishToPaymentReminderQueue(paymentReminderEmailQueue);
      }
    }
  }
}
