import { API_BACKEND } from ".."
import axios from 'axios'


//! GET
// getAllPasses (COMPLETED)
export async function getAllPasses(userData) {
    const response = await axios.get(`${API_BACKEND}/user/pass/all`, {
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
        },
    })
    return response.data.data
}

//! POST
// createPass (COMPLETED)
export async function createPass(userData, passData) {
    const response = await axios.post(`${API_BACKEND}/admin/pass`, passData,{
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
            'Content-Type': 'application/json'
        },
        
    })
    return response.data.data
}

//! POST
// reportPass (COMPLETED)
export async function reportPass(userData, passId, email) {
    const response = await axios.post(`${API_BACKEND}/admin/lostPass?passId=${passId}&email=${email}`,null,{
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
            'Content-Type': 'application/json'
        },
        
    })
    return response.data.data
}

//! PUT
// editPass (COMPLETED)
export async function editPass(userData, passData) {
    const response = await axios.put(`${API_BACKEND}/admin/pass/${passData.passId}`,passData, {
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
            'Content-Type': 'application/json'
        },
        
    })
    return response.data.data

}

//! DELETE
// deletePass (COMPLETED)
export async function deletePass(userData, passId) {
    const response = await axios.delete(`${API_BACKEND}/admin/pass/${passId}`, {
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
        },
        
    })
    return response.data.data
}

//! GET
// getDestn
export async function getDestn(userData) {
    const response = await axios.get(`${API_BACKEND}/user/getAllDestinations`, {
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
        },
    })
    return response.data.data
}

//! POST
// createDestn
export async function createDestn(userData, data) {
    const response = await axios.post(`${API_BACKEND}/admin/addDestination`, data , {
        headers: {
            'Authorization': `Bearer ${userData.jwt}`,
        },
    })
    return response.data.data
}
