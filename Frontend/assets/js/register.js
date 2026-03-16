const form = document.getElementById('register-form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const confirmEmail = document.getElementById('confirm-email').value.trim()
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value

    try {
        const response = await fetch(
            'http://localhost:3000/api/auth/register',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    confirmEmail,
                    password,
                    confirmPassword
                })
            }
        )
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message)
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.userId)

        alert('Registrering lyckades!')

        window.location.href = '../pages/login.html'
    } catch (error) {
        alert(error.message)
        console.error(error)
    }
})
