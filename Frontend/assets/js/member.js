const memberName = document.getElementById('member-name')
const reviewsContainer = document.getElementById('member-reviews')
const ordersContainer = document.getElementById('member-orders')
const API_BASE = 'http://localhost:3000'

// ====== Auth helpers ======
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

// ====== LOAD MEMBER PAGE ======
async function loadMemberPage() {
    if (!requireAuth()) return

    try {
        const token = getToken()
        // Hämta användardata
        const res = await fetch(`${API_BASE}/api/auth/me`, {
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

// ====== LOAD USER REVIEWS ======
async function loadUserReviews(userId) {
    if (!reviewsContainer) return
    try {
        const token = getToken()

        // Hämta reviews
        const res = await fetch(`${API_BASE}/api/reviews/user/${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        let reviews = await res.json()

        // Hämta alla produkter för mapping
        const productsRes = await fetch(`${API_BASE}/api/products`, {
            headers: { 'Content-Type': 'application/json' }
        })
        const products = await productsRes.json()

        // Mappa productId -> produkt
        const productsMap = {}
        products.forEach((p) => {
            productsMap[p.product_id] = p
        })

        // Lägg till produktdata i reviews
        reviews = reviews.map((r) => ({
            ...r,
            product: productsMap[r.productId] || null
        }))

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
        <div class="review-card" data-review-id="${r._id}">
            <div class="review-header">
                ${renderStars(r.rating)}
                <span>${r.product?.title || 'Produkt okänd'}</span>
            </div>
            <p>${r.comment}</p>
            <small>Datum: ${new Date(r.createdAt).toLocaleDateString()}</small>
            <div class="review-actions">
                <button class="edit-review-btn">Redigera</button>
                <button class="delete-review-btn">Ta bort</button>
            </div>
        </div>
    `
        )
        .join('')

    setupReviewActions()
}

function setupReviewActions() {
    document.querySelectorAll('.edit-review-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            const reviewCard = e.target.closest('.review-card')
            const reviewId = reviewCard.dataset.reviewId
            const newComment = prompt('Skriv ny kommentar:')
            const newRating = parseInt(prompt('Ange nytt betyg (1-5):'), 10)

            if (
                !newComment ||
                isNaN(newRating) ||
                newRating < 1 ||
                newRating > 5
            )
                return

            try {
                const token = getToken()
                const res = await fetch(`${API_BASE}/api/reviews/${reviewId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        comment: newComment,
                        rating: newRating
                    })
                })

                if (!res.ok) throw new Error('Kunde inte uppdatera recensionen')
                alert('Recension uppdaterad!')
                loadMemberPage()
            } catch (err) {
                console.error(err)
                alert('Fel vid uppdatering av recension')
            }
        })
    })

    document.querySelectorAll('.delete-review-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            if (!confirm('Är du säker på att du vill ta bort recensionen?'))
                return

            const reviewCard = e.target.closest('.review-card')
            const reviewId = reviewCard.dataset.reviewId

            try {
                const token = getToken()
                const res = await fetch(`${API_BASE}/api/reviews/${reviewId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!res.ok) throw new Error('Kunde inte ta bort recensionen')
                loadMemberPage()
            } catch (err) {
                console.error(err)

            }
        })
    })
}

// ====== LOAD USER ORDERS ======
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
