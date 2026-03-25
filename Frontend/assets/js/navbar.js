// Ladda produkter dynamiskt till megameny
async function loadNavbarProducts() {
    const productsList = document.getElementById('navbar-products-list')
    if (!productsList) return

    // Visa "Laddar..." medan vi hämtar produkter
    productsList.innerHTML = '<div class="col-12 text-center">Laddar...</div>'

    try {
        const res = await fetch('http://localhost:3000/api/products')
        const products = await res.json()

        productsList.innerHTML = ''

        // Visa max 6 produkter i mega-menyn
        products.slice(0, 6).forEach((product) => {
            const col = document.createElement('div')
            col.className = 'col-sm-6 col-lg'

            col.innerHTML = `
                <a href="/pages/product-spec.html?id=${product.product_id}" class="mega-product-card">
                    <img src="${product.image || '/assets/media/juice-placeholder.png'}" alt="${product.title}" class="img-fluid mega-product-img" />
                    <div class="mega-product-body">
                        <h6 class="mb-1">${product.title}</h6>
                        <p class="small mb-0">${product.info ? product.info.substring(0, 80) : 'Ingen beskrivning.'}</p>
                    </div>
                </a>
            `
            productsList.appendChild(col)
        })
    } catch (err) {
        productsList.innerHTML =
            '<div class="col-12 text-danger text-center">Kunde inte ladda produkter</div>'
    }
}

// Kör när header/footer är inlästa
document.addEventListener('componentsLoaded', loadNavbarProducts)

// Hanterar dropdown-blur för konto och varukorg
document.addEventListener('componentsLoaded', function () {
    const dropdownButtons = document.querySelectorAll(
        '#accountDropdown, #cartDropdown'
    )

    dropdownButtons.forEach((button) => {
        button.addEventListener('hidden.bs.dropdown', function () {
            button.blur()
        })
    })
})

// Initiera navbar-status baserat på inloggning
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const name = localStorage.getItem('name')

    const isLoggedIn = !!token && !!userId

    const accountMainLink = document.getElementById('account-main-link')
    const registerRow = document.getElementById('register-row')
    const logoutBtn = document.getElementById('logout-btn')
    const ordersLink = document.getElementById('orders-link')
    const reviewsLink = document.getElementById('reviews-link')
    const accountDropdown = document.getElementById('accountDropdown')

    // Om användaren är inloggad
    if (isLoggedIn) {
        if (accountMainLink) {
            accountMainLink.textContent = 'Min sida'
            accountMainLink.href = '/pages/member.html'
        }

        if (registerRow) registerRow.classList.add('d-none')
        if (logoutBtn) logoutBtn.classList.remove('d-none')
        if (ordersLink) ordersLink.href = '/pages/member.html#bestallningar'
        if (reviewsLink) reviewsLink.href = '/pages/member.html#recensioner'
        if (accountDropdown && name)
            accountDropdown.setAttribute('aria-label', `Mitt konto, ${name}`)
    }
    // Om användaren inte är inloggad
    else {
        if (accountMainLink) {
            accountMainLink.textContent = 'Logga in'
            accountMainLink.href = '/pages/login.html'
        }

        if (registerRow) registerRow.classList.remove('d-none')
        if (logoutBtn) logoutBtn.classList.add('d-none')
        if (ordersLink) ordersLink.href = '/pages/login.html'
        if (reviewsLink) reviewsLink.href = '/pages/login.html'
    }

    // Logga ut unktion
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault()
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('name')
            window.location.href = '/pages/login.html'
        })
    }
})
