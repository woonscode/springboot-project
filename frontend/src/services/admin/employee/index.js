import {
  API_BACKEND
} from ".."
import axios from 'axios'

// getAllUser (COMPLETED)
export async function getAllUser(userData) {
  const response = await axios.get(`${API_BACKEND}/admin/getAllUser`, {
    headers: {
      'Authorization': `Bearer ${userData.jwt}`,
    },
  })
  return response.data.data
}

// getUser by Email
export async function getUserByEmail(email, userData) {
  const response = await axios.get(`${API_BACKEND}/admin/user/find?email=${email}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.jwt}`
    },
  })
  return response.data.data
}


// updateUser by Email
export async function editEmployee(userData, user) {
  const response = await fetch(`${API_BACKEND}/user/updateUser/${user.email}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.jwt}`
    },
    body: JSON.stringify(user),
  })
  return await response.json()
}

//! deleteUser by Email
export async function deleteEmployee(userData, id) {
  const response = await fetch(`${API_BACKEND}/user/deleteUser/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.jwt}`
    },
  })
  return await response.json()
}

// uploadFile
export async function uploadFile(file) {
  const response = await fetch(`${API_BACKEND}/admin/uploadFile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify(file)
  })
  return await response.json()
}

//! Update Roles

export async function updateRoles(userData, data) {
  const response = await axios.put(`${API_BACKEND}/admin/updateUserRoleLs/${data.user}`, data.roles, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.jwt}`
    }
  })
  return response.data.data
}

//! Clear Fine

export async function clearFine(userData, data) {
  const response = await axios.post(`${API_BACKEND}/admin/clearFine?email=${data.email}`, {
    "role": "admin"
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.jwt}`
    }
  })
  return response.data.data
}
