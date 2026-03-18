/*
JavaScript-kommentar: Strukturöversikt
1. Hämtar och sparar varukorg i localStorage
2. Räknar antal och totalsumma
3. Lägger till, tar bort och uppdaterar produkter
4. Renderar navbarens mini-cart
5. Renderar cart page
6. Hanterar klick på plus, minus och ta bort
7. Initierar när sidan eller komponenter laddats
*/

/* 1. Hämta och spara varukorg */
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
}

/* 2. Hjälpfunktioner */
function getCartCount() {
    const cart = getCart()
    return cart.reduce((total, item) => total + item.quantity, 0)
}

function getCartTotal() {
    const cart = getCart()
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

function formatPrice(price) {
    return `${price.toFixed(2)} kr`
}

/* 3. Cart-logik */
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
    const product = cart.find((item) => item.id === productId)

    if (!product) return

    if (newQuantity <= 0) {
        removeFromCart(productId)
        return
    }

    product.quantity = newQuantity
    saveCart(cart)
    refreshCartUI()
}

/* 4. Rendera badge i navbar */
function renderCartBadge() {
    const cartBadge = document.querySelector('.cart-btn-badge')
    if (!cartBadge) return

    const totalQty = getCartCount()
    cartBadge.textContent = totalQty
}

/* 5. Rendera mini-cart i navbar */
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

/* 6. Rendera cart page */
function renderCartPage() {
    const cartPageItems = document.getElementById('cartPageItems')
    const cartPageTotal = document.getElementById('cartPageTotal')

    if (!cartPageItems || !cartPageTotal) return

    const cart = getCart()

    if (cart.length === 0) {
        cartPageItems.innerHTML = `<p>Din varukorg är tom.</p>`
        cartPageTotal.textContent = '0 kr'
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
                        <p>Pris: ${formatPrice(item.price)}</p>

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

    cartPageTotal.textContent = formatPrice(getCartTotal())
}

/* 7. Uppdatera hela UI:t */
function refreshCartUI() {
    renderCartBadge()
    renderNavbarCart()
    renderCartPage()
}

/* 8. Event delegation för plus, minus och remove */
function setupCartEvents() {
    document.addEventListener('click', function (e) {
        const target = e.target
        if (!(target instanceof HTMLElement)) return

        const id = Number(target.dataset.id)
        if (!id) return

        const cart = getCart()
        const item = cart.find((product) => product.id === id)
        if (!item) return

        if (target.classList.contains('plus')) {
            updateQuantity(id, item.quantity + 1)
        }

        if (target.classList.contains('minus')) {
            updateQuantity(id, item.quantity - 1)
        }

        if (target.classList.contains('remove-btn')) {
            removeFromCart(id)
        }
    })
}

/* 9. Init */
let cartEventsInitialized = false

function initCart() {
    refreshCartUI()

    if (!cartEventsInitialized) {
        setupCartEvents()
        cartEventsInitialized = true
    }
}

document.addEventListener('DOMContentLoaded', initCart)
document.addEventListener('componentsLoaded', initCart)
