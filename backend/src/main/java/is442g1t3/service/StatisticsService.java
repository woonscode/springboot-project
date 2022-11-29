package is442g1t3.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.springframework.stereotype.Service;
import is442g1t3.domain.Loan;
import is442g1t3.domain.Pass;
import is442g1t3.domain.User;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsService {
  private final UserService userService;
  private final LoanService loanService;
  private final PassService passService;

  public Map<String, Object> getPassStatistics(String start, String end) {
    Map<String, Object> outputMap = new HashMap<>();
    Map<String, List<Pass>> allPasses = passService.getPasses();
    for (Entry<String, List<Pass>> entry : allPasses.entrySet()) {
      String destination = entry.getKey();
      List<Pass> destinationPasses = entry.getValue();

      if (!outputMap.containsKey(destination)) {
        Map<String, Object> destinationStat = new HashMap<>();
        destinationStat.put("totalLoan", 0);

        List<Map<String, Object>> passArr = new ArrayList<>();

        for (Pass p : destinationPasses) {
          Map<String, Object> passStats = new HashMap<>();
          passStats.put("numLoans", 0);
          passStats.put("passType", "physical");
          passStats.put("passId", p.getPassId());
          passArr.add(passStats);
        }
        destinationStat.put("passData", passArr);
        outputMap.put(destination, destinationStat);
      }
    }

    Loan[] allLoans = loanService.getLoansBetween(start, end);
    for (Loan l : allLoans) {
      List<String> passArr = l.getPassIds();
      for (String passId : passArr) {
        Pass p = passService.getPass(passId);
        String destination = p.getDestination();

        // locate destination in outputMap
        if (outputMap.keySet().contains(destination)) {
          Map<String, Object> destinationMap = (Map<String, Object>) outputMap.get(destination);
          destinationMap.put("totalLoan", (Integer) destinationMap.get("totalLoan") + 1);
          List<Map<String, Object>> destinationPassArr =
              (List<Map<String, Object>>) destinationMap.get("passData");

          for (Map<String, Object> passStat : destinationPassArr) {
            if (passStat.get("passId") == passId) {
              passStat.put("numLoans", (Integer) passStat.get("numLoans") + 1);
            }
          }
        }
      }
    }
    return outputMap;
  }

  public Map<String, Object> getUserStatistics() {
    Map<String, Object> outputMap = new HashMap<>();
    List<User> allUsers = userService.getAllUsers();
    outputMap.put("totalUsers", allUsers.size());
    outputMap.put("numUsersWithOutstandingFine", 0);
    outputMap.put("totalOutstandingFine", 0.0);
    List<User> usersWithOutstandingFine = new ArrayList<>();
    for (User u : allUsers) {
      if (u.getFine() > 0) {
        outputMap.put("numUsersWithOutstandingFine",
            (Integer) outputMap.get("numUsersWithOutstandingFine") + 1);
        outputMap.put("totalOutstandingFine",
            (Double) outputMap.get("totalOutstandingFine") + u.getFine());
        usersWithOutstandingFine.add(u);
      }
    }
    outputMap.put("usersWithOutstandingFine", usersWithOutstandingFine);
    return outputMap;
  }

}
