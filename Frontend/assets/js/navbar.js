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

    /* 3. Ta bort fokus när dropdown stängs */
    dropdownButtons.forEach((button) => {
        button.addEventListener('hidden.bs.dropdown', function () {
            button.blur()
        })
    })
})
