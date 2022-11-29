package is442g1t3.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import org.springframework.http.ResponseEntity;
import org.springframework.jmx.access.InvalidInvocationException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.node.ObjectNode;
import is442g1t3.domain.Loan;
import is442g1t3.domain.User;
import is442g1t3.dto.LoanWithPass;
import is442g1t3.dto.ResponseSchema;
import is442g1t3.service.EmailSender;
import is442g1t3.service.LoanService;
import is442g1t3.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class LoanController {

  private final LoanService loanService;
  private final EmailSender emailSender;
  private final UserService userService;

  /**
   * 
   * @return All stored loans.
   */
  @GetMapping(value = "/user/loan/all")
  public ResponseEntity<HashMap<String, Object>> getAllLoans() {
    try {
      List<LoanWithPass> loans = loanService.getAllLoans();
      return ResponseEntity.ok(new ResponseSchema(200, loans).getSuccessResponse());
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity.status(500).body(
          new ResponseSchema(500, "Error occurred when getting all loans").getErrorResponse());
    }
  }

  /**
   * @param loanId
   * @return Loan by ID.
   */
  @GetMapping(value = "/user/loan/{loanId}")
  public ResponseEntity<HashMap<String, Object>> getLoan(@PathVariable int loanId) {
    try {
      LoanWithPass loan = loanService.getLoan(loanId);
      return ResponseEntity.ok(new ResponseSchema(200, loan).getSuccessResponse());
    } catch (Exception e) {
      if (e instanceof NoSuchElementException) {
        return ResponseEntity.status(404)
            .body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
      }
      return ResponseEntity.status(500)
          .body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  /**
   * @param objectNode
   * @return 
   */
  @PostMapping(value = "/user/loan/create")
  public ResponseEntity<HashMap<String, Object>> saveLoan(@RequestBody ObjectNode objectNode) {

    try {

      String borrowerId = objectNode.get("borrowerId").asText().split("@")[0];
      String destination = objectNode.get("destination").asText();
      int count = objectNode.get("count").asInt();

      if (count > 2) {
        return ResponseEntity.status(500)
            .body(new ResponseSchema(500, "Can only request 1 or 2 passes").getErrorResponse());
      }

      LocalDate loanDate = LocalDate.parse(objectNode.get("loanDate").asText());

      if (!loanService.getLoanEligibility(borrowerId, loanDate.getMonthValue())) {
        return ResponseEntity.status(500).body(
            new ResponseSchema(500, "Loan quota of 2 loans per month hit").getErrorResponse());
      }

      LocalDate bookingDate = LocalDate.now();
      LocalDate returnDate;

      if (loanDate.isAfter(bookingDate.plusWeeks(8)) || bookingDate.isEqual(loanDate)) {
        return ResponseEntity.status(500).body(
            new ResponseSchema(500, "Can only book loan 1 day to 8 weeks before visiting date")
                .getErrorResponse());
      }

      List<String> availablePassIds = loanService.getAvailablePasses(destination, loanDate);

      // Return details of borrowers of all passes that are out on loan on specified destination +
      // loanDate
      if (count > availablePassIds.size()) {
        return ResponseEntity.status(500).body(
            new ResponseSchema(500, "Not enough passes available currently").getErrorResponse());
      }

      returnDate = loanDate.plusDays(1);
      List<String> assignedPassIds = new ArrayList<>();

      for (int i = 0; i < count; i++) {
        assignedPassIds.add(availablePassIds.get(i));
      }

      Loan loan =
          new Loan(0, borrowerId, assignedPassIds, bookingDate, loanDate, returnDate, false, false);
      loanService.saveLoan(loan);

      User user = userService.getUser(borrowerId);
      log.info(String.format("Sending email to %s", user.getEmail()));
      // emailSender.sendEmailWithTemplate(user.getEmail(), "Confirmation", "confirmation-template",
      //     Map.of("user", user.getName(), "attractionName", destination, "date",
      //         loanDate.format(DateTimeFormatter.ofPattern("dd MMM yyyy"))),
      //     null);
      loanService.sendBookingConfirmation(loan);

      return ResponseEntity
          .ok(new ResponseSchema(200, (Object) "Loan created").getSuccessResponse());
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity.status(500)
          .body(new ResponseSchema(500, "Error creating loan").getErrorResponse());
    }
  }

  @PutMapping(value = "/gop/loan/edit")
  public ResponseEntity<HashMap<String, Object>> updateLoan(@RequestBody Loan loan) {
    try {
      loanService.updateLoan(loan);
      return ResponseEntity
          .ok(new ResponseSchema(200, (Object) "Loan updated").getSuccessResponse());
    } catch (Exception e) {
      if (e instanceof NoSuchElementException) {
        return ResponseEntity.status(404)
            .body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
      }
      return ResponseEntity.status(500)
          .body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  @DeleteMapping(value = "/user/loan/{loanId}")
  public ResponseEntity<HashMap<String, Object>> deleteLoan(@PathVariable int loanId) {
    try {
      loanService.deleteLoan(loanId);
      return ResponseEntity
          .ok(new ResponseSchema(200, (Object) "Loan deleted").getSuccessResponse());
    } catch (Exception e) {
      if (e instanceof NoSuchElementException) {
        return ResponseEntity.status(404)
            .body(new ResponseSchema(404, e.getMessage()).getErrorResponse());
      }
      return ResponseEntity.status(500)
          .body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  @GetMapping(value = "/user/loan/loanEligibility/{userId}/{loanMonth}")
  public ResponseEntity<HashMap<String, Object>> getLoanEligibility(@PathVariable String userId,
      @PathVariable int loanMonth) {
    try {
      boolean isEligible = loanService.getLoanEligibility(userId, loanMonth);
      return ResponseEntity.ok(new ResponseSchema(200, isEligible).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500).body(
          new ResponseSchema(500, (Object) "Error getting loan eligibility").getErrorResponse());
    }
  }

  @GetMapping(value = "/user/loan/loansByEmail/{email}")
  public ResponseEntity<HashMap<String, Object>> getLoansByEmail(@PathVariable String email) {
    try {
      List<LoanWithPass> loansByEmail = loanService.getLoansByEmail(email);
      return ResponseEntity.ok(new ResponseSchema(200, loansByEmail).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500).body(
          new ResponseSchema(500, (Object) "Error getting loans by email").getErrorResponse());
    }
  }

  /*
   * [Get] /user/destinations?startDate=2021-05-01&endDate=2021-05-31&destination=Zoo
   * 
   * { "status": 200, "data": [ { "date": "2021-05-01", "loanedPasses": 2, "loans": [ { "loanId": 1,
   * "borrowerName": "John Smith", "borrowerContact": "123456789", "loanDate": "2021-05-02",
   * "passes": [ { "passId": "123456789", "passType": "Physical", }, { "passId": "987654321",
   * "passType": "Digital", } ] } ] remainingPassCount: 2 remainingPasses: [ { "passId":
   * "123456790", "passType": "Physical", }, { "passId": "987654322", "passType": "Digital", } ] },
   * { "date": "2021-05-02", "loanedPasses": 1, "loans": [ { "loanId": 2, "borrowerName":
   * "John Smith", "borrowerContact": "123456789", "loanDate": "2021-05-02", "passes": [ { "passId":
   * "123456789", "passType": "Physical", } ] } ] remainingPassCount: 3 remainingPasses: [ {
   * "passId": "123456790", "passType": "Physical", }, { "passId": "987654322", "passType":
   * "Digital", }, { "passId": "123456791", "passType": "Physical", } ] }, .... ] }
   * 
   */
  @GetMapping(value = "/user/getAvailable")
  public ResponseEntity<HashMap<String, Object>> getAvailablePasses(@RequestParam String startDate,
      @RequestParam String endDate, @RequestParam String destination) {
    try {
      // System.out.println(startDate);
      // List<AvailablePasses> availablePasses = loanService.getAvailablePasses(startDate, endDate,
      // destination);
      HashMap<String, Object> loans = loanService.getAvailability(startDate, endDate, destination);
      System.out.println(loans);
      return ResponseEntity.ok(new ResponseSchema(200, loans).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500).body(
          new ResponseSchema(500, (Object) "Error getting available passes").getErrorResponse());
    }
  }

  @GetMapping(value = "/user/loan/upcoming/{email}")
  public ResponseEntity<HashMap<String, Object>> getUpcomingLoans(@PathVariable String email) {
    try {
      String id = email.split("@")[0];
      Loan[] upcomingLoans = loanService.getUpcomingLoans(id);
      return ResponseEntity.ok(new ResponseSchema(200, upcomingLoans).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500).body(
          new ResponseSchema(500, (Object) "Error getting upcoming loans").getErrorResponse());
    }
  }

  @GetMapping(value = "/user/loan/combined/{email}")
  public ResponseEntity<HashMap<String, Object>> getCombinedLoans(@PathVariable String email) {
    try {
      HashMap<String, Object> userMap = loanService.getAllLoans(email);
      return ResponseEntity.ok(new ResponseSchema(200, userMap).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500).body(
          new ResponseSchema(500, (Object) "Error getting combined loans").getErrorResponse());
    }
  }

  @GetMapping(value = "/gop/collectLoanPasses/{loanId}")
  public ResponseEntity<HashMap<String, Object>> collectLoanPasses(@PathVariable Integer loanId) {
    try {
      loanService.updatePassesCollected(loanId);
      return ResponseEntity
          .ok(new ResponseSchema(200, (Object) "Loan passes collected").getSuccessResponse());
    } catch (NoSuchElementException e) {
      return ResponseEntity.status(404)
          .body(new ResponseSchema(404, "Loan not found").getErrorResponse());
    } catch (InvalidInvocationException e) {
      return ResponseEntity.status(401)
          .body(new ResponseSchema(401, e.getMessage()).getErrorResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500).body(
          new ResponseSchema(500, (Object) "Error collecting loan passes").getErrorResponse());
    }
  }

  @GetMapping(value = "/gop/returnLoanPasses/{loanId}")
  public ResponseEntity<HashMap<String, Object>> returnLoanPasses(@PathVariable Integer loanId) {
    try {
      loanService.updatePassesReturned(loanId);
      return ResponseEntity
          .ok(new ResponseSchema(200, (Object) "Loan passes returned").getSuccessResponse());
    } catch (NoSuchElementException e) {
      return ResponseEntity.status(404)
          .body(new ResponseSchema(404, "Loan not found").getErrorResponse());
    } catch (InvalidInvocationException e) {
      return ResponseEntity.status(401)
          .body(new ResponseSchema(401, e.getMessage()).getErrorResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500)
          .body(new ResponseSchema(500, "Error returning loan passes").getErrorResponse());
    }
  }
}
