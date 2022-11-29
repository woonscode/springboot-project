const LoadData = async () => {
    // Call all loans
    const allLoans = {};

    // Split loans into upcoming, past, waitlisted, due
    const upcomingLoans = ["loan1","loan2"];
    const pastLoans = [];
    const waitlistedLoans = [];
    const pendingReturnLoans = [];

    // Other data needed
    var getDestinations;

    // Save these to session store to use throughout the app
    sessionStorage.setItem("upcomingLoans", upcomingLoans);
    sessionStorage.setItem("pastLoans", pastLoans);
    sessionStorage.setItem("waitlistedLoans", waitlistedLoans);
    sessionStorage.setItem("pendingReturnLoans", pendingReturnLoans);

    const setSessionStorage = (props) => {
        sessionStorage.setItem()
    }
}