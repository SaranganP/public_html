const widget_container = document.getElementById("widget-container");
const stores = document.getElementsByClassName("store");
const reset_button = document.getElementById("reset-button");
const score_element = document.getElementById("score");
let score = 5;
let super_gompei_count = 0;
const SAVE_KEY = 'gompeiClickerSave';

function changeScore(amount) {
    score += amount;
    saveGame();
    //set score element
    score_element.innerHTML = "Score: " + score;


    // Update the stores to show which ones are affordable
    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));

        if (score < cost) {
            store.setAttribute("broke", "");
        } else {
            store.removeAttribute("broke");
        }
    }
}
function buy(store) {
    const cost = parseInt(store.getAttribute("cost"));

    // check if player can afford the item
    if (score < cost) {
        return; // Not enough score, do nothing
    }

    // Deduct cost from score
    changeScore(-cost);

    if (store.getAttribute("name") === "Super-Gompei") {
        const super_gom  = document.querySelector("#widget-container #super-gompei")?.parentElement;
        // If Super-Gompei already exists
        if (super_gompei) {
            super_gompei.setAttribute("reap", (parseInt(super_gompei.getAttribute("reap")) + 100));
            return;
        }
    }

    super_gompei_count += 1;
    document.body.style.setProperty("--gompei-count", super_gompei_count);

    // clone node for widget, and add to container
    const widget = store.firstElementChild.cloneNode(true);
    widget.onclick = () => {
        harvest(widget);
    }

    saveGame();
    widget_container.appendChild(widget);

    if (widget.getAttribute("auto") == 'true') {
        widget.setAttribute("harvesting", "");
        setup_end_harvest(widget);
    }
}

function setup_end_harvest(widget) {
    setTimeout(() => {
        // Remove the harvesting flag
        widget.removeAttribute("harvesting");
        // If automatic, start again
        if (widget.getAttribute("auto") == 'true') {
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function harvest(widget) {
    // Only run if currently not harvesting
    if (widget.hasAttribute("harvesting")) return;
    // Set harvesting flag
    widget.setAttribute("harvesting", "");

    // If manual, collect points now
    changeScore(parseInt(widget.getAttribute("reap")));
    showPoint(widget);

    setup_end_harvest(widget);
}


function showPoint(widget) {
    let number = document.createElement("span");
    number.className = "point";
    number.innerHTML = "+" + widget.getAttribute("reap");
    number.onanimationend = () => {
        number.remove();
    }
    widget.appendChild(number);
}

function saveGame() {
    const widgets = [];
    for (const widget of widget_container.children) {
        widgets.push({
            name: widget.getAttribute('name'),
            reap: widget.getAttribute('reap'),
            cooldown: widget.getAttribute('cooldown'),
            auto: widget.getAttribute('auto'),
        });
    }

    const gameState = {
        score,
        super_gompei_count,
        widgets,
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

function createWidgetFromData(data) {
    const templateStore = Array.from(stores).find(s => s.getAttribute('name') === data.name);
    if (!templateStore) return;

    const widget = templateStore.firstElementChild.cloneNode(true);
    widget.setAttribute('reap', data.reap);
    widget.onclick = () => harvest(widget);
    widget_container.appendChild(widget);

    if (widget.getAttribute("auto") == 'true') {
        widget.setAttribute("harvesting", "");
        setup_end_harvest(widget);
    }
}

function loadGame() {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) {
        changeScore(0); // Initial setup for a new game
        return;
    }

    const gameState = JSON.parse(savedData);
    score = gameState.score || 0;
    super_gompei_count = gameState.super_gompei_count || 0;
    document.body.style.setProperty("--gompei-count", super_gompei_count);
    gameState.widgets?.forEach(createWidgetFromData);
    changeScore(0); // Update display and check affordability
}

function resetGame() {
    // Ask for confirmation before resetting
    if (!confirm("Are you sure you want to reset your game? All progress will be lost.")) {
        return;
    }

    // Clear saved data from browser storage
    localStorage.removeItem(SAVE_KEY);

    // Reset game state variables to their initial values
    score = 5;
    super_gompei_count = 0;

    // Clear all the purchased widgets from the screen
    widget_container.innerHTML = '';
    document.body.style.setProperty("--gompei-count", 0);

    // Update the score display and store affordability
    changeScore(0);
}

loadGame(); // Load game on start instead of just initializing the score
reset_button.onclick = resetGame;