let currentWater = 0;
const maxWater = 10000000000;

const level = document.getElementById("level1");
const amountInput = document.getElementById("amount");

// --- RESET QUOTIDIEN ---
function checkDailyReset() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem("lastReset");

    if (lastReset !== today) {
        currentWater = 0;
        localStorage.setItem("lastReset", today);
        localStorage.setItem("currentWater", currentWater);
    }
}

// --- CHARGEMENT ---
function loadData() {
    checkDailyReset();
    currentWater = Number(localStorage.getItem("currentWater")) || 0;
    updateWater();
}

// --- BOUTONS ---
document.getElementById("add").addEventListener("click", () => {
    const value = Number(amountInput.value);
    if (value > 0) {
        currentWater = Math.min(currentWater + value, maxWater);
        saveAndUpdate();
    }
    if(currentWater>=maxWater){
        alert("Félicitations ! Vous avez atteint votre objectif quotidien en eau !");
    }
});

document.getElementById("250").addEventListener("click", () => {
    currentWater = Math.min(currentWater + 250, maxWater);
    saveAndUpdate();
    if(currentWater>=maxWater){
        alert("Félicitations ! Vous avez atteint votre objectif quotidien en eau !");
    }
});

document.getElementById("500").addEventListener("click", () => {
    currentWater = Math.min(currentWater + 500, maxWater);
    saveAndUpdate();
    if(currentWater>=maxWater){
        alert("Félicitations ! Vous avez atteint votre objectif quotidien en eau !");
    }
});

document.getElementById("remove").addEventListener("click", () => {
    const value = Number(amountInput.value);
    if (value > 0) {
        currentWater = Math.max(currentWater - value, 0);
        saveAndUpdate();
    }
});

document.getElementById("reset").addEventListener("click", () => {
    currentWater = 0;
    saveAndUpdate();
});

function saveAndUpdate() {
    localStorage.setItem("currentWater", currentWater);
    updateWater();
}

function updateWater() {
    const percentage = (currentWater / maxWater) * 100;
    level.style.height = percentage + "%";
    level.textContent = `${currentWater} ml`;
}

// INIT
loadData();
