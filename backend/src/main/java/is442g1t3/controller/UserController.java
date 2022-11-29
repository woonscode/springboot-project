package is442g1t3.controller;

import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import is442g1t3.domain.Role;
import is442g1t3.domain.User;
import is442g1t3.dto.ResponseSchema;
import is442g1t3.service.JwtService;
import is442g1t3.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {
  @Autowired
  private UserService userService;
  private final JwtService jwtService;

  @Value("${my.hashSecret}")
  private String hashSecret;

  @GetMapping(value = "/admin/getAllUser")
  public ResponseEntity<HashMap<String, Object>> getAllUsers() {
    try {
      List<User> users = userService.getAllUsers();
      return ResponseEntity.ok(new ResponseSchema(200, users).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500).body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  @GetMapping(value = "/user/getUser/{email}")
  public ResponseEntity<HashMap<String, Object>> getUserByEmail(@PathVariable String email) {
    String id = email.split("@")[0];
    try{
      return ResponseEntity.ok(new ResponseSchema(200, userService.getUser(id)).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(404).body(new ResponseSchema(404, "User not found").getErrorResponse());
    }
  }

  @PutMapping(value = "/user/updateUser/{email}")
  public ResponseEntity<HashMap<String, Object>> updateUser(@RequestHeader("Authorization") String token, @PathVariable String email, @RequestBody User user) {
    try {
      log.info(token);
      log.info(user.getEmpId());
      log.info(hashSecret);
      Boolean isAuth = jwtService.validateAdminOrSelf(token, user.getEmpId(), hashSecret);
      if (isAuth){
        userService.updateUser(email, user);
        return ResponseEntity.ok(new ResponseSchema(200, (Object)"User updated").getSuccessResponse());
      }else{
        return ResponseEntity.status(401).body(new ResponseSchema(401, "Unauthorized").getErrorResponse());
      }
    } catch (Exception e) {
      return ResponseEntity.status(404).body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
    }
  }

  @DeleteMapping(value = "/user/deleteUser/{email}")
  public ResponseEntity<HashMap<String, Object>> deleteUser(@RequestHeader("Authorization") String token, @PathVariable String email) {
    try {
      User user = userService.getUser(email.split("@")[0]);
      if (jwtService.validateAdminOrSelf(token, user.getEmpId(), hashSecret)){
        userService.deleteUser(user.getEmpId());
        return ResponseEntity.ok(new ResponseSchema(200, (Object)"User deleted").getSuccessResponse());
      }else{
        return ResponseEntity.status(401).body(new ResponseSchema(401, "Unauthorized").getErrorResponse());
      }
    } catch (Exception e) {
      return ResponseEntity.status(404).body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
    }
  }

  @PostMapping(value = "/user/addUserRole/{email}")
  public ResponseEntity<HashMap<String, Object>> addRole(@RequestHeader("Authorization") String token, @PathVariable String email, @RequestBody Role role) {
    try {
      String id = email.split("@")[0];
      if (jwtService.validateAdminOrSelf(token, "ng.shen.jie1999",hashSecret)){
        userService.addUserRole(id, role);
        return ResponseEntity.ok(new ResponseSchema(200, (Object)"Role added").getSuccessResponse());
      }else{
        return ResponseEntity.status(401).body(new ResponseSchema(401, "Unauthorized").getErrorResponse());
      }
    } catch (Exception e) {
      return ResponseEntity.status(404).body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
    }
  }

  @DeleteMapping(value = "/user/deleteUserRole/{email}")
  public ResponseEntity<HashMap<String, Object>> deleteRole(@RequestHeader("Authorization") String token, @PathVariable String email, @RequestBody Role role) {
    try {
      String id = email.split("@")[0];
      if (jwtService.validateAdminOrSelf(token, id,hashSecret)){
        userService.deleteUserRole(id, role);
        return ResponseEntity.ok(new ResponseSchema(200, (Object)"Role deleted").getSuccessResponse());
      }else{
        return ResponseEntity.status(401).body(new ResponseSchema(401, "Unauthorized").getErrorResponse());
      }
    } catch (Exception e) {
      return ResponseEntity.status(404).body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
    }
  }

  @GetMapping(value = "/admin/getAllRole")
  public ResponseEntity<HashMap<String, Object>> getAllRoles() {
    try {
      return ResponseEntity.ok(new ResponseSchema(200, userService.getAllRoles()).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500).body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  @PostMapping(value = "/admin/addNewRole")
  public ResponseEntity<HashMap<String, Object>> addNewRole(@RequestHeader("Authorization") String token, @RequestBody Role role) {
    try {
      userService.addNewRole(role);
      return ResponseEntity.ok(new ResponseSchema(200, (Object)"Role added").getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(404).body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
    }
  }

  @DeleteMapping(value = "/admin/deleteRole")
  public ResponseEntity<HashMap<String, Object>> deleteRole(@RequestBody Role role) {
    try {
      userService.deleteRole(role);
      return ResponseEntity.ok(new ResponseSchema(200, (Object)"Role deleted").getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(404).body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
    }
  }

  @PutMapping(value = "/admin/updateUserRoleLs/{email}")
  public ResponseEntity<HashMap<String,Object>> updateRoles(@PathVariable String email, @RequestBody List<Role> roleArr)
  {
    try{
      userService.updateRoles(email, roleArr);
      return ResponseEntity.ok(new ResponseSchema(200, (Object)"Role updated").getSuccessResponse()); 
    }catch(Exception e){
      return ResponseEntity.status(404).body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
    }
  }

  @PostMapping(value = "/admin/clearFine")
  public ResponseEntity<HashMap<String, Object>> clearFine( @RequestParam String email) {
    try {
      userService.clearFine(email);
      return ResponseEntity.ok(new ResponseSchema(200, (Object)"Fine cleared").getSuccessResponse());
    }catch (NoSuchElementException e) {
      return ResponseEntity.status(404).body(new ResponseSchema(404, "User not found").getErrorResponse());
    }catch (Exception e) {
      return ResponseEntity.status(404).body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
    }
  }
}
