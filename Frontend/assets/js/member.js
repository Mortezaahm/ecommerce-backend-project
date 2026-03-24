const memberName = document.getElementById('member-name')
const reviewsContainer = document.getElementById('member-reviews')
const ordersContainer = document.getElementById('member-orders')
const API_BASE = 'http://localhost:3000'

function getToken() {
    return localStorage.getItem('token')
}

function requireAuth() {
    const token = getToken()
    if (!token) {
        window.location.href = '../pages/login.html'
        return false
    }
    return true
}

function getUserIdFromToken() {
    const token = getToken()
    if (!token) return null
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.id
    } catch {
        return null
    }
}

// ====== LOAD MEMBER PAGE ======
async function loadMemberPage() {
    if (!requireAuth()) return

    try {
        const token = getToken()
        const res = await fetch(`${API_BASE}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.json()
        if (!res.ok)
            throw new Error(data.message || 'Kunde inte hämta användardata')

        const user = data.user || data.data?.user
        if (!user) throw new Error('Ogiltigt svar från servern: ingen user')

        if (memberName) memberName.textContent = user.name || 'Medlem'
        localStorage.setItem('name', user.name || '')
        localStorage.setItem('role', user.role || '')

        // Hämta reviews och orders
        await loadUserReviews(user.id)
        await loadUserOrders(user.id)
    } catch (err) {
        console.error(err)
        alert('Sessionen är ogiltig, logga in igen')
        localStorage.clear()
        window.location.href = '../pages/login.html'
    }
}

// ====== LOGOUT ======
function setupLogout() {
    const logoutBtn = document.getElementById('member-logout-btn')
    if (!logoutBtn) return

    logoutBtn.addEventListener('click', () => {
        localStorage.clear()
        window.location.href = '../pages/login.html'
    })
}

// ====== LOAD REVIEWS ======
async function loadUserReviews(userId) {
    if (!reviewsContainer) return
    try {
        const token = getToken()
        const res = await fetch(`${API_BASE}/api/reviews/user/${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        const reviews = await res.json()
        renderUserReviews(reviews)
    } catch (err) {
        console.error(err)
        reviewsContainer.innerHTML = '<p>Kunde inte ladda dina recensioner</p>'
    }
}

function renderUserReviews(reviews) {
    if (!reviews.length) {
        reviewsContainer.innerHTML = '<p>Inga recensioner ännu</p>'
        return
    }

    reviewsContainer.innerHTML = reviews
        .map(
            (r) => `
        <div class="review-card">
            <div class="review-header">
                ${renderStars(r.rating)}
                <span>${r.product?.title || 'Produkt okänd'}</span>
            </div>
            <p>${r.comment}</p>
            <small>Datum: ${new Date(r.createdAt).toLocaleDateString()}</small>
        </div>
    `
        )
        .join('')
}

// ====== LOAD ORDERS ======
async function loadUserOrders(userId) {
    if (!ordersContainer) return
    try {
        const token = getToken()
        const res = await fetch(`${API_BASE}/api/orders/user/${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        const orders = await res.json()
        renderUserOrders(orders)
    } catch (err) {
        console.error(err)
        ordersContainer.innerHTML = '<p>Kunde inte ladda dina beställningar</p>'
    }
}

function renderUserOrders(orders) {
    if (!orders.length) {
        ordersContainer.innerHTML = '<p>Inga beställningar ännu</p>'
        return
    }

    ordersContainer.innerHTML = orders
        .map(
            (order) => `
        <div class="order-card">
            <div class="order-header">
                <span>Order #${order.id}</span>
                <span>Status: ${order.status}</span>
            </div>
            <ul>
                ${order.items.map((item) => `<li>${item.quantity} × ${item.product?.title || 'Okänd produkt'}</li>`).join('')}
            </ul>
            <div class="order-total">Totalt: ${order.total.toFixed(2)} kr</div>
            <small>Datum: ${new Date(order.createdAt).toLocaleDateString()}</small>
        </div>
    `
        )
        .join('')
}

// ====== STARS HELPER ======
function renderStars(rating) {
    let stars = ''
    for (let i = 1; i <= 5; i++) stars += i <= rating ? '★' : '☆'
    return `<span class="stars">${stars}</span>`
}

// ====== INIT ======
document.addEventListener('componentsLoaded', () => {
    setupLogout()
    loadMemberPage()
})
