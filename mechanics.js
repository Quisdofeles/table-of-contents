//---------------------------
//  TEMPLATE RECIPE LOADER
//---------------------------

async function loadRecipe() {
    try {
        // 1. Fetch the database file
        const response = await fetch('database.json');
        const data = await response.json();

        // 2. Identify which recipe to show using the URL (e.g., recipe.html?id=tomato-basil-soup)
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('id');

        // 3. Find the recipe. If no ID is in the URL, default to the first recipe in the list.
        const recipe = data.recipes.find(r => r.id === recipeId) || data.recipes[0];

        if (!recipe) return; // Safety break if database is empty

        // 4. Update Meta Data & Page Title
        document.title = `${recipe.title}`;
        document.getElementById('recipe-title').innerText = recipe.title;

        // 5. Update Background & Rating
        document.getElementById('recipe-page-bg').style.backgroundImage = `url('${recipe.bgImage}')`;
        document.getElementById('star-fill-level').style.width = (recipe.rating / 5 * 100) + "%";

        // 6. Update Stats & Icons
        document.getElementById('stat-servings').innerText = recipe.stats.servings;
        document.getElementById('stat-time').innerText = recipe.stats.time;
        document.getElementById('stat-calories').innerText = recipe.stats.calories;
        document.getElementById('stat-difficulty').innerText = recipe.stats.difficulty;
        document.getElementById('recipe-difficulty').src = recipe.stats.difficultyIcon;

        // 7. Generate Tags
        const tagsList = document.getElementById('tags-list');
        tagsList.innerHTML = ""; // Clear placeholder
        recipe.tags.forEach(tag => {
            tagsList.innerHTML += `<li><a href="recipes.html">${tag}</a></li>`;
        });

        // 8. Generate Ingredients with Sub-titles
        const ingContainer = document.getElementById('ingredients-list');
        ingContainer.innerHTML = ""; 
        recipe.ingredients.forEach(group => {
            if (group.section) {
                ingContainer.innerHTML += `<h3>${group.section}:</h3>`;
            }
            let ul = "<ul>";
            group.items.forEach(item => {
                ul += `<li>${item}</li>`;
            });
            ingContainer.innerHTML += ul + "</ul>";
        });

        // 9. Generate Instructions with Sub-titles
        const insContainer = document.getElementById('instructions-list');
        insContainer.innerHTML = "";
        recipe.instructions.forEach(group => {
            if (group.section) {
                insContainer.innerHTML += `<h3>${group.section}:</h3>`;
            }
            let ol = "<ol>";
            group.steps.forEach(step => {
                ol += `<li>${step}</li>`;
            });
            insContainer.innerHTML += ol + "</ol>";
        });

    } catch (error) {
        console.error("Error loading the recipe database:", error);
    }
}

// Run the engine
if (document.getElementById('recipe-title')) 
{
    loadRecipe();
}

//------------------------
//   RECIPE INDEX LOADER
//------------------------

let allRecipes = []; // Global storage to prevent redundant fetching

async function loadRecipeIndex() {
    const container = document.getElementById('recipe-list');
    if (!container) return;

    try {
        const response = await fetch('database.json');
        const data = await response.json();
        allRecipes = data.recipes;
        
        // Initial setup for the search bar listener
        const searchBar = document.getElementById('search-bar');
        if (searchBar) {
            searchBar.addEventListener('input', () => {
                const activeBtn = document.querySelector('.sort-btn button.active');
                const mode = activeBtn ? activeBtn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'alphabetical';
                renderRecipes(mode, activeBtn);
            });
        }
        
        // Default startup view: Alphabetical
        renderRecipes('alphabetical', document.querySelector('.sort-btn button.active'));
    } catch (error) {
        console.error("Error loading the recipe database:", error);
    }
}

function generateTileHTML(recipe) {
    const percentage = (recipe.rating / 5) * 100;
    return `
        <a href="template.html?id=${recipe.id}" class="recipe-tile">
            <div class="tile-bg" style="background-image: url('${recipe.bgImage}')"></div>
            <div class="tile-info">
                <h3>${recipe.title}</h3>
                <div class="rating-container">
                    <div class="star-rating-wrapper">
                        <div class="stars-empty">☆☆☆☆☆</div>
                        <div class="stars-full" style="width: ${percentage}%">★★★★★</div>
                    </div>
                </div>
            </div>
        </a>
    `;
}

function renderRecipes(sortType, clickedButton) {
    const container = document.getElementById('recipe-list');
    const searchBar = document.getElementById('search-bar');
    if (!container || !allRecipes.length) return;

    // 1. Handle Button Appearance
    const buttons = document.querySelectorAll('.sort-btn button');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (clickedButton) clickedButton.classList.add('active');

    // 2. Filter Recipes based on search input
    const query = searchBar ? searchBar.value.toLowerCase() : "";
    const filteredRecipes = allRecipes.filter(r => 
        r.title.toLowerCase().includes(query) || 
        r.tags.some(tag => tag.toLowerCase().includes(query))
    );

    let htmlContent = "";

    // 3. Sorting & Grouping Logic
    if (sortType === 'alphabetical') {
        const sorted = [...filteredRecipes].sort((a, b) => a.title.localeCompare(b.title));
        let currentLetter = "";
        sorted.forEach(recipe => {
            const firstLetter = recipe.title.charAt(0).toUpperCase();
            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;
                htmlContent += `<h2 class="index-letter">${currentLetter}</h2>`;
            }
            htmlContent += generateTileHTML(recipe);
        });
    } 
    
    else if (sortType === 'rating') {
        const sorted = [...filteredRecipes].sort((a, b) => b.rating - a.rating);
        let currentRating = null;
        
        sorted.forEach(recipe => {
            if (recipe.rating !== currentRating) {
                currentRating = recipe.rating;
                const percentage = (currentRating / 5) * 100;
                htmlContent += `
                    <div class="index-letter">
                        <div class="star-rating-wrapper">
                            <div class="stars-empty">☆☆☆☆☆</div>
                            <div class="stars-full" style="width: ${percentage}%">★★★★★</div>
                        </div>
                    </div>`;
            }
            htmlContent += generateTileHTML(recipe);
        });
    }
    
    else if (sortType === 'tags') {
        const tags = [...new Set(filteredRecipes.flatMap(r => r.tags))].sort();
        tags.forEach(tag => {
            htmlContent += `<h2 class="index-letter" style="text-transform: capitalize;">${tag}</h2>`;
            const matches = filteredRecipes.filter(r => r.tags.includes(tag));
            matches.forEach(recipe => {
                htmlContent += generateTileHTML(recipe);
            });
        });
    }

    // 4. Update the DOM
    container.innerHTML = htmlContent || `<p class="no-results">No matches found for "${query}"</p>`;
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    // Keep your template loader check
    if (document.getElementById('recipe-title')) {
        loadRecipe();
    }
    // Load the index
    loadRecipeIndex();
});