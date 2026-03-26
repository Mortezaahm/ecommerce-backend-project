// Hämta element på sidan
const memberName = document.getElementById('member-name')
const reviewsContainer = document.getElementById('member-reviews')
const ordersContainer = document.getElementById('member-orders')
const API_BASE = 'http://localhost:3000'

// Hämtar token från localStorage
function getToken() {
    return localStorage.getItem('token')
}

// Kontrollerar om användaren är inloggad, annars skickas den till login
function requireAuth() {
    const token = getToken()
    if (!token) {
        window.location.href = '/pages/login.html'
        return false
    }
    return true
}

// Laddar medlemssidan med användarinfo, recensioner och beställningar
async function loadMemberPage() {
    if (!requireAuth()) return

    try {
        const token = getToken()
        const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()
        if (!res.ok) throw new Error()

        const user = data.user || data.data?.user

        // Visa användarens namn på sidan
        memberName.textContent = user.name || 'Medlem'

        // Ladda recensioner och beställningar
        await loadUserReviews(user.id)
        await loadUserOrders(user.id)
    } catch (err) {
        console.error(err)
        localStorage.clear()
        window.location.href = '/pages/login.html'
    }
}

// Konfigurera logout-knappen
function setupLogout() {
    const logoutBtn = document.getElementById('member-logout-btn')
    if (!logoutBtn) return

    logoutBtn.addEventListener('click', () => {
        localStorage.clear()
        window.location.href = '/pages/login.html'
    })
}

// Hämtar alla recensioner för användaren och mappar dem till produkter
async function loadUserReviews(userId) {
    try {
        const token = getToken()

        const res = await fetch(`${API_BASE}/api/reviews/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        let reviews = await res.json()

        const productsRes = await fetch(`${API_BASE}/api/products`)
        const products = await productsRes.json()

        // Skapa en mappning mellan product_id och produktinfo
        const map = {}
        products.forEach((p) => (map[p.product_id] = p))

        reviews = reviews.map((r) => ({
            ...r,
            product: map[r.productId]
        }))

        renderUserReviews(reviews)
    } catch (err) {
        console.error(err)
    }
}

// Renderar recensioner på sidan
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
                <span class="stars">${renderStars(r.rating)}</span>
                <span>${r.product?.title || 'Produkt okänd'}</span>
            </div>

            <p class="review-text">${r.comment}</p>

            <div class="edit-mode" style="display:none;">
                <textarea class="edit-comment">${r.comment}</textarea>

                <select class="edit-rating">
                    ${[1, 2, 3, 4, 5]
                        .map(
                            (n) =>
                                `<option value="${n}" ${n === r.rating ? 'selected' : ''}>${n}</option>`
                        )
                        .join('')}
                </select>

                <button class="save-review-btn">Spara</button>
            </div>

            <small>${new Date(r.createdAt).toLocaleDateString()}</small>

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

// Funktionalitet för att redigera, spara och ta bort recensioner
function setupReviewActions() {
    // Redigera recension
    document.querySelectorAll('.edit-review-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.review-card')
            card.querySelector('.review-text').style.display = 'none'
            card.querySelector('.edit-mode').style.display = 'block'
        })
    })

    // Spara ändrad recension
    document.querySelectorAll('.save-review-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            const card = e.target.closest('.review-card')
            const reviewId = card.dataset.reviewId
            const newComment = card.querySelector('.edit-comment').value
            const newRating = parseInt(
                card.querySelector('.edit-rating').value,
                10
            )

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

                if (!res.ok) throw new Error()

                card.querySelector('.review-text').textContent = newComment
                card.querySelector('.stars').innerHTML = renderStars(newRating)
                card.querySelector('.review-text').style.display = 'block'
                card.querySelector('.edit-mode').style.display = 'none'
            } catch (err) {
                console.error(err)
            }
        })
    })

    // Ta bort recension
    document.querySelectorAll('.delete-review-btn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            const card = e.target.closest('.review-card')
            const reviewId = card.dataset.reviewId

            try {
                const token = getToken()
                const res = await fetch(`${API_BASE}/api/reviews/${reviewId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (!res.ok) throw new Error()
                card.remove()
            } catch (err) {
                console.error(err)
            }
        })
    })
}

// Hämtar alla beställningar för användaren
async function loadUserOrders(userId) {
    try {
        const token = getToken()
        const res = await fetch(`${API_BASE}/api/orders/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        const orders = await res.json()
        renderUserOrders(orders)
    } catch (err) {
        console.error(err)
    }
}

// Renderar beställningar på sidan
function renderUserOrders(orders) {
    if (!orders.length) {
        ordersContainer.innerHTML = '<p>Inga beställningar ännu</p>'
        return
    }

    ordersContainer.innerHTML = orders
        .map(
            (order) => `
        <div class="order-card">
            <span>Order #${order.order_id}</span>
            <div>${order.total_price?.toFixed ? order.total_price.toFixed(2) : order.total_price} kr</div>
        </div>
    `
        )
        .join('')
}

// Renderar stjärnor baserat på betyg
function renderStars(rating) {
    let stars = ''
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆'
    }
    return stars
}

// Körs när header och footer är inlästa
document.addEventListener('componentsLoaded', () => {
    setupLogout()
    loadMemberPage()
})
