package is442g1t3.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import is442g1t3.domain.Loan;

public interface LoanRepo extends JpaRepository<Loan, Integer> {
  Loan[] findByReturnDate(LocalDate returnDate);
  
  Loan[] findByLoanDate(LocalDate loanDate);

  Loan[] findByReturnDateBetween(LocalDate startDate, LocalDate endDate);

  Loan[] findByBookingDateBetween(LocalDate startDate, LocalDate endDate);

  Loan[] findByLoanDateBetween(LocalDate startDate, LocalDate endDate);

  Loan[] findByBorrowerIdAndLoanDateAfter(String borrowerId, LocalDate startDate);

  Loan[] findByBorrowerIdAndLoanDateBetween(String borrowerId, LocalDate startDate,
      LocalDate endDate);

  Loan[] findByCollectedFalse();

  Loan[] findByReturnedFalseAndCollectedTrue();
}
