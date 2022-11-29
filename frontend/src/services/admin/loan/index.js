import { API_BACKEND } from ".."
import axios from 'axios'


//! GET
// getAllPasses (incomplete)
export async function getAllLoans(userData) {
    const response = await axios.get(`${API_BACKEND}/user/loan/all`, {
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
        },
    })
    return response.data.data

    // //!MOCK DATA
    // const mockData = [
    //     {
    //         loanId: "1",
    //         borrowerId: "22dfgdf",
    //         passIds: ["1", "2"],
    //         loanDate: "2021-05-01",
    //         returnDate: "2021-05-02",
    //         bookingDate: "2021-05-01",
    //         collected: true,
    //         returned: false,
    //     },
    //     {
    //         loanId: "2",
    //         borrowerId: "22",
    //         passIds: ["1", "2"],
    //         loanDate: "2021-05-01",
    //         returnDate: "2021-05-02",
    //         bookingDate: "2021-05-01",
    //         collected: false,
    //         returned: false,
    //     }]

    // return mockData
            
}

//! POST
// createLoan (Completed)
export async function createLoan(userData, loanData) {
    const response = await axios.post(`${API_BACKEND}/user/loan/create`, loanData,{
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
            'Content-Type': 'application/json'
        },
        
    })
    return response.data.data
}

//! PUT
// editLoan (Completed)
export async function editLoan(userData, loanData) {
    const response = await axios.put(`${API_BACKEND}/gop/loan/edit`,loanData, {
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
            'Content-Type': 'application/json'
        },
        
    })
    return response.data.data

}

//! DELETE
// deleteLoan (Completed)
export async function deleteLoan(userData, loanId) {
    const response = await axios.delete(`${API_BACKEND}/user/loan/${loanId}`, {
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
        },
        
    })
    return response.data.data
}

