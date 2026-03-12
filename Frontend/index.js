/*
JavaScript-kommentar: Strukturöversikt
1. Startsektion väntar in att HTML-dokumentet laddats klart
2. Variabelsektion hämtar element från DOM
   2.1 Container för produkter i varukorgen
   2.2 Element för totalsumma
   2.3 Badge som visar antal produkter
3. Funktionssektion innehåller logik för att uppdatera varukorgen
   3.1 Hämtar alla produkter i varukorgen
   3.2 Räknar ut totalsumma och totalt antal
   3.3 Uppdaterar innehållet i totalsumma och badge
   3.4 Visar meddelande om varukorgen är tom
4. Händelsesektion hanterar klick i varukorgen
   4.1 Ökar antal produkter
   4.2 Minskar antal produkter
   4.3 Tar bort produkt från varukorgen
   4.4 Uppdaterar varukorgen efter förändring
5. Initieringssektion kör första uppdateringen vid sidladdning
*/

/* 1. Startsektion väntar in att HTML-dokumentet laddats klart */
document.addEventListener('DOMContentLoaded', function () {
    /* 2. Variabelsektion hämtar element från DOM */
    const cartItemsContainer = document.getElementById('cartItems')
    const cartTotal = document.getElementById('cartTotal')
    const cartBadge = document.querySelector('.cart-btn-badge')

    /* 3. Funktionssektion innehåller logik för att uppdatera varukorgen */
    function updateCart() {
        /* 3.1 Hämtar alla produkter i varukorgen */
        const cartItems = document.querySelectorAll('.cart-item')

        let total = 0
        let totalQty = 0

        /* 3.2 Räknar ut totalsumma och totalt antal */
        cartItems.forEach((item) => {
            const price = Number(item.dataset.price)
            const qty = Number(item.querySelector('.qty-value').textContent)

            total += price * qty
            totalQty += qty
        })

        /* 3.3 Uppdaterar innehållet i totalsumma och badge */
        cartTotal.textContent = `${total} kr`
        cartBadge.textContent = totalQty

        /* 3.4 Visar meddelande om varukorgen är tom */
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `<p class="mb-3">Din varukorg är tom.</p>`
            cartTotal.textContent = '0 kr'
            cartBadge.textContent = '0'
        }
    }

    /* 4. Händelsesektion hanterar klick i varukorgen */
    cartItemsContainer.addEventListener('click', function (e) {
        const item = e.target.closest('.cart-item')

        if (!item) return

        const qtyEl = item.querySelector('.qty-value')
        let qty = Number(qtyEl.textContent)

        /* 4.1 Ökar antal produkter */
        if (e.target.classList.contains('plus')) {
            qty++
            qtyEl.textContent = qty
        }

        /* 4.2 Minskar antal produkter */
        if (e.target.classList.contains('minus') && qty > 1) {
            qty--
            qtyEl.textContent = qty
        }

        /* 4.3 Tar bort produkt från varukorgen */
        if (e.target.classList.contains('remove-btn')) {
            item.remove()
        }

        /* 4.4 Uppdaterar varukorgen efter förändring */
        updateCart()
    })

    /* 5. Initieringssektion kör första uppdateringen vid sidladdning */
    updateCart()
})
