package is442g1t3.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import is442g1t3.domain.DigitalPass;
import is442g1t3.domain.Pass;
import is442g1t3.domain.PhysicalPass;
import is442g1t3.dto.ResponseSchema;
import is442g1t3.service.PassService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class PassController {

  private final PassService passService;

  @PostMapping(value = "/admin/pass")
  public ResponseEntity<HashMap<String, Object>> createPass(@RequestBody Pass pass) {
    try {
      passService.createPass(pass);
      log.info(String.format("Saved pass: %s", pass.toString()));
      return ResponseEntity.status(200).body(new ResponseSchema(200, (Object) "Pass added").getSuccessResponse());
    } catch (IllegalArgumentException e) {
      log.error(e.getMessage());
      return ResponseEntity.status(400).body(new ResponseSchema(400, "Illegal Argument").getErrorResponse());
    }catch (Exception e) {
      log.error(e.getMessage());
      return ResponseEntity.status(500).body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  @GetMapping(value = "/user/pass/all")
  public ResponseEntity<HashMap<String,Object>> passes() {
    log.info("returning all passes");
    try{
      Map<String, List<Pass>> passes = passService.getPasses();
      return ResponseEntity.status(200).body(new ResponseSchema(200,passes).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500).body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  @GetMapping(value = "/user/pass/{id}")
  public ResponseEntity<HashMap<String,Object>> pass(@PathVariable String id) {
    try{
      Pass pass = passService.getPass(id);
      log.info(String.format("returning pass: %s", pass.toString()));
      return ResponseEntity.status(200).body(new ResponseSchema(200,pass).getSuccessResponse());
    } catch (IllegalArgumentException e) {
      log.error(e.getMessage());
      return ResponseEntity.status(500).body(new ResponseSchema(400, "Illegal Argument").getErrorResponse());
    } catch (NoSuchElementException e) {
      log.error(e.getMessage());
      return ResponseEntity.status(500).body(new ResponseSchema(400, "Pass not found").getErrorResponse());
    }
  }

  @PutMapping(value = "/admin/pass/{id}")
  public ResponseEntity<HashMap<String, Object>> updatePass(@PathVariable String id, @RequestBody Pass pass) {
    try {
      passService.updatePass(id, pass);
      log.info(String.format("Updated pass: %s", pass.toString()));
      return ResponseEntity.status(200).body(new ResponseSchema(200, pass).getSuccessResponse());
    } catch (IllegalArgumentException e) {
      log.error(e.getMessage());
      return ResponseEntity.status(400).body(new ResponseSchema(400, "Illegal Argument").getErrorResponse());
    }catch (Exception e) {
      log.error(e.getMessage());
      return ResponseEntity.status(500).body(new ResponseSchema(500, "No such element").getErrorResponse());
    }
  }

  @DeleteMapping(value = "/admin/pass/{id}")
  public ResponseEntity<HashMap<String, Object>> deletePass(@PathVariable String id) {
    try {
      passService.deletePass(id);
      log.info(String.format("Deleted pass: %s", id));
      return ResponseEntity.status(200).body(new ResponseSchema(200, (Object) "Pass deleted").getSuccessResponse());
    } catch (IllegalArgumentException e) {
      log.error(e.getMessage());
      return ResponseEntity.status(400).body(new ResponseSchema(400, "Illegal Argument").getErrorResponse());
    }catch (Exception e) {
      log.error(e.getMessage());
      return ResponseEntity.status(500).body(new ResponseSchema(500, "No such element").getErrorResponse());
    }
  }

  @PostMapping(value = "/admin/lostPass")
  public ResponseEntity<HashMap<String,Object>> reportLostPass(@RequestParam String passId, @RequestParam String email){
    try{
      passService.reportLostPass(passId, email);
      return ResponseEntity.status(200).body(new ResponseSchema(200, (Object) "Pass reported lost").getSuccessResponse());
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(402).body(new ResponseSchema(402, "Illegal Argument").getErrorResponse());
    } catch (NoSuchElementException e) {
      return ResponseEntity.status(404).body(new ResponseSchema(404, "Pass not found").getErrorResponse());
    } catch (RuntimeException e) {
      log.error(e.toString());
      return ResponseEntity.status(404).body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
    }
  }


}
