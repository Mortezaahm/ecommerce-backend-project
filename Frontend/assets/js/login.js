// Hämta formuläret för inloggning
const form = document.getElementById('login-form')

// Lyssnar på submit-event för formuläret
form.addEventListener('submit', async (e) => {
    e.preventDefault() // Förhindra att sidan laddas om

    // Hämta värden från input-fälten
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    // Rensa eventuell tidigare feltext
    const errorBox = document.getElementById('login-error')
    if (errorBox) {
        errorBox.textContent = ''
        errorBox.style.color = '#111'
    }

    try {
        // Skicka login-förfrågan till backend
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        // Tolka svaret som JSON
        const data = await response.json()

        // Om servern svarar med fel, kasta error
        if (!response.ok) {
            throw new Error(data.message || 'Inloggningen misslyckades.')
        }

        const token = data.data?.token

        // Hämta användarinformation (stöder olika format)
        const user = data.data?.user
        const userId = user?.id || data.data?.userId
        const name = user?.name || ''
        const role = user?.role || 'user'

        if (!token || !userId) {
            throw new Error('Ogiltigt svar från servern.')
        }

        // Spara användardata i localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('userId', userId)
        localStorage.setItem('name', name || '')
        localStorage.setItem('role', role || '')

        // Skicka användaren vidare baserat på roll
        if (role === 'admin') {
            window.location.href = '/pages/admin.html'
        } else {
            window.location.href = '/pages/member.html'
        }
    } catch (error) {
        console.error(error)

        // Visa felmeddelande på sidan om möjligt
        if (errorBox) {
            errorBox.textContent = error.message
            errorBox.style.color = '#111'
        } else {
            alert(error.message)
        }
    }
})
