const productsContainer = document.getElementById('products')
const categoryButtons = document.getElementById('categoryButtons')
const sortToggle = document.getElementById('sortToggle')
const sortPanel = document.getElementById('sortPanel')
const sortOptions = document.querySelectorAll('.sort-option')

let allProducts = []
let selectedCategory = ''
let selectedSort = ''

sortToggle.addEventListener('click', (event) => {
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
        const res = await fetch('https://fakestoreapi.com/products/categories')
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
            button.textContent = category

            button.addEventListener('click', () => {
                selectedCategory = category
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
        const res = await fetch('https://fakestoreapi.com/products')
        allProducts = await res.json()
        filterAndRenderProducts()
    } catch (err) {
        console.error(err)
        productsContainer.innerHTML = '<p>Fel vid hämtning 😢</p>'
    }
}

function filterAndRenderProducts() {
    let filteredProducts = [...allProducts]

    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
            (product) => product.category === selectedCategory
        )
    }

    if (selectedSort === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price)
    } else if (selectedSort === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price)
    } else if (selectedSort === 'rating-desc') {
        filteredProducts.sort(
            (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0)
        )
    } else if (selectedSort === 'rating-asc') {
        filteredProducts.sort(
            (a, b) => (a.rating?.rate ?? 0) - (b.rating?.rate ?? 0)
        )
    }

    renderProducts(filteredProducts)
}

function renderProducts(products) {
    productsContainer.innerHTML = ''

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>Inga produkter hittades</p>'
        return
    }

    products.forEach((product) => {
        const div = document.createElement('article')
        div.className = 'product'

        div.addEventListener('click', () => {
            window.location.href = `./product-spec.html?id=${product.id}`
        })

        div.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-content">
                <div class="rating">
                    ⭐ ${product.rating?.rate ?? 0} (${product.rating?.count ?? 0} recensioner)
                </div>

                <h2>${product.title}</h2>
                <p>${product.description}</p>

                <div class="product-bottom">
                    <div class="price">${product.price.toFixed(2)} kr</div>

                    <button
                        class="add-to-cart-mini"
                        data-id="${product.id}"
                        aria-label="Lägg till ${product.title} i kundvagnen"
                        type="button"
                    >
                        <i class="bi bi-cart-plus"></i>
                    </button>
                </div>
            </div>
        `

        const addToCartButton = div.querySelector('.add-to-cart-mini')

        addToCartButton.addEventListener('click', (event) => {
            event.stopPropagation()
            addToCart(product, 1)
            showCartToast(`${product.title} lades till i kundvagnen`)
        })
        productsContainer.appendChild(div)
    })
}

loadCategories()
loadProducts()
