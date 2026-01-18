const circle = document.getElementById('progress-bar');
        const resultsList = document.getElementById('results-list');
        const searchInput = document.getElementById('food-search');
        
        let totalKcal = 0;
        const goalKcal = 2000;
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;

        
        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            const query = e.target.value;

            timeoutId = setTimeout(async () => {
                if (query.length < 3) { resultsList.innerHTML = ""; return; }

                const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&page_size=5&json=1`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    resultsList.innerHTML = "";

                    data.products.forEach(product => {
                        const kcal = Math.round(product.nutriments['energy-kcal_100g'] || 0);
                        const name = product.product_name_fr || product.product_name || "Inconnu";
                        
                        const div = document.createElement('div');
                        div.className = 'food-item';
                        div.innerHTML = `<strong>${name}</strong> - ${kcal} kcal`;
                        div.onclick = () => {
                            updateProgress(kcal, name);
                            resultsList.innerHTML = "";
                            searchInput.value = "";
                        };
                        resultsList.appendChild(div);
                    });
                } catch (e) { console.error("Erreur API", e); }
            }, 300);
        });

        function updateProgress(kcalAdded, foodName, isLoading = false) {
            if(!isLoading) totalKcal += kcalAdded;

            document.getElementById('current-kcal').innerText = totalKcal;
            const offset = circumference - (Math.min(totalKcal, goalKcal) / goalKcal) * circumference;
            circle.style.strokeDashoffset = offset;

            if(!isLoading) {
                const now = new Date();
                const time = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
                const mealHTML = `
                    <div class="meal-card">
                        <div>
                            <span class="meal-time">${time}</span>
                            <span class="meal-name">${foodName}</span>
                        </div>
                        <span class="meal-kcal">+${kcalAdded} kcal</span>
                    </div>`;
                document.getElementById('meals-container').insertAdjacentHTML('afterbegin', mealHTML);
                saveData();
            }
        }

        function saveData() {
            const data = {
                total: totalKcal,
                html: document.getElementById('meals-container').innerHTML
            };
            localStorage.setItem('mycoach_data', JSON.stringify(data));
        }

        function loadData() {
            const saved = localStorage.getItem('mycoach_data');
            if(saved) {
                const data = JSON.parse(saved);
                totalKcal = data.total;
                document.getElementById('meals-container').innerHTML = data.html;
                updateProgress(0, "", true); 
            }
        }

        function resetDay() {
            if(confirm("Effacer la journée ?")) {
                localStorage.removeItem('mycoach_data');
                location.reload();
            }
        }

        window.onload = loadData