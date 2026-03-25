const productDetail = document.getElementById('productDetail')
const backButton = document.getElementById('backButton')
const reviewsContainer = document.getElementById('reviewsContainer')
const reviewFormContainer = document.getElementById('reviewFormContainer')
const API_BASE = ''

backButton?.addEventListener('click', () => {
    window.location.href = './products.html'
})

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
}

const productId = getProductIdFromUrl()

// ======== INIT PAGE ========
document.addEventListener('DOMContentLoaded', initProductPage)
document.addEventListener('componentsLoaded', initProductPage)

function initProductPage() {
    if (!productId) {
        productDetail.innerHTML = '<p>Ingen produkt hittades.</p>'
        return
    }

    toggleReviewFormVisibility()
    loadSingleProduct()
    loadReviews()

    const submitBtn = document.getElementById('submitReview')
    if (submitBtn) {
        submitBtn.addEventListener('click', submitReview)
    }
}

async function loadSingleProduct() {
    try {
        const res = await fetch(`${API_BASE}/api/products/${productId}`)
        const product = await res.json()

        product.price = Number(product.price) || 0

        const ratingData = await loadAverageRating()
        renderProduct(product, ratingData)
    } catch (err) {
        console.error(err)
        productDetail.innerHTML = '<p>Kunde inte hämta produkten.</p>'
    }
}

function renderProduct(product, ratingData) {
    productDetail.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-image">
                <img src="${product.image || 'https://via.placeholder.com/400x400?text=No+Image'}" alt="${product.title}">
            </div>

            <div class="product-detail-info">
                <div class="rating">
                    ${renderStars(Math.round(ratingData.averageRating))}
                    (${ratingData.totalReviews} recensioner)
                </div>

                <h1>${product.title}</h1>
                <p class="category">Kategori: ${product.category?.name || 'Okänd'}</p>
                <p class="description">${product.info || 'Ingen beskrivning'}</p>
                <div class="price">${product.price.toFixed(2)} kr</div>

                <div class="cart-controls">
                    <div class="quantity-selector">
                        <button id="decreaseQty">−</button>
                        <span id="quantity">1</span>
                        <button id="increaseQty">+</button>
                    </div>

                    <button id="addToCartBtn" class="add-to-cart-btn">
                        Lägg i kundvagn
                    </button>
                </div>
            </div>
        </div>
    `

    setupProductActions(product)
}

function setupProductActions(product) {
    const decreaseBtn = document.getElementById('decreaseQty')
    const increaseBtn = document.getElementById('increaseQty')
    const quantityEl = document.getElementById('quantity')
    const addToCartBtn = document.getElementById('addToCartBtn')

    let quantity = 1

    decreaseBtn?.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--
            quantityEl.textContent = quantity
        }
    })

    increaseBtn?.addEventListener('click', () => {
        quantity++
        quantityEl.textContent = quantity
    })

    addToCartBtn?.addEventListener('click', () => {
        addToCart(product, quantity)
        showCartToast(`${product.title} lades till i kundvagnen`)
    })
}

async function loadReviews() {
    if (!reviewsContainer) return
    try {
        const token = localStorage.getItem('token')
        const res = await fetch(
            `${API_BASE}/api/reviews/product/${productId}`,
            {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }
        )
        const reviews = await res.json()
        renderReviews(reviews)
    } catch (err) {
        console.error(err)
        reviewsContainer.innerHTML = '<p>Kunde inte ladda reviews</p>'
    }
}

function renderReviews(reviews) {
    const userId = getUserIdFromToken()

    if (!reviews?.length) {
        reviewsContainer.innerHTML = `
            <div class="reviews-section">
                <h3>Reviews</h3>
                <p>Inga reviews ännu</p>
            </div>
        `
        return
    }

    reviewsContainer.innerHTML = `
        <div class="reviews-section">
            <h3>Reviews</h3>
            ${reviews
                .map(
                    (r) => `
                    <div class="review-card">
                        <div class="review-header">
                            ${renderStars(r.rating)}
                            ${userId === r.userId ? `<button class="delete-btn" data-id="${r._id}">Ta bort</button>` : ''}
                        </div>
                        <p class="review-comment">${r.comment}</p>
                        <small>Av användare #${r.userId}</small>
                    </div>
                `
                )
                .join('')}
        </div>
    `

    attachDeleteEvents()
}

async function submitReview() {
    const token = localStorage.getItem('token')
    if (!token) {
        alert('Du måste vara inloggad')
        return
    }

    const ratingEl = document.getElementById('rating')
    const commentEl = document.getElementById('comment')
    if (!ratingEl || !commentEl) return

    const rating = Number(ratingEl.value)
    const comment = commentEl.value

    try {
        const res = await fetch(`${API_BASE}/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ productId, rating, comment })
        })

        const data = await res.json()
        if (!res.ok) {
            alert(data.message)
            return
        }

        commentEl.value = ''
        await loadReviews()
        await loadSingleProduct()
    } catch (err) {
        console.error(err)
    }
}

function attachDeleteEvents() {
    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id
            const token = localStorage.getItem('token')
            if (!token || !confirm('Ta bort review?')) return

            try {
                await fetch(`${API_BASE}/api/reviews/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })
                await loadReviews()
                await loadSingleProduct()
            } catch (err) {
                console.error(err)
            }
        })
    })
}

async function loadAverageRating() {
    try {
        const res = await fetch(
            `${API_BASE}/api/reviews/product/${productId}/average`
        )
        const data = await res.json()
        return {
            averageRating: Number(data.averageRating) || 0,
            totalReviews: Number(data.totalReviews) || 0
        }
    } catch {
        return { averageRating: 0, totalReviews: 0 }
    }
}

function renderStars(rating) {
    let stars = ''
    for (let i = 1; i <= 5; i++) stars += i <= rating ? '★' : '☆'
    return `<span class="stars">${stars}</span>`
}

function getUserIdFromToken() {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.id
    } catch {
        return null
    }
}

function isLoggedIn() {
    const token = localStorage.getItem('token')
    if (!token) return false
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return !payload.exp || Date.now() < payload.exp * 1000
    } catch {
        return false
    }
}

function toggleReviewFormVisibility() {
    if (!reviewFormContainer) return

    if (!isLoggedIn()) {
        reviewFormContainer.innerHTML = `
            <p class="login-warning">
                Du måste <a href="/pages/login.html">logga in</a> för att skriva en review.
            </p>
        `
    }
}
