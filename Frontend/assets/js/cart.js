function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
}

function formatPrice(price) {
    return `${price.toFixed(2)} kr`
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function addToCart(product, quantity = 1) {
    const cart = getCart()
    const existingProduct = cart.find((item) => item.id === product.id)

    if (existingProduct) {
        existingProduct.quantity += quantity
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        })
    }

    saveCart(cart)
    refreshCartUI()
}

function removeFromCart(productId) {
    const cart = getCart().filter((item) => item.id !== productId)
    saveCart(cart)
    refreshCartUI()
}

function updateQuantity(productId, newQuantity) {
    const cart = getCart()
    const item = cart.find((product) => product.id === productId)

    if (!item) return

    if (newQuantity <= 0) {
        removeFromCart(productId)
        return
    }

    item.quantity = newQuantity
    saveCart(cart)
    refreshCartUI()
}

function renderCartBadge() {
    const badge = document.querySelector('.cart-btn-badge')
    if (!badge) return

    badge.textContent = getCartCount()
}

function renderNavbarCart() {
    const cartItemsContainer = document.getElementById('cartItems')
    const cartTotal = document.getElementById('cartTotal')

    if (!cartItemsContainer || !cartTotal) return

    const cart = getCart()

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="mb-3">Din varukorg är tom.</p>`
        cartTotal.textContent = '0 kr'
        return
    }

    cartItemsContainer.innerHTML = cart
        .map(
            (item) => `
                <div class="cart-item d-flex align-items-start gap-3 mb-3" data-id="${item.id}">
                    <img
                        src="${item.image}"
                        alt="${item.title}"
                        class="cart-item-img"
                    />

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

    cartTotal.textContent = formatPrice(getCartTotal())
}

function renderCartPage() {
    const cartPageItems = document.getElementById('cartPageItems')
    const cartPageTotal = document.getElementById('cartPageTotal')
    const cartPageCount = document.getElementById('cartPageCount')

    if (!cartPageItems || !cartPageTotal || !cartPageCount) return

    const cart = getCart()

    cartPageCount.textContent = getCartCount()
    cartPageTotal.textContent = formatPrice(getCartTotal())

    if (cart.length === 0) {
        cartPageItems.innerHTML = `
            <div class="cart-empty">
                <h3>Din kundvagn är tom</h3>
                <p>Lägg till några produkter för att komma igång.</p>
                <a href="/Frontend/pages/products.html" class="btn btn-dark">
                    Visa produkter
                </a>
            </div>
        `
        return
    }

    cartPageItems.innerHTML = cart
        .map(
            (item) => `
                <div class="cart-page-item" data-id="${item.id}">
                    <img
                        src="${item.image}"
                        alt="${item.title}"
                        class="cart-page-img"
                    />

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

                    <div class="cart-page-subtotal">
                        ${formatPrice(item.price * item.quantity)}
                    </div>
                </div>
            `
        )
        .join('')
}

function refreshCartUI() {
    renderCartBadge()
    renderNavbarCart()
    renderCartPage()
}

let cartEventsInitialized = false

function setupCartEvents() {
    document.addEventListener('click', function (e) {
        const target = e.target
        if (!(target instanceof HTMLElement)) return

        const productId = Number(target.dataset.id)
        if (!productId) return

        const cart = getCart()
        const item = cart.find((product) => product.id === productId)
        if (!item) return

        if (target.classList.contains('plus')) {
            updateQuantity(productId, item.quantity + 1)
        }

        if (target.classList.contains('minus')) {
            updateQuantity(productId, item.quantity - 1)
        }

        if (target.classList.contains('remove-btn')) {
            removeFromCart(productId)
        }
    })
}

function initCart() {
    refreshCartUI()

    if (!cartEventsInitialized) {
        setupCartEvents()
        cartEventsInitialized = true
    }
}

document.addEventListener('DOMContentLoaded', initCart)
document.addEventListener('componentsLoaded', initCart)
