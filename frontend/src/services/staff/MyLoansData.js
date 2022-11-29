const MyLoansData = () => {

    function createData(passId, destination, loanDate, returnDate, status) {
        return { passId, destination, loanDate, returnDate, status }
    }

    // for this part, should get data directly from DB
    const rows = [
        createData(123123, 'Zoo', '18 Oct 2022', '5', 'upcoming'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'waitlist'),
        createData(123124, 'ChickyTours', '7 Oct 2022', '2', 'due'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
        createData(123124, 'DuckTours', '10 Oct 2022', '1', 'completed'),
    ]

    return rows
}

export default MyLoansData