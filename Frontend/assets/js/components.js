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

/* Kör startfunktionen */
initComponents()
