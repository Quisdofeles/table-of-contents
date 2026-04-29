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

function renderRecipes(sortType, clickedButton) {
    // 1. Remove 'active' class from all buttons in the sort container
    const buttons = document.querySelectorAll('.sort-btn button');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 2. Add 'active' class to the button that was clicked
    clickedButton.classList.add('active');

    // 3. Trigger your sorting logic here
    console.log("Sorting recipes by:", sortType);
    // [Insert your logic to sort/render the list here]
}