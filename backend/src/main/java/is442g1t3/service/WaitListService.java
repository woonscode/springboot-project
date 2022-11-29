package is442g1t3.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import is442g1t3.domain.WaitList;
import is442g1t3.repository.WaitListRepo;

@Service
public class WaitListService {
  @Autowired
  private WaitListRepo waitListRepo;
  @Autowired
  private EmailSender emailSender;

  public WaitList[] getUserWaitList(String email) {
    return waitListRepo.findByEmail(email);
  }

  public Boolean addUserWaitList(WaitList waitList) {
    waitListRepo.save(waitList);
    return true;
  }

  public WaitList[] getWaitListByDate(String startDate, String endDate) {
    DateTimeFormatter formatters = DateTimeFormatter.ofPattern("dd/MM/uuuu");
    LocalDate start = LocalDate.parse(startDate, formatters);
    LocalDate end = LocalDate.parse(endDate, formatters);
    return waitListRepo.findByDateBetween(start, end);
  }

  public WaitList[] getWaitListByDestination(String destination) {
    return waitListRepo.findByDestination(destination);
  }

  private WaitList[] getWaitListByEmailAndDestination(WaitList waitList) {
    return waitListRepo.findByDestinationAndEmailAndDate(waitList.getDestination(),
        waitList.getEmail(), waitList.getDate());
  }

  public Boolean removeWaitList(WaitList waitList) {
    WaitList[] waitListArray = getWaitListByEmailAndDestination(waitList);
    if (waitListArray.length == 0) {
      return false;
    } else {
      for (WaitList waitList2 : waitListArray) {
        waitListRepo.delete(waitList2);
      }
    }
    return true;
  }

  public List<WaitList> getAllWaitList() {
    return waitListRepo.findAll();
  }

  public void notifyAllWaitList(String destination) {
    for (WaitList w : getAllWaitList()) {
      if (w.getDestination().equals(destination) && w.getDate().isAfter(LocalDate.now())) {
        String subject =
            String.format("Cancellation of Waitlist %d for %s on %s", w.getWaitListId(),
                w.getDestination(), w.getDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        String body = String.format(
            "Dear Sir/Mdm, please note that the Waitlist pass for %s has been lost or cancelled. You have been removed from the Waitlist.",
            w.getDestination());
        emailSender.sendEmail(w.getEmail(), subject, body);
      }
    }
  }

}
