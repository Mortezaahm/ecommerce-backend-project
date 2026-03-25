/*
JavaScript-kommentar: Strukturöversikt
1. Väntar på att komponenterna har laddats
2. Hämtar dropdown-knappar i navbaren
3. Hanterar dropdown-beteende
*/

document.addEventListener('componentsLoaded', function () {
    /* 2. Hämta dropdown-knappar */
    const dropdownButtons = document.querySelectorAll(
        '#accountDropdown, #cartDropdown'
    )

    dropdownButtons.forEach((button) => {
        button.addEventListener('hidden.bs.dropdown', function () {
            button.blur()
        })
    })
})

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

    if (isLoggedIn) {
        if (accountMainLink) {
            accountMainLink.textContent = 'Min sida'
            accountMainLink.href = '/pages/member.html'
        }

        if (registerRow) {
            registerRow.classList.add('d-none')
        }

        if (logoutBtn) {
            logoutBtn.classList.remove('d-none')
        }

        if (ordersLink) {
            ordersLink.href = '/pages/member.html#bestallningar'
        }

        if (reviewsLink) {
            reviewsLink.href = '/pages/member.html#recensioner'
        }

        if (accountDropdown && name) {
            accountDropdown.setAttribute('aria-label', `Mitt konto, ${name}`)
        }
    } else {
        if (accountMainLink) {
            accountMainLink.textContent = 'Logga in'
            accountMainLink.href = '/pages/login.html'
        }

        if (registerRow) {
            registerRow.classList.remove('d-none')
        }

        if (logoutBtn) {
            logoutBtn.classList.add('d-none')
        }

        if (ordersLink) {
            ordersLink.href = '/pages/login.html'
        }

        if (reviewsLink) {
            reviewsLink.href = '/pages/login.html'
        }
    }

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
