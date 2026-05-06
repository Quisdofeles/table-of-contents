//---------------------------
//   TEMPLATE RECIPE LOADER
//---------------------------

async function loadRecipe() {
    try {
        const response = await fetch('database.json');
        const data = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('id');

        const recipe = data.recipes.find(r => r.id === recipeId) || data.recipes[0];
        if (!recipe) return;

        document.title = `${recipe.title}`;
        document.getElementById('recipe-title').innerText = recipe.title;
        document.getElementById('recipe-page-bg').style.backgroundImage = `url('${recipe.bgImage}')`;
        document.getElementById('star-fill-level').style.width = (recipe.rating / 5 * 100) + "%";

        document.getElementById('stat-servings').innerText = recipe.stats.servings;
        document.getElementById('stat-time').innerText = recipe.stats.time;
        document.getElementById('stat-calories').innerText = recipe.stats.calories;
        document.getElementById('stat-difficulty').innerText = recipe.stats.difficulty;
        document.getElementById('recipe-difficulty').src = recipe.stats.difficultyIcon;

        const tagsList = document.getElementById('tags-list');
        tagsList.innerHTML = ""; 
        recipe.tags.forEach(tag => {
            tagsList.innerHTML += `<li><a href="index.html?tag=${encodeURIComponent(tag)}">${tag}</a></li>`;
        });

        const ingContainer = document.getElementById('ingredients-list');
        ingContainer.innerHTML = ""; 
        recipe.ingredients.forEach(group => {
            if (group.section) ingContainer.innerHTML += `<h3>${group.section}:</h3>`;
            let ul = "<ul>";
            group.items.forEach(item => { ul += `<li>${item}</li>`; });
            ingContainer.innerHTML += ul + "</ul>";
        });

        const insContainer = document.getElementById('instructions-list');
        insContainer.innerHTML = "";
        recipe.instructions.forEach(group => {
            if (group.section) insContainer.innerHTML += `<h3>${group.section}:</h3>`;
            let ol = "<ol>";
            group.steps.forEach(step => { ol += `<li>${step}</li>`; });
            insContainer.innerHTML += ol + "</ol>";
        });

    } catch (error) {
        console.error("Error loading the recipe database:", error);
    }
}

//------------------------
//    RECIPE INDEX LOADER
//------------------------

let allRecipes = []; 

async function loadRecipeIndex() {
    const container = document.getElementById('recipe-list');
    if (!container) return;

    try {
        const response = await fetch('database.json');
        const data = await response.json();
        allRecipes = data.recipes;
        
        const searchBar = document.getElementById('search-bar');
        const urlParams = new URLSearchParams(window.location.search);
        const filterTag = urlParams.get('tag');

        if (searchBar) {
            // Re-attaching listener: strictly title search now
            searchBar.addEventListener('input', () => {
                const activeBtn = document.querySelector('.sort-btn button.active');
                // Detect mode based on the button text to avoid complex attribute matching
                let mode = 'alphabetical';
                if (activeBtn) {
                    const text = activeBtn.innerText.toLowerCase();
                    if (text.includes('rating')) mode = 'rating';
                    if (text.includes('tag')) mode = 'tags';
                }
                renderRecipes(mode, activeBtn);
            });
        }
        
        if (filterTag) {
            // Find the tag button and render that view
            const tagButton = Array.from(document.querySelectorAll('.sort-btn button'))
                                   .find(btn => btn.innerText.toLowerCase().includes('tag'));
            renderRecipes('tags', tagButton);

            // Smooth scroll to the specific tag section
            setTimeout(() => {
                const targetId = `tag-${filterTag.toLowerCase().replace(/\s+/g, '-')}`;
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300); 
        } else {
            // Default: Alpha view
            const alphaButton = Array.from(document.querySelectorAll('.sort-btn button'))
                                     .find(btn => btn.innerText.toLowerCase().includes('alpha') || btn.innerText.toLowerCase().includes('a-z'));
            renderRecipes('alphabetical', alphaButton);
        }
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

    // Handle Button Appearance
    const buttons = document.querySelectorAll('.sort-btn button');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (clickedButton) clickedButton.classList.add('active');

    // Filter: Title only
    const query = searchBar ? searchBar.value.toLowerCase() : "";
    const filteredRecipes = allRecipes.filter(r => r.title.toLowerCase().includes(query));

    let htmlContent = "";

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
                        <div class="star-rating-wrapper" style="font-size: 2rem;">
                            <div class="stars-empty">☆☆☆☆☆</div>
                            <div class="stars-full" style="width: ${percentage}%">★★★★★</div>
                        </div>
                    </div>`;
            }
            htmlContent += generateTileHTML(recipe);
        });
    }
    else if (sortType === 'tags') {
        const tags = [...new Set(allRecipes.flatMap(r => r.tags))].sort();
        tags.forEach(tag => {
            const tagId = `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`;
            // Find recipes in this tag that match the search query
            const matches = filteredRecipes.filter(r => r.tags.includes(tag));
            
            if (matches.length > 0) {
                htmlContent += `<h2 id="${tagId}" class="index-letter" style="text-transform: capitalize;">${tag}</h2>`;
                matches.forEach(recipe => {
                    htmlContent += generateTileHTML(recipe);
                });
            }
        });
    }

    container.innerHTML = htmlContent || `<div class="no-results-container"><p>No recipes found matching: "${query}"</p></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('recipe-title')) {
        loadRecipe();
    }
    loadRecipeIndex();
});