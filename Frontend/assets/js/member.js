const memberName = document.getElementById('member-name')
const memberLogoutBtn = document.getElementById('member-logout-btn')

async function loadMemberPage() {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const savedName = localStorage.getItem('name')

    if (savedName && memberName) {
        memberName.textContent = savedName
    }

    if (!token || !userId) {
        window.location.href = '/Frontend/pages/login.html'
        return
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Kunde inte hämta användardata')
        }

        const user = data.user

        if (!user) {
            throw new Error('Ingen användardata hittades')
        }

        if (memberName) {
            memberName.textContent = user.name || 'medlem'
        }

        localStorage.setItem('userId', String(user.id))
        localStorage.setItem('name', user.name || '')
    } catch (error) {
        console.error(error)

        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('name')

        window.location.href = '/Frontend/pages/login.html'
    }
}

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('name')

    window.location.href = '/Frontend/pages/login.html'
}

document.addEventListener('DOMContentLoaded', () => {
    if (memberLogoutBtn) {
        memberLogoutBtn.addEventListener('click', logout)
    }

    loadMemberPage()
})
