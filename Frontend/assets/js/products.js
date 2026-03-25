const productsContainer = document.getElementById('products')
const categoryButtons = document.getElementById('categoryButtons')
const sortToggle = document.getElementById('sortToggle')
const sortPanel = document.getElementById('sortPanel')
const sortOptions = document.querySelectorAll('.sort-option')

const API_BASE = 'http://localhost:3000'

let allProducts = []
let allRatings = {}
let selectedCategory = ''
let selectedSort = ''

sortToggle?.addEventListener('click', (event) => {
    event.stopPropagation()
    sortPanel.classList.toggle('hidden')
})

document.addEventListener('click', (event) => {
    if (!event.target.closest('.sort-wrapper')) {
        sortPanel.classList.add('hidden')
    }
})

sortOptions.forEach((button) => {
    button.addEventListener('click', () => {
        selectedSort = button.dataset.sort
        sortOptions.forEach((btn) => btn.classList.remove('active'))
        button.classList.add('active')
        sortPanel.classList.add('hidden')
        filterAndRenderProducts()
    })
})

async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/api/categories`)
        const categories = await res.json()

        categoryButtons.innerHTML = ''

        const allButton = document.createElement('button')
        allButton.className = 'category-btn active'
        allButton.textContent = 'Alla'
        allButton.addEventListener('click', () => {
            selectedCategory = ''
            updateActiveCategoryButton(allButton)
            filterAndRenderProducts()
        })
        categoryButtons.appendChild(allButton)

        categories.forEach((category) => {
            const button = document.createElement('button')
            button.className = 'category-btn'
            button.textContent = category.title
            button.addEventListener('click', () => {
                selectedCategory = category.title
                updateActiveCategoryButton(button)
                filterAndRenderProducts()
            })
            categoryButtons.appendChild(button)
        })
    } catch (err) {
        console.error('Kunde inte hämta kategorier', err)
    }
}

function updateActiveCategoryButton(activeButton) {
    const buttons = document.querySelectorAll('.category-btn')
    buttons.forEach((button) => button.classList.remove('active'))
    activeButton.classList.add('active')
}

async function loadProducts() {
    productsContainer.innerHTML = '<p>Laddar...</p>'

    try {
        const res = await fetch(`${API_BASE}/api/products`)
        allProducts = await res.json()

        await loadAllRatings()
        filterAndRenderProducts()
    } catch (err) {
        console.error('Fel vid hämtning av produkter', err)
        productsContainer.innerHTML = '<p>Fel vid hämtning 😢</p>'
    }
}

async function loadAllRatings() {
    try {
        const res = await fetch(`${API_BASE}/api/reviews/average/all`)
        const data = await res.json()
        allRatings = data
    } catch (err) {
        console.error('Kunde inte hämta reviews', err)
        allRatings = {}
    }
}

function filterAndRenderProducts() {
    let filteredProducts = [...allProducts]

    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
            (product) => product.category?.title === selectedCategory
        )
    }

    if (selectedSort === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price)
    } else if (selectedSort === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price)
    } else if (selectedSort === 'title-asc') {
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
    } else if (selectedSort === 'title-desc') {
        filteredProducts.sort((a, b) => b.title.localeCompare(a.title))
    } else if (selectedSort === 'rating-desc') {
        filteredProducts.sort(
            (a, b) =>
                (allRatings[b.product_id]?.averageRating ?? 0) -
                (allRatings[a.product_id]?.averageRating ?? 0)
        )
    } else if (selectedSort === 'rating-asc') {
        filteredProducts.sort(
            (a, b) =>
                (allRatings[a.product_id]?.averageRating ?? 0) -
                (allRatings[b.product_id]?.averageRating ?? 0)
        )
    }

    renderProducts(filteredProducts)
}

function renderProducts(products) {
    productsContainer.innerHTML = ''

    if (!products.length) {
        productsContainer.innerHTML = '<p>Inga produkter hittades</p>'
        return
    }

    products.forEach((product) => {
        const ratingData = allRatings[product.product_id] || {
            averageRating: 0,
            totalReviews: 0
        }

        const div = document.createElement('article')
        div.className = 'product'

        div.addEventListener('click', () => {
            window.location.href = `./product-spec.html?id=${product.product_id}`
        })

        div.innerHTML = `
            <img src="${product.image || 'https://via.placeholder.com/400x400?text=No+Image'}" alt="${product.title}">
            <div class="product-content">
                <div class="rating">
                    ${renderStars(Math.round(ratingData.averageRating))} (${ratingData.totalReviews} recensioner)
                </div>
                <h2>${product.title}</h2>
                <p>${product.info || 'Ingen beskrivning'}</p>
                <div class="product-bottom">
                    <div class="price">${product.price.toFixed(2)} kr</div>
                    <button class="add-to-cart-mini" data-id="${product.product_id}" type="button">
                        <i class="bi bi-cart-plus"></i>
                    </button>
                </div>
            </div>
        `

        const addToCartButton = div.querySelector('.add-to-cart-mini')
        addToCartButton?.addEventListener('click', (event) => {
            event.stopPropagation()
            addToCart(product, 1)
            showCartToast(`${product.title} lades till i kundvagnen`)
        })

        productsContainer.appendChild(div)
    })
}

function renderStars(rating) {
    let stars = ''
    for (let i = 1; i <= 5; i++) stars += i <= rating ? '★' : '☆'
    return `<span class="stars">${stars}</span>`
}

loadCategories()
loadProducts()
