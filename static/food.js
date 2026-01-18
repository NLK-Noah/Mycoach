const searchInput = document.getElementById('food-search');
const resultsList = document.getElementById('results-list');

searchInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length < 3) {
        resultsList.innerHTML = "";
        return;
    }

    // URL de recherche Open Food Facts
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&page_size=5&json=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        resultsList.innerHTML = ""; 

        data.products.forEach(product => {
            const kcal = product.nutriments['energy-kcal_100g'] || 0;
            const name = product.product_name_fr || product.product_name || "Produit inconnu";

            const div = document.createElement('div');
            div.className = 'food-item';
            div.innerHTML = `<strong>${name}</strong> - ${kcal} kcal`;
            
            div.onclick = () => {
                alert(`Tu as sélectionné : ${name} (${kcal} kcal)`);
            };
            
            resultsList.appendChild(div);
        });
    } catch (error) {
        console.error("Erreur API:", error);
    }
});