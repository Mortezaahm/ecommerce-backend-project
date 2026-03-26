// Hämtar kundvagnen från localStorage, returnerar array (tom om ingen)
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []
}

// Sparar kundvagnen i localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
}

// Formaterar pris till sträng med 2 decimaler och kr
function formatPrice(price) {
    return `${Number(price || 0).toFixed(2)} kr`
}

// Räknar total antal produkter i kundvagnen
function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

// Räknar totalpris för kundvagnen
function getCartTotal() {
    return getCart().reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0
    )
}

// Lägger till produkt i kundvagnen (eller ökar kvantitet om redan finns)
function addToCart(product, quantity = 1) {
    const cart = getCart()
    const id = String(product.id ?? product.product_id)
    const existing = cart.find((item) => item.id === id)

    if (existing) {
        existing.quantity += quantity
    } else {
        cart.push({
            id,
            title: product.title,
            price: Number(product.price || 0),
            image: product.image || '/assets/media/juice-placeholder.png',
            quantity
        })
    }

    saveCart(cart)
    refreshCartUI()
    showCartToast(`${product.title} lades till i kundvagnen`)
}

// Tar bort produkt från kundvagnen
function removeFromCart(productId) {
    const id = String(productId)
    const cart = getCart().filter((item) => item.id !== id)
    saveCart(cart)
    refreshCartUI()
}

// Uppdaterar kvantitet för en produkt, tar bort om 0
function updateQuantity(productId, newQuantity) {
    const id = String(productId)
    const cart = getCart()
    const item = cart.find((p) => p.id === id)
    if (!item) return

    if (newQuantity <= 0) {
        removeFromCart(id)
        return
    }

    item.quantity = newQuantity
    saveCart(cart)
    refreshCartUI()
}

// Renderar siffran på kundvagnsikonen
function renderCartBadge() {
    const badge = document.querySelector('.cart-btn-badge')
    if (!badge) return
    badge.textContent = getCartCount()
}

// Renderar dropdown-menyn för kundvagnen i navbaren
function renderNavbarCart() {
    const container = document.getElementById('cartItems')
    const totalEl = document.getElementById('cartTotal')
    if (!container || !totalEl) return

    const cart = getCart()
    if (!cart.length) {
        container.innerHTML = `<p class="mb-3">Din varukorg är tom.</p>`
        totalEl.textContent = '0 kr'
        return
    }

    container.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-item d-flex align-items-start gap-3 mb-3" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-img"/>
            <div class="flex-grow-1">
                <div class="fw-semibold">${item.title}</div>
                <div class="small">${formatPrice(item.price)}</div>
                <div class="cart-controls mt-2">
                    <button class="qty-btn minus" data-id="${item.id}">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Ta bort</button>
                </div>
            </div>
        </div>
    `
        )
        .join('')

    totalEl.textContent = formatPrice(getCartTotal())
}

// Renderar sidan för kundvagnen (cart.html)
function renderCartPage() {
    const itemsEl = document.getElementById('cartPageItems')
    const totalEl = document.getElementById('cartPageTotal')
    const countEl = document.getElementById('cartPageCount')
    if (!itemsEl || !totalEl || !countEl) return

    const cart = getCart()
    countEl.textContent = getCartCount()
    totalEl.textContent = formatPrice(getCartTotal())

    if (!cart.length) {
        itemsEl.innerHTML = `
            <div class="cart-empty">
                <h3>Din kundvagn är tom</h3>
                <p>Lägg till några produkter för att komma igång.</p>
                <a href="/pages/products.html" class="btn btn-dark">Visa produkter</a>
            </div>
        `
        return
    }

    itemsEl.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-page-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-page-img"/>
            <div class="cart-page-info">
                <h3>${item.title}</h3>
                <div class="cart-page-price">Pris: ${formatPrice(item.price)}</div>
                <div class="cart-controls">
                    <button class="qty-btn minus" data-id="${item.id}">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Ta bort</button>
                </div>
            </div>
            <div class="cart-page-subtotal">${formatPrice(item.price * item.quantity)}</div>
        </div>
    `
        )
        .join('')
}

// Initierar klick-events för + / - / ta bort
let cartEventsInitialized = false
function setupCartEvents() {
    if (cartEventsInitialized) return
    cartEventsInitialized = true

    document.addEventListener('click', (e) => {
        const target = e.target
        if (!(target instanceof HTMLElement)) return
        const productId = target.dataset.id
        if (!productId) return

        const cart = getCart()
        const item = cart.find((p) => p.id === productId)
        if (!item) return

        if (target.classList.contains('plus'))
            updateQuantity(productId, item.quantity + 1)
        if (target.classList.contains('minus'))
            updateQuantity(productId, item.quantity - 1)
        if (target.classList.contains('remove-btn')) removeFromCart(productId)
    })
}

// Uppdaterar all kundvagns-UI: badge, dropdown och sida
function refreshCartUI() {
    renderCartBadge()
    renderNavbarCart()
    renderCartPage()
}

// Visar toast-meddelande när produkt läggs till
function showCartToast(message = 'Produkten lades till i kundvagnen') {
    const toast = document.getElementById('cartToast')
    if (!toast) return
    toast.textContent = message
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 2500)
}

// Skickar order till backend
async function placeOrder() {
    const cart = getCart()
    if (!cart.length) return alert('Din kundvagn är tom')

    try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Ingen användare inloggad')

        // Hämta användardata
        const userRes = await fetch('http://localhost:3000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
        const userData = await userRes.json()
        const user = userData.user || userData.data?.user
        if (!user) throw new Error('Kunde inte hämta användare')

        // Skapa order
        const total = getCartTotal()
        const orderRes = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId: user.id, totalPrice: total })
        })

        const text = await orderRes.text()
        let newOrder
        try {
            newOrder = JSON.parse(text)
        } catch (err) {
            console.error('Kunde inte parsa JSON från backend:', err)
            throw new Error('Order skapades inte! Backend skickade inte JSON')
        }

        const orderId = newOrder.orderId || newOrder.insertId || newOrder.id
        if (!orderId) throw new Error('Order skapades inte!')

        // Skapa order-items
        for (const item of cart) {
            const res = await fetch('http://localhost:3000/api/order-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    order_id: Number(orderId),
                    order__id: Number(orderId),
                    product_id: Number(item.id),
                    product__id: Number(item.id),
                    quantity: item.quantity,
                    price_at_order: item.price
                })
            })
            if (!res.ok) {
                const errText = await res.text()
                throw new Error('Order item kunde inte skapas: ' + errText)
            }
        }

        // Töm kundvagn
        localStorage.removeItem('cart')
        refreshCartUI()
        window.location.href = '/pages/member.html'
    } catch (err) {
        console.error('placeOrder error:', err)
        alert(err.message || 'Kunde inte lägga order. Kolla konsolen.')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('place-order-btn')
    if (btn) btn.addEventListener('click', placeOrder)

    setupCartEvents()
    refreshCartUI()
})
document.addEventListener('componentsLoaded', () => {
    setupCartEvents()
    refreshCartUI()
})
