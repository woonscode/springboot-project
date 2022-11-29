import { API_BACKEND } from ".."
//Create Role
export async function createRole(role) {
  const response = await fetch(`${API_BACKEND}/api/admin/access/createRole`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('data').jwt}`
    },
    body: JSON.stringify(role)
  })
  return await response.json()
}

// Delete Role
export async function deleteRole(role) {
  const response = await fetch(`${API_BACKEND}/api/admin/access/deleteRole`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify(role)
  })
  return await response.json()
}

// Add Role to User
export async function addUserRole(role, userId) {
  const response = await fetch(`${API_BACKEND}/api/admin/access/addUserRole`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify({
      role: role,
      userId: userId
    })
  })
  return await response.json()
}

