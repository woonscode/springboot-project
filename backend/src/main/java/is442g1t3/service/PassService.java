package is442g1t3.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

import is442g1t3.domain.Pass;
import is442g1t3.domain.User;
import is442g1t3.repository.PassRepo;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PassService {
  private final PassRepo passRepo;
  private final UserService userService;

/**
 * Creates a new pass and saves it into the database, input Pass must be a valid Pass object 
 * @param pass an object containing all the details associated with a pass
 * @see Pass a Pass object
 */

  public void createPass(Pass pass) {
    passRepo.save(pass);
  }

/**
 * Gets all passes from the database
 * @return a map with destination as the key and the list of passes associated with the destination as the value
 * @see Pass a Pass object
 */

  public Map<String, List<Pass>> getPasses() {
    List<Pass> passes = passRepo.findAll();
    Map<String, List<Pass>> passesByDest = new HashMap<>();
    for (Pass pass : passes) {
      String newKey = pass.getDestination();
      if (!passesByDest.containsKey(newKey)) {
        List<Pass> newValue = new ArrayList<>();
        newValue.add(pass);
        passesByDest.put(newKey, newValue);
      } else {
        passesByDest.get(newKey).add(pass);
      }
    }
    return passesByDest;
  }

/**
 * Gets the pass associated with the pass ID from the database
 * @param passId the pass ID of the pass to be retrieved
 * @return a single Pass object
 * @see Pass a Pass object
 */

  public Pass getPass(String passId) {
    return passRepo.findById(passId).get();
  }

/**
 * Updates the pass details of the pass with the given pass ID in the database
 * @param passId the pass ID of the pass to be updated
 * @see Pass a Pass object
 */

  public void updatePass(String passId, Pass pass) {
    Pass databaseRecord = passRepo.findById(passId).get();

    databaseRecord.setPassId(pass.getPassId());
    databaseRecord.setDestination(pass.getDestination());
    databaseRecord.setAdmissionDetails(pass.getAdmissionDetails());
    databaseRecord.setStatus(pass.getStatus());
    databaseRecord.setReplacementFee(pass.getReplacementFee());

    passRepo.save(databaseRecord);
  }

  public void deletePass(String passId) {
    Pass pass = passRepo.findById(passId).get();
    passRepo.delete(pass);
  }

  public List<String> getPassIdsByDestination(String destination) {
    List<Pass> allPassesByDestination = passRepo.findByDestination(destination);
    List<String> allPassIdsByDestination = new ArrayList<>();
    for (Pass pass : allPassesByDestination) {
      allPassIdsByDestination.add(pass.getPassId());
    }
    return allPassIdsByDestination;
  }

  public void reportLostPass(String passId, String email) {
    User user = userService.getUser(email.split("@")[0]);
    if (user != null) {
      Pass pass = passRepo.findById(passId).get();
      pass.setStatus("Lost");
      Double replacementFee = pass.getReplacementFee();
      user.setFine(user.getFine() + replacementFee);
      userService.updateUser(email, user);
      passRepo.save(pass);
    } else {
      throw new RuntimeException("User does not exist");
    }
  }
}
