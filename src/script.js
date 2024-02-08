//
async function showDetails() {
    // get the user input 
    const inputFood = document.getElementById("food").value;
    // creating url with input`${}`
    const foodUrl = `https://www.edamam.com/api/recipes/v2?type=public&q="${inputFood}"&field=uri&field=label&field=image`
    // fetch data using the created url
    const result = await callApi(foodUrl)
    display(result);
}
// present the data
function display(data) {
    // get the results-container
    const resultContainer = document.getElementById("result-container");

    //empty the previous search from container
    resultContainer.innerHTML = '';


    if (data.hits && data.hits.length >= 0) {
        // change the json -> to a picture and text for each item in the data
        data.hits.forEach(hit => {
            const recipes = hit.recipe;
            const image = recipes.image;
            const label = recipes.label;
            const url = hit._links.self.href;

            //This section checks if there are hits in the data and iterates over them. It extracts information like image URL, label, and URL for each recipe hit.

            const recipeDiv = document.createElement("div");
            recipeDiv.setAttribute("class", "recipe col-3");
            recipeDiv.addEventListener('click', function () {
                showRecipe(url);
            });

            //An image element is created and configured with the image URL, class, and ID.
            const imageTag = document.createElement("img");
            imageTag.setAttribute("src", `${image}`)
            imageTag.setAttribute("class", "recipeImage");
            imageTag.setAttribute("id", "image-id")

            const paragraphTag = document.createElement("p");
            paragraphTag.innerHTML = label;
            paragraphTag.setAttribute("class", "labelImage");

            //A paragraph element is created for the label, and both the image and paragraph elements are appended to the recipeDiv. 
            recipeDiv.appendChild(imageTag);
            recipeDiv.appendChild(paragraphTag);

            // append the data in the results-container div
            resultContainer.appendChild(recipeDiv);
        });
    }
}
//
async function showRecipe(url) {
    //The showRecipe function takes a URL and fetches detailed information about the selected recipe. It awaits the result from the callApi function and 
    //extracts details like ingredient lines, calories, cuisine type, and meal type.

    const recipeDetail = await callApi(url)

    const ingredientLines = recipeDetail.recipe.ingredientLines;
    const calories = recipeDetail.recipe.calories;
    const cuisineType = recipeDetail.recipe.cuisineType;
    const mealType = recipeDetail.recipe.mealType;

    CreateImageAndIngrediantsWrapper(recipeDetail);

    const resultContainer = document.getElementById("result-container");
    resultContainer.style.width = "30%";

}
//
function CreateImageAndIngrediantsWrapper(recipeDetail) {
    let ingredientsResultContainer;
    // checks if there is an existing container for displaying ingredient details
    if (document.getElementById("ingredients-result-container") === null) {
        ingredientsResultContainer = document.createElement("div");
        ingredientsResultContainer.setAttribute("id", "ingredients-result-container");
    }
    else // If not, it creates a new div element with the id "ingredients-result-container." If it already exists, it clears its content.
    {
        ingredientsResultContainer = document.getElementById("ingredients-result-container")
        ingredientsResultContainer.innerHTML = '';
    }

    //For each ingredient in the list, a paragraph element is created, and the ingredient text is set.
    recipeDetail.recipe.ingredientLines.forEach(ingredient => {
        const ingredientParagraph = document.createElement("p");
        ingredientParagraph.setAttribute("class", "ingredient-paragraph");
        ingredientParagraph.innerHTML = ingredient;

        const buyButton = document.createElement("button");
        buyButton.addEventListener('click', function () {
            addCart(ingredient);
        })
        buyButton.innerHTML = "+";

        const buttonParagraphWrapper = document.createElement("div")
        buttonParagraphWrapper.setAttribute("class", "button-paragraph-wrapper");

        buttonParagraphWrapper.appendChild(buyButton);
        buttonParagraphWrapper.appendChild(ingredientParagraph);

        //paragraphs are then appended to the ingredientsResultContainer
        ingredientsResultContainer.appendChild(buttonParagraphWrapper);

    })

    let ingredientsImage;
    if (document.getElementById("ingredient-image-container") === null) {
        ingredientsImage = document.createElement("div");
        ingredientsImage.setAttribute("id", "ingredient-image-container");
        ingredientsImage.setAttribute("class", "image-container");
    }
    else // If not, it creates a new div element with the id "ingredients-result-container." If it already exists, it clears its content.
    {
        ingredientsImage = document.getElementById("ingredient-image-container")
        ingredientsImage.innerHTML = '';
    }

    const imageTag = document.createElement("img");
    imageTag.setAttribute("src", `${recipeDetail.recipe.image}`)
    imageTag.setAttribute("class", "recipeImage");
    imageTag.setAttribute("id", "image-id")
    ingredientsImage.appendChild(imageTag);


    let ingredientImageWrapper;
    if (document.getElementById("ingredient-image-wrapper") === null) {
        ingredientImageWrapper = document.createElement("div")
        ingredientImageWrapper.setAttribute("id", "ingredient-image-wrapper");
    }
    else // If not, it creates a new div element with the id "ingredients-result-container." If it already exists, it clears its content.
    {
        ingredientImageWrapper = document.getElementById("ingredient-image-wrapper")
        ingredientImageWrapper.innerHTML = '';
    }

    ingredientImageWrapper.appendChild(ingredientsImage);
    ingredientImageWrapper.appendChild(ingredientsResultContainer);
    ingredientImageWrapper.style.width = "70%";

    const resultWrapper = document.getElementById("result-wrapper");
    resultWrapper.appendChild(ingredientImageWrapper);
}
function addCart(ingredient) {
    let cartIngredients;
    if (document.getElementById("cart") === null) {
        cartIngredients = document.createElement("div");
        cartIngredients.setAttribute("id", "cart");
        cartIngredients.setAttribute("class", "cart-container");
    }
    else {
        cartIngredients = document.getElementById("cart")
    }

    const cartButton = document.createElement("button")
    cartButton.setAttribute("class", "button-cart");
    cartButton.innerHTML = "X";

    const cartPagraph = document.createElement("p");
    cartPagraph.setAttribute("class", "cart-pararaph")
    cartPagraph.innerHTML = ingredient;

    const cartWrapper = document.createElement("div");
    cartWrapper.setAttribute("id", "cart-wrapper");


    cartWrapper.appendChild(cartPagraph);
    cartWrapper.appendChild(cartButton);
    cartIngredients.appendChild(cartWrapper);

    const resultWrapper = document.getElementById("result-wrapper");
    resultWrapper.appendChild(cartIngredients);
    resultWrapper.style.width = "80%";
}
//
async function callApi(url) {
    return await fetch(url)
        .then(response => response.json())
}
