package is442g1t3.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import org.springframework.jmx.access.InvalidInvocationException;
import org.springframework.stereotype.Service;
import is442g1t3.domain.CollectionReminderEmailQueue;
import is442g1t3.domain.Loan;
import is442g1t3.domain.Pass;
import is442g1t3.domain.ReturnReminderEmailQueue;
import is442g1t3.domain.User;
import is442g1t3.domain.WaitList;
import is442g1t3.dto.LoanWithPass;
import is442g1t3.repository.CollectionReminderEmailQueueRepo;
import is442g1t3.repository.LoanRepo;
import is442g1t3.repository.ReturnReminderQueueRepo;
import is442g1t3.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanService {

	private final LoanRepo loanRepo;
	private final UserRepo userRepo;
	private final PassService passService;
	private final UserService userService;
	private final WaitListService waitListService;
	private final DestinationService destinationService;
	private final EmailQueueService emailQueueService;
	
/**
 * Creates a loan and saves it into the database
 * @param loan the loan object, with all the necessary details, to be saved into the database
 * @see Loan a Loan object
 */

	// No SQLIntegrity exception catch needed as Loan primary key is auto-generated
	public void saveLoan(Loan loan) {
		loanRepo.save(loan);
	}

/**
 * Gets all loans from the database
 * @return a list of all loans, with pass details included
 * @see Loan a Loan object
 */

	public List<LoanWithPass> getAllLoans() {
		List<Loan> allLoans = loanRepo.findAll();
		List<LoanWithPass> loanWithPassList = new ArrayList<>();
		System.out.println(allLoans);

		for (Loan loan : allLoans) {
			System.out.println(loan);
			loanWithPassList.add(createLoanWithPass(loan));
		}

		return loanWithPassList;
	}

/**
 * Gets the loan with the given loan ID from the database
 * @param loanId the loan ID of the loan to be retrieved
 * @return the Loan object with the given loan ID
 * @see Loan a Loan object
 */

	public LoanWithPass getLoan(int loanId) {
		try {
			Loan loan = loanRepo.findById(loanId).get();
			System.out.println(loan);
			return createLoanWithPass(loan);
		} 
		catch (Exception e) {

			if (e instanceof NoSuchElementException) {
				throw new NoSuchElementException("Loan does not exist");
			}

			throw new RuntimeException("Error getting loan");
		}
	}

/**
 * Helper function to combine the full pass details into the loan to be returned by other APIs, not directly called by a service
 * @param loanId the loan ID of the loan to be retrieved
 * @return a LoanWithPass object 
 * @see Loan a Loan object
 * @see Pass a Pass object
 */

	private LoanWithPass createLoanWithPass(Loan loan) {
		List<String> passIds = loan.getPassIds();
		List<Pass> passList = new ArrayList<>();

		for (String passId : passIds) {
			try{
				Pass pass = passService.getPass(passId);
				passList.add(pass);
			}catch(Exception e){
				System.out.println(e.getMessage());
			}
		}

		LoanWithPass loanWithPass = new LoanWithPass(loan.getLoanId(), loan.getBorrowerId(), passList, loan.getBookingDate(), loan.getLoanDate(), loan.getReturnDate(), loan.isCollected(), loan.isReturned());

		return loanWithPass;
	}


	/**
	 * @param loan
	 */
	public void updateLoan(Loan loan) {
		try {
			Loan updatedLoan = loanRepo.findById(loan.getLoanId()).get();
			updatedLoan.setBorrowerId(loan.getBorrowerId());
			updatedLoan.setPassIds(loan.getPassIds());
			updatedLoan.setBookingDate(loan.getBookingDate());
			updatedLoan.setLoanDate(loan.getLoanDate());
			updatedLoan.setReturnDate(loan.getReturnDate());
			updatedLoan.setCollected(loan.isCollected());
			updatedLoan.setReturned(loan.isReturned());
			loanRepo.save(updatedLoan);
		}
		catch (Exception e) {
			
			if (e instanceof NoSuchElementException) {
				throw new NoSuchElementException("Loan does not exist");
			}

			throw new RuntimeException("Error updating loan");
		}
	}

/**
 * Deletes the loan associated with the given loan ID
 * @param loanId the loan ID of the loan to be deleted
 * @see Loan a Loan object
 */

	public void deleteLoan(int loanId) {
		try {
			Loan loan = loanRepo.findById(loanId).get();

			if (loan.getLoanDate().isEqual(LocalDate.now())) {
				throw new RuntimeException("Cannot cancel loan less than 1 day before loan date");
			}

			loanRepo.delete(loan);
		} 
		catch (Exception e) {

			if (e instanceof NoSuchElementException) {
				throw new NoSuchElementException("Loan does not exist");
			}

			throw new RuntimeException("Error deleting loan");
		}
	}

/**
 * Gets all passes that are available for the given destination on the given date
 * @param destination the destination to query to get all passes from
 * @param loanDate the loan date to query to check whether it is available
 * @return a list of Pass IDs that are available on the given date
 * @see Loan a Loan object
 */

	public List<String> getAvailablePasses(String destination, LocalDate loanDate) {
		List<String> allPassIdsByDestination = passService.getPassIdsByDestination(destination);
		List<Loan> allLoans = loanRepo.findAll();

		for (Loan loan : allLoans) {
			if (loan.getLoanDate().isEqual(loanDate)) {
				List<String> passIdList = loan.getPassIds();

				for (String passId : passIdList) {
					allPassIdsByDestination.remove(passId);
				}
			}
		}
		return allPassIdsByDestination;
	} 

/**
 * Checks whether user has hit the quota of 2 loans per month
 * @param userId the user ID of the user to check
 * @param loanMonth the month to check the number of loans the user has made
 * @return a boolean, true if user is eligible to make more loans, false if user is ineligible
 * @see User a User object
 * @see Loan a Loan object
 */

	public boolean getLoanEligibility(String userId, int loanMonth) {
		int limit = 2;

		// Create start of month date and end of month date
		LocalDate startDate = LocalDate.of(LocalDate.now().getYear(), loanMonth, 1);
		LocalDate endDate = startDate.with(TemporalAdjusters.lastDayOfMonth());

		// Get all loans for user in month
		Loan[] userLoans = loanRepo.findByBorrowerIdAndLoanDateBetween(userId, startDate, endDate);

		if (userLoans.length >= limit) {
			return false;
		}
		return true;
	}

/**
 * Gets all the loans between given start date and end date
 * @param startDate start of the date range to get loans from
 * @param endDate end of the date range to get loans from
 * @return an array of Loan objects which lies within the date range
 * @see Loan a Loan object
 */

	public Loan[] getLoansBetween(String startDate, String endDate) {
		DateTimeFormatter formatters = DateTimeFormatter.ofPattern("dd/MM/uuuu");
		LocalDate start = LocalDate.parse(startDate, formatters);
		LocalDate end = LocalDate.parse(endDate, formatters);
		Loan[] allLoans = loanRepo.findByLoanDateBetween(start, end);
		return allLoans;
	}

/**
 * Gets all the upcoming loans of the given user, which is compared with the current date
 * @param userId user ID to check
 * @return an array of Loan objects for upcoming loans
 * @see Loan a Loan object
 */

	public Loan[] getUpcomingLoans(String userId) {
		LocalDate today = LocalDate.now();
		return loanRepo.findByBorrowerIdAndLoanDateAfter(userId, today);
	}

/**
 * Gets all available passes within the date range and for the given destination
 * @param startDate start of the date range to get passes from
 * @param endDate end of the date range to get passes from
 * @return a hash map that shows whether a pass is booked and if it is, shows the borrower's details for that pass
 * @see Loan a Loan object
 */

	public HashMap<String,Object> getAvailability(String startDate, String endDate, String destination) {
		HashMap<String,Object> availability = new HashMap<>();

		// Iterate through localDate range
		DateTimeFormatter formatters = DateTimeFormatter.ofPattern("dd/MM/uuuu");
		LocalDate start = LocalDate.parse(startDate, formatters);
		LocalDate end = LocalDate.parse(endDate, formatters);

		// Get all passIds for destination
		List<String> allPassIdsByDestination = passService.getPassIdsByDestination(destination);
		System.out.println(allPassIdsByDestination);
		Integer totalPasses = allPassIdsByDestination.size();
		availability.put("destination", destination);
		availability.put("totalPasses", totalPasses);

		// Get all loans
		Loan[] loanInTimeRange = loanRepo.findByLoanDateBetween(start, end);
		System.out.println(loanInTimeRange.length);

		// List<LocalDate> dateRange = new ArrayList<>();
		for (LocalDate date = start; date.isBefore(end.plusDays(1)); date = date.plusDays(1)) {
			// dateRange.add(date);
			HashMap<String,HashMap<String,Object>> dailyAvailability = new HashMap<>();
			ArrayList<HashMap<String,Object>> bookedPasses = new ArrayList<>();
			ArrayList<String> availablePasses = new ArrayList<>(allPassIdsByDestination);

			for (Loan loan : loanInTimeRange) {
				if (loan.getLoanDate().isEqual(date)) {
					List<String> bookedPassesId = loan.getPassIds();
					for (String passId : bookedPassesId) {
						availablePasses.remove(passId);
						HashMap<String,Object> passDetails = new HashMap<>();
						passDetails.put("passId", passId);
						try{
							User user = userService.getUser(loan.getBorrowerId());
							passDetails.put("bookedBy", user.getName());
							passDetails.put("contact", user.getPhoneNo());
						}catch(Exception e){
							System.out.println(e.getMessage());
							passDetails.put("bookedBy", "User not found");
							passDetails.put("contact", "User not found");
						}
						bookedPasses.add(passDetails);
					}
				}
			}

			dailyAvailability.put("booked", new HashMap<String,Object>() {{
				put("passes", bookedPasses);
				put("count", bookedPasses.size());
			}});
			dailyAvailability.put("available", new HashMap<String,Object>() {{
				put("passes", availablePasses);
				put("count", availablePasses.size());
			}});

			availability.put(date.toString(),dailyAvailability);
		}
		return availability;
	}

/**
 * Gets all the loans for the given email
 * @param email user email to get loans for
 * @return a list of Loan objects with the full details of their associated passes
 * @see Loan a Loan object
 */

	public List<LoanWithPass> getLoansByEmail(String email) {
		List<User> users = userRepo.findByEmail(email);
		String empId = users.get(0).getEmpId();

		List<LoanWithPass> loansByEmail = new ArrayList<>();
		List<LoanWithPass> allLoans = getAllLoans();

		for (LoanWithPass loanWithPass : allLoans) {
			if (loanWithPass.getBorrowerId().equals(empId)) {
				loansByEmail.add(loanWithPass);
			}
		}

		return loansByEmail;
	}

/**
 * Gets all the loans for the given email
 * @param email user email to get loans for
 * @return a hash map of loans, with their associated pass details, for all users
 * @see Loan a Loan object
 */

	public HashMap<String,Object> getAllLoans(String email) {
		HashMap<String,Object> userMap = new HashMap<>();
		List<LoanWithPass> userLoans = getLoansByEmail(email);
		WaitList[] userWaitList = waitListService.getUserWaitList(email);
		userMap.put("email", email);
		userMap.put("waitlist", userWaitList);
		ArrayList<HashMap<String,Object>> upcoming = new ArrayList<>();
		ArrayList<LoanWithPass> overdue = new ArrayList<>();
		ArrayList<LoanWithPass> completed = new ArrayList<>();
		
		for (LoanWithPass loan : userLoans) {
			if (loan.getLoanDate().isBefore(LocalDate.now())) {
				if (loan.getReturnDate().isBefore(LocalDate.now()) && !loan.getReturned()) {
					overdue.add(loan);
				} else {
					completed.add(loan);
				}
			} else {
				HashMap<String,Object> collectionDetails = new HashMap<>();
				// Spread loan details into collectionDetails
				collectionDetails.put("loanId", loan.getLoanId());
				collectionDetails.put("borrowerId", loan.getBorrowerId());
				collectionDetails.put("loanDate", loan.getLoanDate());
				collectionDetails.put("returnDate", loan.getReturnDate());
				collectionDetails.put("passes", loan.getPasses());
				collectionDetails.put("bookingDate", loan.getBookingDate());
				collectionDetails.put("collected", loan.getCollected());
				collectionDetails.put("returned", loan.getReturned());

				if (!loan.getCollected()) {
					List<Pass> passes = loan.getPasses();
					System.out.println(passes);
					ArrayList<HashMap<String,Object>> passCollectionDetails = new ArrayList<>();
					for (Pass p:passes){
						String passId = p.getPassId();
						User collectFrom = getPreviousUserDetails(passId, loan.getLoanDate());
						System.out.println(loan.getLoanDate());
						System.out.println(collectFrom);
						HashMap<String,Object> passDetails = new HashMap<>();
						passDetails.put("passId", passId);
						if (collectFrom != null){
							passDetails.put("collectFrom", collectFrom.getName());
							passDetails.put("contact", collectFrom.getPhoneNo());
						}else{
							passDetails.put("collectFrom", "General Office");
						}
						passCollectionDetails.add(passDetails);
					}
					collectionDetails.put("passCollectionDetails", passCollectionDetails);
				}else{
					collectionDetails.put("passCollectionDetails", null);
				}
				upcoming.add(collectionDetails);
			} 
		}
		userMap.put("upcoming", upcoming);
		userMap.put("overdue", overdue);
		userMap.put("completed", completed);
		return userMap;
	}

/**
 * Updates the loan to change its state to collected
 * @param loanId loan ID of the loan to update
 * @see Loan a Loan object
 */

	public void updatePassesCollected(Integer loanId) {
		Loan loan = loanRepo.findById(loanId).get();
		if (loan.isCollected()) {
			throw new InvalidInvocationException("Passes already collected");
		}
		loan.setCollected(true);
		loanRepo.save(loan);
	}

/**
 * Updates the loan to change its state to returned
 * @param loanId loan ID of the loan to update
 * @see Loan a Loan object
 */

	public void updatePassesReturned(Integer loanId) {
		Loan loan = loanRepo.findById(loanId).get();
		if (loan.isReturned()) {
			throw new InvalidInvocationException("Passes already returned");
		}
		loan.setReturned(true);
		loan.setReturnDate(LocalDate.now());
		loanRepo.save(loan);
	}

/**
 * Returns the details of the previous borrower
 * @param passId pass ID of the pass to query
 * @param returnDate date that the pass is returned
 * @see Loan a Loan object
 * @see Pass a Pass object
 */

	private User getPreviousUserDetails(String passId, LocalDate returnDate){
			Loan[] loans = loanRepo.findByReturnDate(returnDate);
			for (Loan loan : loans) {
				List<String> passIds = loan.getPassIds();
				for (String id : passIds) {
					if (id.equals(passId)) {
						User user = userService.getUser(loan.getBorrowerId());
						return user;
					}
				}
			}
			return null;
	}

/**
 * Gets all collection reminders to be sent by email
 * @return a list of all collection reminders
 * @see Loan a Loan object
 */
	private User getNextUserDetails(String passId, LocalDate returnDate){
		Loan[] loans = loanRepo.findByLoanDate(returnDate.plusDays(1));
		for (Loan loan : loans) {
			List<String> passIds = loan.getPassIds();
			for (String id : passIds) {
				if (id.equals(passId)) {
					User user = userService.getUser(loan.getBorrowerId());
					return user;
				}
			}
		}
		return null;
	}

	public List<Map<String, Object>> getUserCollectionReminder(){
		Loan[] loans = loanRepo.findByCollectedFalse();
		// System.out.println(loans.length);
		List<Map<String, Object>> collectionReminder = new ArrayList<>();
		for (Loan loan : loans) {
			if (loan.getLoanDate().isEqual(LocalDate.now().plusDays(1))) {
				Map<String, Object> reminderDetails = new HashMap<>();
				List<String> passIds = loan.getPassIds();
				String destination = passService.getPass(loan.getPassIds().get(0)).getDestination();
				reminderDetails.put("destination", destination);
				reminderDetails.put("passIds", passIds);
				reminderDetails.put("passType","physical");

				reminderDetails.put("loanDate", loan.getLoanDate());

				String borrowerId = loan.getBorrowerId();
				User borrower = userService.getUser(borrowerId);
				reminderDetails.put("borrowerEmail", borrower.getEmail());
				reminderDetails.put("borrowerName", borrower.getName());

				collectionReminder.add(reminderDetails);
			}
		}
		return collectionReminder;
	}

/**
 * Gets all return reminders to be sent by email
 * @return a list of all return reminders
 * @see Loan a Loan object
 */

	public List<Map<String, Object>> getUserReturnReminder(){
		Loan[] loans = loanRepo.findByReturnedFalseAndCollectedTrue();
		System.out.println(loans.length);
		List<Map<String, Object>> returnReminder = new ArrayList<>();
		for (Loan loan : loans) {
			if (loan.getReturnDate().isEqual(LocalDate.now().plusDays(1))) {
				Map<String, Object> reminderDetails = new HashMap<>();
				// reminderDetails.put

				reminderDetails.put("loanDate", loan.getLoanDate());

				String borrowerId = loan.getBorrowerId();
				User borrower = userService.getUser(borrowerId);
				reminderDetails.put("borrowerEmail", borrower.getEmail());
				reminderDetails.put("borrowerName", borrower.getName());

				String destination = passService.getPass(loan.getPassIds().get(0)).getDestination();
				reminderDetails.put("destinationName", destination);

				List<String> passIds = loan.getPassIds();
				String nextUserName="";
				List<String> nextUserPassIdList = new ArrayList<>();
				String nextUserName2="";
				List<String> nextUserPassIdList2 = new ArrayList<>();
				List<String> gopPassIdList = new ArrayList<>();

				// for each passId check
				for (String passId : passIds) {
					// get the next user
					User nextUser = getNextUserDetails(passId, loan.getReturnDate());
					if (nextUser != null) {
						if (nextUserName == "") {
							nextUserName = nextUser.getName();
						}
						if (!nextUserName.equals(nextUser.getName()) && nextUserName2 == "") {
							nextUserName2 = nextUser.getName();
						}
						if (nextUserName.equals(nextUser.getName())) {
							nextUserPassIdList.add(passId);
						}
						if (nextUserName2 != "" && nextUserName2.equals(nextUser.getName())) {
							nextUserPassIdList2.add(passId);
						}
					} else {
						gopPassIdList.add(passId);
					}
				}
				reminderDetails.put("nextUserName", nextUserName);
				reminderDetails.put("nextUserPassIdList", nextUserPassIdList);
				reminderDetails.put("nextUserName2", nextUserName2);
				reminderDetails.put("nextUserPassIdList2", nextUserPassIdList2);
				reminderDetails.put("gopPassIdList", gopPassIdList);
				returnReminder.add(reminderDetails);
			}
		}
		return returnReminder;
	}


	public void sendBookingConfirmation(Loan loan){
		List<String> passIds = loan.getPassIds();
		String destination = passService.getPass(loan.getPassIds().get(0)).getDestination();

		String borrowerId = loan.getBorrowerId();
		User borrower = userService.getUser(borrowerId);
		
		String subject = "Booking Confirmation";
		String email = borrower.getEmail();
		String userName = borrower.getName();
		String passType = "physical";
		String destinationName = destination;
		LocalDate loanDate = loan.getLoanDate();
		List<String> passIdList = passIds;
		String template = "ppass_confirmation.html";

		CollectionReminderEmailQueue queue = new CollectionReminderEmailQueue(email,userName,subject, passType, passIdList, destinationName, loanDate, template);
		emailQueueService.publishToCollectionReminderQueue(queue);
	}

	// @Scheduled(fixedDelay = 1000)
	public void sendCollectionReminder() {
		System.out.println("Sending collection reminder");
		List<Map<String, Object>> collectionReminder = getUserCollectionReminder();
		for (Map<String, Object> reminder : collectionReminder) {
			String email = (String) reminder.get("borrowerEmail");
			String subject = "Collection Reminder";
			String userName = (String) reminder.get("borrowerName");
			String passType = (String) reminder.get("passType");
			List<String> passIds = (List<String>) reminder.get("passIds");
			String destinationName = (String) reminder.get("destination");
			LocalDate loanDate = (LocalDate) reminder.get("loanDate");
			String template = "ppass_confirmation.html";
			CollectionReminderEmailQueue queue = new CollectionReminderEmailQueue(email, userName, subject, passType, passIds, destinationName, loanDate, template);
			// System.out.println(queue);
			emailQueueService.publishToCollectionReminderQueue(queue);
		}
	}

	// @Scheduled(fixedDelay = 1000)
	public void sendReturnReminder() {
		System.out.println("Sending return reminder");
		List<Map<String, Object>> returnReminder = getUserReturnReminder();
		for (Map<String, Object> reminder : returnReminder) {
			String email = (String) reminder.get("borrowerEmail");
			String subject = "Return Reminder";
			String userName = (String) reminder.get("borrowerName");
			String destinationName = (String) reminder.get("destinationName");
			String nextUserName = (String) reminder.get("nextUserName");
			List<String> nextUserPassIdList = (List<String>) reminder.get("nextUserPassIdList");
			String nextUserName2 = (String) reminder.get("nextUserName2");
			List<String> nextUserPassIdList2 = (List<String>) reminder.get("nextUserPassIdList2");
			List<String> gopPassIdList = (List<String>) reminder.get("gopPassIdList");
			String template = "ppassReturn.html";
			ReturnReminderEmailQueue queue = new ReturnReminderEmailQueue(email, userName, subject, destinationName, nextUserName, nextUserPassIdList, nextUserName2, nextUserPassIdList2, gopPassIdList, template);
			// System.out.println(queue);
			emailQueueService.publishToReturnReminderQueue(queue);
		}
	}

	// public void checkForOverdue() {
	// 	List<Loan> overdueLoans = loanRepo.findByLoanDateBeforeAndReturnedFalse(LocalDate.now());
	// 	for (Loan loan : overdueLoans) {
	// 		loan.setOverdue(true);
	// 		loanRepo.save(loan);
	// 	}
	// }

}
