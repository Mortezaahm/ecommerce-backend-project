// Elementreferenser och API-basurl
const productDetail = document.getElementById('productDetail')
const backButton = document.getElementById('backButton')
const reviewsContainer = document.getElementById('reviewsContainer')
const reviewFormContainer = document.getElementById('reviewFormContainer')
const API_BASE = 'http://localhost:3000'

// Tillbaka-knappen tar användaren till produktsidan
backButton?.addEventListener('click', () => {
    window.location.href = './products.html'
})

// Hämtar produkt-id från URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
}

const productId = getProductIdFromUrl()

// Initiera sidan när DOM eller komponenter är laddade
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

    // Submit-knapp för nya reviews
    const submitBtn = document.getElementById('submitReview')
    if (submitBtn) submitBtn.addEventListener('click', submitReview)
}

// Hämtar produktdata från backend
async function loadSingleProduct() {
    try {
        const res = await fetch(`${API_BASE}/api/products/${productId}`)
        const product = await res.json()
        product.price = Number(product.price) || 0
        console.log('Loaded product:', product)

        // Fetch images for this product, prefer transparent image
        let imageSrc = '/assets/media/juice-placeholder.png'
        try {
            const imgRes = await fetch(
                `${API_BASE}/api/product-images/product/${productId}`
            )
            const images = await imgRes.json()
            if (Array.isArray(images) && images.length > 0) {
                // Prefer image with '-trans' in the name
                const transImg = images.find((img) =>
                    img.image_name.includes('-trans')
                )
                if (transImg) {
                    imageSrc = `/api/product-images/file/${transImg.image_name}`
                } else {
                    imageSrc = `/api/product-images/file/${images[0].image_name}`
                }
            }
        } catch (e) {}

        const ratingData = await loadAverageRating()
        renderProduct(product, ratingData, imageSrc)
    } catch (err) {
        console.error(err)
        productDetail.innerHTML = '<p>Kunde inte hämta produkten.</p>'
    }
}

// Renderar produktkort
function renderProduct(product, ratingData, imageSrc) {
    const inStock = product.in_stock !== undefined ? product.in_stock : true
    productDetail.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-image">
                <img src="${imageSrc}" alt="${product.title}">
            </div>

            <div class="product-detail-info">
                <div class="rating">
                    ${renderStars(Math.round(ratingData.averageRating))}
                    (${ratingData.totalReviews} recensioner)
                </div>

                <h1>${product.title}</h1>
                <p class="category">Kategori: ${product.category?.title || 'Okänd'}</p>
                <p class="description">${product.info || 'Ingen beskrivning'}</p>
                <div class="price">${product.price.toFixed(2)} kr</div>
                <div class="stock-status">
                    <strong>Lagersaldo:</strong> <span id="stockValue">${inStock ? 'I lager' : 'Slut i lager'}</span>
                </div>

                <div class="cart-controls">
                    <div class="quantity-selector">
                        <button id="decreaseQty">−</button>
                        <span id="quantity">1</span>
                        <button id="increaseQty">+</button>
                    </div>
                    <button id="addToCartBtn" class="add-to-cart-btn" ${!inStock ? 'disabled' : ''}>
                        ${inStock ? 'Lägg i kundvagn' : 'Slut i lager'}
                    </button>
                </div>
            </div>
        </div>
    `

    setupProductActions(product, inStock)
}

// Hanterar knapptryck för kvantitet och "lägg till i kundvagn"
function setupProductActions(product, inStock) {
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
        if (!inStock) {
            alert('Produkten är slut i lager och kan inte beställas.')
            return
        }
        addToCart(product, quantity)
        showCartToast(`${product.title} lades till i kundvagnen`)
    })
}

// Hämtar alla reviews för produkten
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

// Renderar reviews på sidan
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
                        </div>
                        <p class="review-comment">${r.comment}</p>
                        <small>Av användare #${r.userId}</small>
                    </div>
                `
                )
                .join('')}
        </div>
    `
}

// Skickar en ny review till backend
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

// Hämtar medelbetyg och antal reviews för produkten
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

// Renderar stjärnor
function renderStars(rating) {
    let stars = ''
    for (let i = 1; i <= 5; i++) stars += i <= rating ? '★' : '☆'
    return `<span class="stars">${stars}</span>`
}

// Hämtar userId från JWT-token
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

// Kontrollera om användaren är inloggad
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

// Visa eller dölj review-form beroende på inloggning
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
