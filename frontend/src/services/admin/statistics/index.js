import { API_BACKEND } from ".."
import axios from 'axios'
// getPassStatistics
export async function getPassStatistics(userData) {
  const response = await axios.get(`${API_BACKEND}/admin/statistics/getPassStatistics?startDate=01/01/2022&endDate=31/12/2022`, {
    headers: {
      'Authorization': `Bearer ${userData.jwt}`
    },
  })
  return await response.data.data
}

// getUserStatistics
export async function getUserStatistics(startTime, endTime, userId=undefined) {
  const response = await fetch(`${API_BACKEND}/api/admin/statistics/getUserStatistics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify({
      startTime: startTime,
      endTime: endTime,
      userId: userId
    })
  })
  return await response.json()
}

// getPassStatistics by PassType
export async function getPassStatisticsByPassType(timePeriod, passType) {
  const response = await fetch(`${API_BACKEND}/api/admin/statistics/getPassStatistics/${passType}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    },
  })
  return await response.json()
}

// getPassStatistics by UserId
export async function getPassStatisticsByUserId(timePeriod, userId) {
  const response = await fetch(`${API_BACKEND}/api/admin/statistics/getPassStatistics/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    },
  })
  return await response.json()
}
