package is442g1t3.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import is442g1t3.domain.InviteLink;
import is442g1t3.repository.InviteLinkRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class InviteLinkService {
  private final InviteLinkRepo inviteLinkRepo;
  private final EmailSender emailSender;
  private final UserService userService;
  @Value("${my.frontendUrl}")
  private String redirectUrl;

  // Helper function to generate invite code with 6 random characters
  public String generateInviteCode(String empEmail) {
    // check if email is already in use
    if (userService.checkEmailExists(empEmail)) {
      throw new RuntimeException("Email already in use");
    }
    String inviteCode = "";
    for (int i = 0; i < 6; i++) {
      int random = (int) (Math.random() * 26 + 97);
      inviteCode += (char) random;
    }
    // get email id from email address
    String emailId = empEmail.substring(0, empEmail.indexOf("@"));
    return emailId + inviteCode;
  }

  // Helper function to append invite code to base url
  public String generateInviteLink(String inviteCode) {
    return redirectUrl + "/auth/completeRegistration/" + inviteCode;
  }

  // Generate Invite Link and send to Email
  public Boolean generateInviteLinkAndSendEmail(String empEmail) {
    String inviteCode = generateInviteCode(empEmail);
    String inviteLink = generateInviteLink(inviteCode);
    inviteLinkRepo.save(new InviteLink(empEmail, inviteCode));
    emailSender.sendEmail(empEmail, "Complete your registration", inviteLink);
    return true;
  }

  // Given an invite link, return the corresponding email address
  public String getEmailFromInviteCode(String inviteCode) {
    List<InviteLink> inviteLinkObj = inviteLinkRepo.findAll();
    for (InviteLink i : inviteLinkObj) {
      if (i.getCode().equals(inviteCode)) {
        return i.getEmpEmail();
      }
    }
    return null;
  }

  // Delete invite link from database from empEmail (after creating users)
  public void deleteInviteLink(String empEmail) {
    try {
      inviteLinkRepo.deleteById(empEmail);
    } catch (Exception e) {
      log.error("Invite Link has already been deleted");
    }
  }

}
