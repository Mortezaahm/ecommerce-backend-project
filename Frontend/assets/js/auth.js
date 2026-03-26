// Hämtar JWT-token från localStorage
export function getToken() {
    return localStorage.getItem('token')
}

// Hämtar användar-ID från localStorage
export function getUserId() {
    return localStorage.getItem('userId')
}

// Hämtar användarens namn från localStorage
export function getName() {
    return localStorage.getItem('name')
}

// Kontrollerar om användaren är inloggad
export function isLoggedIn() {
    const token = getToken() // Hämta token
    if (!token) return false // Om ingen token finns → ej inloggad

    try {
        // Avkoda JWT-tokenens payload
        const payload = JSON.parse(atob(token.split('.')[1]))
        // Kontrollera om token har gått ut
        if (payload.exp && Date.now() >= payload.exp * 1000) return false
        return true
    } catch {
        return false
    }
}

// Kräver att användaren är inloggad, annars redirect till login-sida
export function requireAuth(redirectUrl = '/pages/login.html') {
    if (!isLoggedIn()) {
        alert('Du måste logga in först') // Meddelande till användaren
        window.location.href = redirectUrl // Skicka till login
        return false
    }
    return true
}
