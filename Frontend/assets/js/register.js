const form = document.getElementById('register-form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const confirmEmail = document.getElementById('confirm-email').value.trim()
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value

    const errorBox = document.getElementById('register-error')
    if (errorBox) errorBox.textContent = ''

    try {
        if (email !== confirmEmail) {
            throw new Error('E-postadresserna matchar inte.')
        }

        if (password !== confirmPassword) {
            throw new Error('Lösenorden matchar inte.')
        }

        const response = await fetch(
            '/api/auth/register',
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
            throw new Error(data.message || 'Registreringen misslyckades.')
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.userId)

        const meResponse = await fetch('/api/auth/me', {
            headers: {
                Authorization: `Bearer ${data.token}`
            }
        })

        const meData = await meResponse.json()

        if (meResponse.ok && meData.user?.name) {
            localStorage.setItem('name', meData.user.name)
        }

        window.location.href = '../pages/login.html'
    } catch (error) {
        console.error(error)

        if (errorBox) {
            errorBox.textContent = error.message
        }
    }
})
