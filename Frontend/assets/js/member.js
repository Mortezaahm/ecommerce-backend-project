function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')

    alert('Du har loggats ut.')
    window.location.href = '../pages/login.html'
}

const memberName = document.getElementById('member-name')
memberName.textContent = localStorage.getItem('name')
