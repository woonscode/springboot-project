package is442g1t3.service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import is442g1t3.domain.CollectionReminderEmailQueue;
import is442g1t3.domain.EmailQueue;
import is442g1t3.domain.PaymentReminderEmailQueue;
import is442g1t3.domain.ReturnReminderEmailQueue;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailSender {

  private JavaMailSender mailSender;

  private Configuration cfg;
  @Value("${spring.mail.username}")
  private String from;

  @Autowired
  private EmailQueueService emailQueueService;
  
  @Autowired 
  private PDFGenerator pdfGenerator;

  public EmailSender(JavaMailSender mailSender) throws IOException {
    this.mailSender = mailSender;
    // Settings from freemarker documentation
    cfg = new Configuration(Configuration.VERSION_2_3_29);
    // cfg.setDirectoryForTemplateLoading(new File("data/templates/"));
    cfg.setClassForTemplateLoading(this.getClass(), "/data/templates/");
    cfg.setDefaultEncoding("UTF-8");
    // Possible to set to RETHROW_HANDLER
    cfg.setTemplateExceptionHandler(TemplateExceptionHandler.HTML_DEBUG_HANDLER);
    cfg.setLogTemplateExceptions(false);
    cfg.setWrapUncheckedExceptions(true);
    cfg.setFallbackOnNullLoopVariable(false);
  }

  public void sendEmail(String to, String subject, String message) {

    SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
    // Set the sender, recipient, subject and text, from using environment variables
    // from application.properties
    simpleMailMessage.setFrom(System.getenv("EMAIL_USERNAME"));
    simpleMailMessage.setTo(to);
    simpleMailMessage.setSubject(subject);
    simpleMailMessage.setText(message);

    this.mailSender.send(simpleMailMessage);
  }

  public void sendEmailWithDefaultAttachment(String to, String subject, String templateName, Map<String, String> args) throws MessagingException, IOException, TemplateException  {
      log.info(String.format("Sending default attachment email to %s with template: %s ", to, templateName));
      sendEmailWithTemplateAndAttachment(to, subject, templateName, args, "LOA.pdf" );
  }

  public void sendEmailWithTemplate(String to, String subject, String templateName,Map<String, String> args) throws MessagingException, IOException, TemplateException  {

    log.info(String.format("Sending email to %s with template: %s ", to, templateName));
    MimeMessage message = mailSender.createMimeMessage();
    Template temp;
    StringWriter out = new StringWriter();

    MimeMessageHelper helper = new MimeMessageHelper(message, true);
    helper.setFrom(this.from);
    
    helper.setTo(to);
    helper.setSubject(subject);
    temp = cfg.getTemplate(templateName);
    temp.process(args, out);

    // This will send the result as html
    helper.setText(out.toString(), true);

    this.mailSender.send(message);
  }

  public void sendEmailWithTemplateAndAttachment(String toEmail, String subject, String templateName,Map<String, String> args, String attachmentName) throws MessagingException, IOException, TemplateException {

    MimeMessage message = mailSender.createMimeMessage();
    Template temp;
    StringWriter out = new StringWriter();

    // try {
    MimeMessageHelper helper = new MimeMessageHelper(message, true);
    helper.setFrom(this.from);
    helper.setTo(toEmail);
    helper.setSubject(subject);
    temp = cfg.getTemplate(templateName);
    temp.process(args, out);
    System.out.println("test");
    // This will send the result as html
    helper.setText(out.toString(), true);
    // File file = new File("data/"+attachmentName);
    ByteArrayOutputStream bos = pdfGenerator.generateLOA(args.get("userName"), args.get("date"));
    
    helper.addAttachment(attachmentName, new ByteArrayResource(bos.toByteArray()));
    
    this.mailSender.send(message);
  }

/**
 * Scheduled job to parse all collection reminders in the queue and send emails
 */

  // polymorphic consumption of email queue from different queues and sending emails
  public void consumeEmailQueue(){
    List<EmailQueue> emailQueueList = emailQueueService.getAllEmailQueue();
    // System.out.println(emailQueueList);
    for (EmailQueue emailQueue : emailQueueList) {
      if (emailQueue.isSent()) {
        continue;
      }
      try{
        if (emailQueue instanceof CollectionReminderEmailQueue) {
          CollectionReminderEmailQueue collectionReminderEmailQueue = (CollectionReminderEmailQueue) emailQueue;
          String email = collectionReminderEmailQueue.getToEmail().trim();
          String subject = collectionReminderEmailQueue.getSubject().trim();
          String userName = collectionReminderEmailQueue.getUserName().trim();
          String passType = collectionReminderEmailQueue.getPassType();
          List<String> passIds = collectionReminderEmailQueue.getPassIdList();
          String destinationName = collectionReminderEmailQueue.getDestinationName();
          LocalDate loanDate = collectionReminderEmailQueue.getLoanDate();
          String template = collectionReminderEmailQueue.getTemplateName();
          // Send email
          Map<String, String> args = new HashMap<>();
          args.put("userName", userName);
          args.put("passType", passType);
          args.put("passIdList", passIds.toString());
          args.put("destinationName", destinationName);
          args.put("date", loanDate.toString());
          if (passType.equals("physical")){
            // args.put("attachmentName", "LOA.pdf"); 
            System.out.println(email);
            System.out.println(args);
            sendEmailWithTemplateAndAttachment(email, subject,template,args, "LOA.pdf");
          }else{
            sendEmailWithTemplate(email, subject, template, args);
          }
          // Update email queue
          emailQueueService.updateEmailSent(collectionReminderEmailQueue);
        } 
        else if (emailQueue instanceof ReturnReminderEmailQueue) {
          ReturnReminderEmailQueue returnReminderEmailQueue = (ReturnReminderEmailQueue) emailQueue;
          // System.out.println(returnReminderEmailQueue);
          String email = returnReminderEmailQueue.getToEmail();
          String subject = returnReminderEmailQueue.getSubject();
          String userName = returnReminderEmailQueue.getUserName();
          String destinationName = returnReminderEmailQueue.getDestinationName();
          String nextUserName = returnReminderEmailQueue.getNextUserName();
          List<String> nextUserPassIdList = returnReminderEmailQueue.getNextUserPassIdList();
          String nextUserName2 = returnReminderEmailQueue.getNextUserName();
          List<String> nextUserPassIdList2 = returnReminderEmailQueue.getNextUserPassIdList2();
          List<String> gopPassIdList = returnReminderEmailQueue.getGopPassIdList();
          String template = returnReminderEmailQueue.getTemplateName();
          // Send email
          Map<String, String> args = new HashMap<>();
          args.put("userName", userName);
          args.put("destinationName", destinationName);
          args.put("nextUserName", nextUserName);
          args.put("nextUserPassIdList", nextUserPassIdList.toString());
          args.put("nextUserName2", nextUserName2);
          args.put("nextUserPassIdList2", nextUserPassIdList2.toString());
          args.put("gopPassIdList", gopPassIdList.toString());

          System.out.println(args);
          sendEmailWithTemplate(email, subject, template, args);
          // Update email queue
          emailQueueService.updateEmailSent(returnReminderEmailQueue);
        } else if (emailQueue instanceof PaymentReminderEmailQueue) {
          PaymentReminderEmailQueue paymentReminderEmailQueue = (PaymentReminderEmailQueue) emailQueue;
          // System.out.println(paymentReminderEmailQueue);
          String email = paymentReminderEmailQueue.getToEmail();
          String subject = paymentReminderEmailQueue.getSubject();
          String userName = paymentReminderEmailQueue.getUserName();
          Double fine = paymentReminderEmailQueue.getAmount();
          String template = paymentReminderEmailQueue.getTemplateName();
          // Send email
          Map<String, String> args = new HashMap<>();
          args.put("userName", userName);
          args.put("fine", fine.toString());
          // System.out.println(args);
          sendEmailWithTemplate(email, subject, template, args);
          // Update email queue
          emailQueueService.updateEmailSent(paymentReminderEmailQueue);
        } 

      } catch (MessagingException e) {
        log.error("Messaging exception: " + e.getMessage());
      } catch (TemplateException e) {
        log.error("Template processing error: " + e.getMessage());
      } catch (IOException e) {
        log.error("Template IO error: " + e.getMessage());
      }
    }
  }

  @Scheduled(fixedRate = 10000)
  public void sendEmails() {
    consumeEmailQueue();
  }
  // public void consumeCollectionReminderQueue(){
	// 	CollectionReminderEmailQueue[] queues = collectionReminderEmailQueueRepo.findAll().toArray(new CollectionReminderEmailQueue[0]);
	// 	for (CollectionReminderEmailQueue queue : queues) {
	// 		String email = queue.getToEmail();
	// 		String subject = queue.getSubject();
	// 		String userName = queue.getUserName();
	// 		String passType = queue.getPassType();
	// 		List<String> passIds = queue.getPassIdList();
	// 		String destinationName = queue.getDestinationName();
	// 		LocalDate loanDate = queue.getLoanDate();
	// 		String template = queue.getTemplateName();
	// 		// Send email
	// 		// emailService.sendCollectionReminderEmail(email, subject, userName, passType, passIds, destinationName, loanDate, template);
	// 		System.out.println("Sending email");
	// 		System.out.println("" + email+ subject+ userName+ passType+ passIds+ destinationName+ loanDate+ template);
			
	// 		// Delete queue
	// 		// collectionReminderEmailQueueRepo.delete(queue);
	// 	}
	// }

  // @Scheduled(fixedDelay=100000)
  // public void sendEPassEmailConfirmation() {
  //   String to = "ngshenjie@gmail.com";
  //   String userName = "Shenjie";
  //   String destinationName = "Singapore";
  //   String date = "2021-12-12";
  //   String passIdList = "123456789, 987654321";

  //   // This is just a test to see if the email is sent
  //   sendEmailWithTemplate(to, "Booking is confirmed", "epass_confirmation.html", Map.of(
  //       "userName", userName,
  //       "destinationName", destinationName,
  //       "date", date,
  //       "passIdList", passIdList
  //   ));
  // }

  // @Scheduled(fixedDelay=100000)
  // public void sendPPassEmailConfirmation() {
  //   String to = "ngshenjie@gmail.com";
  //   String userName = "Shenjie";
  //   String destinationName = "Singapore";
  //   String date = "2021-12-12";
  //   String passIdList = "123456789, 987654321";

  //   // This is just a test to see if the email is sent
  //   sendEmailWithTemplate(to, "Booking is confirmed", "ppass_confirmation.html", Map.of(
  //       "userName", userName,
  //       "destinationName", destinationName,
  //       "date", date,
  //       "passIdList", passIdList
  //   ));
  // }

  // @Scheduled(fixedDelay=100000)
  // public void sendPPassEmailConfirmationWithLOA() {
  //   String to = "ngshenjie@gmail.com";
  //   String userName = "Shenjie";
  //   String destinationName = "Singapore";
  //   String date = "2021-12-12";
  //   String passIdList = "123456789, 987654321";
  //   String attachmentName = "LOA.pdf";

  //   // This is just a test to see if the email is sent
  //   sendEmailWithTemplateAndAttachment(to, "Booking is confirmed", "ppass_confirmation.html", Map.of(
  //       "userName", userName,
  //       "destinationName", destinationName,
  //       "date", date,
  //       "passIdList", passIdList
  //   ), attachmentName);
  // }

  // @Scheduled(fixedDelay=100000)
  // public void sendPPassEmailConfirmationWithLOA() {
  //   String to = "ngshenjie@gmail.com";
  //   String userName = "Shenjie";
  //   String destinationName = "Singapore";
  //   String nextUserName = "Woons";
  //   String nextUserPassIdList = "123456789,987654321";
  //   String gopPassIdList = "";
  //   System.out.println("Sending email");
  //   // This is just a test to see if the email is sent
  //   sendEmailWithTemplate(to, "Reminder: Return Physical Pass", "ppassReturn.html", Map.of(
  //       "userName", userName,
  //       "destinationName", destinationName,
  //       "nextUserName", nextUserName,
  //       "nextUserPassIdList", nextUserPassIdList,
  //       "gopPassIdList", gopPassIdList
  //   ));
  //   System.out.println("Email sent");
  // }

  
}
