function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
}

function formatPrice(price) {
    return `${Number(price || 0).toFixed(2)} kr`
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

function getCartTotal() {
    return getCart().reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0
    )
}

function normalizeCart() {
    const cart = getCart()
    let changed = false

    const newCart = cart.map((item, index) => {
        if (!item.id) {
            changed = true
            return {
                ...item,
                id: String(item.product_id ?? `old-${index}`),
                quantity: Number(item.quantity || 1),
                price: Number(item.price || 0),
                title: item.title || 'Produkt',
                image: item.image || 'https://via.placeholder.com/150'
            }
        }
        return item
    })

    if (changed) saveCart(newCart)
}

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
            image: product.image || 'https://via.placeholder.com/150',
            quantity
        })
    }

    saveCart(cart)
    refreshCartUI()
    showCartToast(`${product.title} lades till i kundvagnen`)
}

function removeFromCart(productId) {
    const id = String(productId)
    const cart = getCart().filter((item) => item.id !== id)
    saveCart(cart)
    refreshCartUI()
}

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

function renderCartBadge() {
    const badge = document.querySelector('.cart-btn-badge')
    if (!badge) return
    badge.textContent = getCartCount()
}

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

function handleCartClick(e) {
    const button = e.target.closest('.qty-btn, .remove-btn')
    if (!button) return
    const productId = button.dataset.id
    if (!productId) return

    const cartItem = getCart().find((p) => p.id === productId)
    if (!cartItem) return

    if (button.classList.contains('plus')) {
        updateQuantity(productId, cartItem.quantity + 1)
    } else if (button.classList.contains('minus')) {
        updateQuantity(productId, cartItem.quantity - 1)
    } else if (button.classList.contains('remove-btn')) {
        removeFromCart(productId)
    }
}

let cartEventsInitialized = false
function setupCartEvents() {
    if (cartEventsInitialized) return
    cartEventsInitialized = true

    const cartDropdown = document.querySelector('.cart-dropdown')
    if (cartDropdown) {
        cartDropdown.addEventListener('click', handleCartClick)
    }

    const cartPage = document.querySelector('.cart-page-items')
    if (cartPage) {
        cartPage.addEventListener('click', handleCartClick)
    }
}

function refreshCartUI() {
    renderCartBadge()
    renderNavbarCart()
    renderCartPage()
}

function showCartToast(message = 'Produkten lades till i kundvagnen') {
    const toast = document.getElementById('cartToast')
    if (!toast) return
    toast.textContent = message
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 2500)
}

document.addEventListener('DOMContentLoaded', () => {
    normalizeCart()
    setupCartEvents()
    refreshCartUI()
})

document.addEventListener('componentsLoaded', () => {
    normalizeCart()
    setupCartEvents()
    refreshCartUI()
})
