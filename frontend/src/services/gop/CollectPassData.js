import axios from 'axios'
import { useEffect } from 'react'

const CollectPassData = () => {
    const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"
    let loans = []

    const getAllLoans = async () => {
        try {
            const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
            const config = { headers: { Authorization: bearer_token } }
            let res = await axios.get(`${url}user/loan/all`, config)

            if (res.status == 200) {
                const loanData = res.data.data
                for (var index in loanData) {
                    const loan = loanData[index]
                    if (!loan.collected) {
                        let passIds = []
                        for (var index in loan.passes) {
                            const passDetails = loan.passes[index]
                            passIds.push(passDetails.passId)
                        }
                        loans.push(createData(loan.borrowerId, loan.loanDate, loan.passes[0].destination, passIds))
                    }
                }
            }
        } catch (e) {
            
        }
    }

    useEffect(() => {
        getAllLoans()
    }, [])

    function createData(email, loanDate, destination, passes) {
        return { 
            emailId: email,
            date: loanDate,
            placeOfInterest: destination,
            passInfo: passes
        }
    }
    return loans
}

export default CollectPassData