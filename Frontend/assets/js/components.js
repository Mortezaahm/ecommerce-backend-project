/*
JavaScript-kommentar: Strukturöversikt
1. Funktion som laddar in HTML-komponenter
2. Initiering som laddar header och footer
3. Skickar ett event när komponenterna är färdiga
*/

/* 1. Laddar en HTML-komponent och placerar den i rätt element */
async function loadComponent(id, file) {
    const element = document.getElementById(id)

    if (!element) return

    const response = await fetch(file)

    if (!response.ok) {
        throw new Error(`Kunde inte ladda ${file}`)
    }

    element.innerHTML = await response.text()
}

/* 2. Startfunktion som laddar header och footer */
async function initComponents() {
    /* Avgör rätt sökväg beroende på sida */
    const basePath = window.location.pathname.includes('/pages/') ? '../' : './'

    /* Laddar komponenterna */
    await loadComponent('header', `${basePath}components/header.html`)
    await loadComponent('footer', `${basePath}components/footer.html`)

    /* 3. Skickar event när allt är färdigt */
    document.dispatchEvent(new CustomEvent('componentsLoaded'))
}

// components.js – efter document.dispatchEvent('componentsLoaded')
async function updateNavbar() {
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
            accountMainLink.href = '/Frontend/pages/member.html'
        }

        if (registerRow) registerRow.classList.add('d-none')
        if (logoutBtn) logoutBtn.classList.remove('d-none')
        if (ordersLink)
            ordersLink.href = '/Frontend/pages/member.html#bestallningar'
        if (reviewsLink)
            reviewsLink.href = '/Frontend/pages/member.html#recensioner'
        if (accountDropdown && name)
            accountDropdown.setAttribute('aria-label', `Mitt konto, ${name}`)
    } else {
        if (accountMainLink) {
            accountMainLink.textContent = 'Logga in'
            accountMainLink.href = '/Frontend/pages/login.html'
        }

        if (registerRow) registerRow.classList.remove('d-none')
        if (logoutBtn) logoutBtn.classList.add('d-none')
        if (ordersLink) ordersLink.href = '/Frontend/pages/login.html'
        if (reviewsLink) reviewsLink.href = '/Frontend/pages/login.html'
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault()
            localStorage.clear()
            window.location.href = '/Frontend/pages/login.html'
        })
    }
}

document.addEventListener('componentsLoaded', updateNavbar)

/* Kör startfunktionen */
initComponents()
