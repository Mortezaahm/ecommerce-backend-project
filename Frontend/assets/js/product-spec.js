const backButton = document.getElementById('backButton')

backButton.addEventListener('click', () => {
    window.location.href = './products.html'
})

const productDetail = document.getElementById('productDetail')

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
}

async function loadSingleProduct() {
    const productId = getProductIdFromUrl()

    if (!productId) {
        productDetail.innerHTML = '<p>Ingen produkt hittades.</p>'
        return
    }

    try {
        const res = await fetch(
            `https://fakestoreapi.com/products/${productId}`
        )
        const product = await res.json()

        renderProduct(product)
    } catch (err) {
        console.error('Fel vid hämtning av produkt:', err)
        productDetail.innerHTML = '<p>Kunde inte hämta produkten.</p>'
    }
}

function renderProduct(product) {
    productDetail.innerHTML = `


        <div class="product-detail-card">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.title}">
            </div>

            <div class="product-detail-info">
                <div class="rating">⭐ ${product.rating?.rate ?? 0} (${product.rating?.count ?? 0} recensioner)</div>
                <h1>${product.title}</h1>
                <p class="category">Kategori: ${product.category}</p>
                <p class="description">${product.description}</p>
                <div class="price">$${product.price.toFixed(2)}</div>

                <div class="cart-controls">
                    <div class="quantity-selector">
                        <button id="decreaseQty">−</button>
                        <span id="quantity">1</span>
                        <button id="increaseQty">+</button>
                    </div>

                    <button id="addToCartBtn" class="add-to-cart-btn">Lägg i kundvagn</button>
                </div>
            </div>
        </div>
    `

    setupProductActions(product)
}

function setupProductActions(product) {
    const backButton = document.getElementById('backButton')
    const decreaseBtn = document.getElementById('decreaseQty')
    const increaseBtn = document.getElementById('increaseQty')
    const quantityEl = document.getElementById('quantity')
    const addToCartBtn = document.getElementById('addToCartBtn')

    let quantity = 1

    backButton.addEventListener('click', () => {
        if (document.referrer) {
            window.history.back()
        } else {
            window.location.href = './products.html'
        }
    })

    decreaseBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--
            quantityEl.textContent = quantity
        }
    })

    increaseBtn.addEventListener('click', () => {
        quantity++
        quantityEl.textContent = quantity
    })

    addToCartBtn.addEventListener('click', () => {
        const cartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        }

        const existingCart = JSON.parse(localStorage.getItem('cart')) || []

        const existingProduct = existingCart.find(
            (item) => item.id === cartItem.id
        )

        if (existingProduct) {
            existingProduct.quantity += quantity
        } else {
            existingCart.push(cartItem)
        }

        localStorage.setItem('cart', JSON.stringify(existingCart))
        alert('Produkten lades till i kundvagnen')
    })
}

loadSingleProduct()
