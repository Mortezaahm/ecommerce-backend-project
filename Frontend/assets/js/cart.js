/*
JavaScript-kommentar: Strukturöversikt
1. Väntar på att komponenterna laddats in
2. Hämtar viktiga element från DOM
3. Funktion för att uppdatera varukorgen
4. Hanterar klick på varukorgens knappar
5. Kör första uppdateringen
*/

document.addEventListener('componentsLoaded', function () {
    /* 2. Hämta element från DOM */
    const cartItemsContainer = document.getElementById('cartItems')
    const cartTotal = document.getElementById('cartTotal')
    const cartBadge = document.querySelector('.cart-btn-badge')

    /* Avsluta om elementen inte finns på sidan */
    if (!cartItemsContainer || !cartTotal || !cartBadge) return

    /* 3. Uppdaterar totalsumma och antal produkter */
    function updateCart() {
        const cartItems = document.querySelectorAll('.cart-item')

        let total = 0
        let totalQty = 0

        cartItems.forEach((item) => {
            const price = Number(item.dataset.price)
            const qty = Number(item.querySelector('.qty-value').textContent)

            total += price * qty
            totalQty += qty
        })

        cartTotal.textContent = `${total} kr`
        cartBadge.textContent = totalQty

        /* Visa meddelande om varukorgen är tom */
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `<p class="mb-3">Din varukorg är tom.</p>`
            cartTotal.textContent = '0 kr'
            cartBadge.textContent = '0'
        }
    }

    /* 4. Hanterar klick i varukorgen */
    cartItemsContainer.addEventListener('click', function (e) {
        const item = e.target.closest('.cart-item')
        if (!item) return

        const qtyEl = item.querySelector('.qty-value')
        let qty = Number(qtyEl.textContent)

        /* Öka antal */
        if (e.target.classList.contains('plus')) {
            qty++
            qtyEl.textContent = qty
        }

        /* Minska antal */
        if (e.target.classList.contains('minus') && qty > 1) {
            qty--
            qtyEl.textContent = qty
        }

        /* Ta bort produkt */
        if (e.target.classList.contains('remove-btn')) {
            item.remove()
        }

        updateCart()
    })

    /* 5. Första uppdatering när sidan laddats */
    updateCart()
})
