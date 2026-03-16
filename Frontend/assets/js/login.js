const form = document.getElementById('login-form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password
            })
        })
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message)
        }

        localStorage.setItem('token', data.data.token)
        localStorage.setItem('userId', data.data.userId)

        alert('Inloggning lyckades!')

        window.location.href = '../pages/member.html'
    } catch (error) {
        alert(error.message)
        console.error(error)
    }
})
