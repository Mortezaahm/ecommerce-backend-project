const token = localStorage.getItem('token')
const userId = localStorage.getItem('userId')

if (!token || !userId) {
    alert('Du måste logga in först')
    window.location.href = '../pages/login.html'
}

const memberName = document.getElementById('member-name')
const logoutBtn = document.getElementById('logout-btn')

async function loadMemberPage() {
    try {
        const response = await fetch(
            `http://localhost:3000/api/users/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Kunde inte hämta användardata')
        }

        memberName.textContent = data.data.name
    } catch (error) {
        console.error(error)
        alert('Sessionen är ogiltig, logga in igen')

        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('name')

        window.location.href = '../pages/login.html'
    }
}

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('name')

    alert('Du har loggats ut.')
    window.location.href = '../pages/login.html'
}

logoutBtn.addEventListener('click', logout)

loadMemberPage()
