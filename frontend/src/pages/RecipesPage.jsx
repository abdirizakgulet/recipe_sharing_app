import React, { useState, useEffect } from "react";
import "./RecipesPages.css";
import Slider from "react-slick"; // For the image slider

const RecipesPages = () => {
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sliderImages, setSliderImages] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ name: "", time: "", imgSrc: "" });
  const [showForm, setShowForm] = useState(false);
  const [showCuisines, setShowCuisines] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRecipes();
    fetchSliderImages();
  }, [filter, page]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${filter === "all" ? "salad" : filter}&per_page=4&page=${page}`,
        {
          headers: {
            Authorization: `Client-ID your-api-key`, // Replace with your  API key
          },
        }
      );

      const data = await response.json();
      const fetchedRecipes = data.results.map((item) => ({
        name: `${filter === "all" ? "Salad" : filter.charAt(0).toUpperCase() + filter.slice(1)} Recipe`,
        time: "40 min",
        imgSrc: item.urls.small,
      }));

      if (page === 1) {
        setRecipes(fetchedRecipes);
      } else {
        setRecipes((prevRecipes) => [...prevRecipes, ...fetchedRecipes]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchSliderImages = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=salad&per_page=5`,
        {
          headers: {
            Authorization: `Client-ID your-api-key`, // Replace with  actual API key
          },
        }
      );

      const data = await response.json();
      const fetchedSliderImages = data.results.map((item) => item.urls.regular);
      setSliderImages(fetchedSliderImages);
    } catch (error) {
      console.error("Error fetching slider images:", error);
    }
  };

  const handleAddRecipe = () => {
    setRecipes([newRecipe, ...recipes]);
    setShowForm(false);
  };

  const handleShowCuisines = () => {
    setShowCuisines(!showCuisines);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const cuisinesList = ["Italian", "Mexican", "Chinese", "Indian", "French"];

  return (
    <div className="recipes-page">
      <div className="header">
        <Slider {...sliderSettings}>
          {sliderImages.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`Slider Image ${index + 1}`} className="slider-image" />
            </div>
          ))}
        </Slider>
        <h2>Trending now</h2>
        <h1>Mike's famous salad with cheese</h1>
        <p>By John Mike</p>
      </div>

      <div className="navigation-buttons">
        <button className="btn" onClick={() => setFilter("all")}>Filter by</button>
        <button className="btn" onClick={() => setShowForm(true)}>Add a recipe</button>
        <button className="btn" onClick={handleShowCuisines}>Cuisines</button>
      </div>

      {showForm && (
        <div className="add-recipe-form">
          <input
            type="text"
            placeholder="Recipe Name"
            value={newRecipe.name}
            onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Preparation Time"
            value={newRecipe.time}
            onChange={(e) => setNewRecipe({ ...newRecipe, time: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newRecipe.imgSrc}
            onChange={(e) => setNewRecipe({ ...newRecipe, imgSrc: e.target.value })}
          />
          <button className="btn" onClick={handleAddRecipe}>Add Recipe</button>
        </div>
      )}

      {showCuisines && (
        <div className="cuisines-list">
          <ul>
            {cuisinesList.map((cuisine, index) => (
              <li key={index}>{cuisine}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="recipes-list">
        {recipes.map((recipe, index) => (
          <div className="recipe-card" key={index}>
            <img src={recipe.imgSrc} alt={recipe.name} />
            <div className="recipe-info">
              <h3>{recipe.name}</h3>
              <p>{recipe.time}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn load-more-btn" onClick={handleLoadMore}>Load more</button>
    </div>
  );
};

export default RecipesPages;
