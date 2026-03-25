const form = document.getElementById('register-form')

// Lyssnar på submit-eventet för formuläret
form.addEventListener('submit', async (e) => {
    e.preventDefault() // Förhindrar att sidan laddas om

    // Hämta värden från input-fälten
    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const confirmEmail = document.getElementById('confirm-email').value.trim()
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value

    // Rensa tidigare felmeddelanden
    const errorBox = document.getElementById('register-error')
    if (errorBox) errorBox.textContent = ''

    try {
        // Validera e-post
        if (email !== confirmEmail) {
            throw new Error('E-postadresserna matchar inte.')
        }

        // Validera lösenord
        if (password !== confirmPassword) {
            throw new Error('Lösenorden matchar inte.')
        }

        // Skicka registreringsdata till backend
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                confirmEmail,
                password,
                confirmPassword
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Registreringen misslyckades.')
        }

        // Spara token och userId i localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.userId)

        // Hämta användarens namn från /me-endpointen
        const meResponse = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${data.token}` }
        })

        const meData = await meResponse.json()

        if (meResponse.ok && meData.user?.name) {
            localStorage.setItem('name', meData.user.name)
        }

        // Omdirigera till login-sidan
        window.location.href = '/pages/login.html'
    } catch (error) {
        console.error(error)

        // Visa felmeddelande
        if (errorBox) {
            errorBox.textContent = error.message
        }
    }
})
