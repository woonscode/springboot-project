package is442g1t3.controller;

import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import is442g1t3.domain.WaitList;
import is442g1t3.dto.ResponseSchema;
import is442g1t3.dto.WaitListRequest;
import is442g1t3.service.WaitListService;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class WaitlistController {
  @Autowired
  private WaitListService waitListService;

  @GetMapping(value = "/admin/getAllWaitList")
  public ResponseEntity<HashMap<String, Object>> getAllWaitList() {
    try {
      return ResponseEntity
          .ok(new ResponseSchema(200, waitListService.getAllWaitList()).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500)
          .body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  @GetMapping(value = "/user/waitlist")
  public ResponseEntity<HashMap<String, Object>> getUserWaitList(@RequestParam String email) {
    try {
      return ResponseEntity
          .ok(new ResponseSchema(200, waitListService.getUserWaitList(email)).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(404)
          .body(new ResponseSchema(404, "User not found").getErrorResponse());
    }
  }

  @PostMapping(value = "/user/waitlist")
  public ResponseEntity<HashMap<String, Object>> addUserWaitToList(
      @RequestBody WaitListRequest waitList) {
    try {
      WaitList waitListObj =
          new WaitList(waitList.getEmail(), waitList.getDestination(), waitList.getDate());
      Boolean status = waitListService.addUserWaitList(waitListObj);
      return ResponseEntity.status(200)
          .body(new ResponseSchema(200, (Object) status).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(404)
          .body(new ResponseSchema(404, "User not found").getErrorResponse());
    }
  }

  @DeleteMapping(value = "/user/waitlist")
  public ResponseEntity<HashMap<String, Object>> deleteUserWaitList(
      @RequestBody WaitListRequest waitList) {
    try {
      WaitList waitListObj =
          new WaitList(waitList.getEmail(), waitList.getDestination(), waitList.getDate());
      Boolean status = waitListService.removeWaitList(waitListObj);
      return ResponseEntity.status(200)
          .body(new ResponseSchema(200, (Object) status).getSuccessResponse());
    } catch (Exception e) {
      log.error(e.getMessage());
      return ResponseEntity.status(404)
          .body(new ResponseSchema(404, "User not found").getErrorResponse());
    }
  }

  @GetMapping(value = "/user/waitlist/filterByDate")
  public ResponseEntity<HashMap<String, Object>> getWaitListByDate(@RequestParam String startDate,
      @RequestParam String endDate) {
    try {
      return ResponseEntity
          .ok(new ResponseSchema(200, waitListService.getWaitListByDate(startDate, endDate))
              .getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(404)
          .body(new ResponseSchema(404, "User not found").getErrorResponse());
    }
  }

  @GetMapping(value = "/admin/waitlist/filterByDestination")
  public ResponseEntity<HashMap<String, Object>> getWaitListByDestination(
      @RequestParam String destination) {
    try {
      return ResponseEntity
          .ok(new ResponseSchema(200, waitListService.getWaitListByDestination(destination))
              .getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(404)
          .body(new ResponseSchema(404, "User not found").getErrorResponse());
    }
  }
}
