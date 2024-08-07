import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout/Layout";
import { useParams } from 'react-router-dom';
  import StarRating from './StarRating'; // Import the custom StarRating component



function Recipe() {
 
  
  
  const Recipe = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [userReviews, setUserReviews] = useState([]);
  
    useEffect(() => {
      const fetchRecipe = async () => {
        try {
          const response = await fetch(`https://api.example.com/recipes/${id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setRecipe(data);
  
          const bookmarked = localStorage.getItem(`bookmark_${id}`);
          setIsBookmarked(!!bookmarked);
  
          const savedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
          setUserReviews(savedReviews);
        } catch (error) {
          console.error('Error fetching recipe:', error);
        }
      };
  
      fetchRecipe();
    }, [id]);
  
    const handleBookmark = () => {
      if (isBookmarked) {
        localStorage.removeItem(`bookmark_${id}`);
      } else {
        localStorage.setItem(`bookmark_${id}`, true);
      }
      setIsBookmarked(!isBookmarked);
    };
  
    const handleShare = () => {
      if (navigator.share) {
        navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: window.location.href,
        }).catch(console.error);
      } else {
        const shareText = `Check out this recipe: ${recipe.title}\n${window.location.href}`;
        prompt('Copy to clipboard: Ctrl+C, Enter', shareText);
      }
    };
  
    const handleRatingChange = (newRating) => {
      setRating(newRating);
    };
  
    const handleReviewChange = (event) => {
      setReview(event.target.value);
    };
  
    const handleSubmitReview = () => {
      const newReview = {
        rating,
        review,
        date: new Date().toLocaleDateString(),
      };
      const updatedReviews = [...userReviews, newReview];
      setUserReviews(updatedReviews);
      localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
      setRating(0);
      setReview('');
    };
  
    if (!recipe) {
      return <div>Loading...</div>;
    }
  
    return (
      <Layout>

      <div>
       
        <h1>{recipe.title}</h1>
        <div>
          <button onClick={handleBookmark}>
            {isBookmarked ? 'Unbookmark' : 'Bookmark'}
          </button>
          <button onClick={handleShare}>
            Share
          </button>
        </div>
        <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: 'auto', marginBottom: '20px' }} />
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h2>Instructions</h2>
        <p>{recipe.instructions}</p>
        <p>Preparation Time: {recipe.prepTime}</p>
        <p>Cooking Time: {recipe.cookTime}</p>
        <h2>Chef’s Notes</h2>
        <p>{recipe.chefNotes}</p>
        <div style={{ marginTop: '40px', padding: '20px', borderTop: '1px solid #ccc' }}>
          <h2>Your Rating</h2>
          <StarRating onRatingChange={handleRatingChange} />
          <h2>Your Review</h2>
          <textarea
            value={review}
            onChange={handleReviewChange}
            placeholder="What did you think about this recipe?"
            rows="4"
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button onClick={handleSubmitReview}>
            Submit Review
          </button>
          <h2>Previous Reviews</h2>
          <ul>
            {userReviews.map((userReview, index) => (
              <li key={index}>
                <div>Rating: {'⭐'.repeat(userReview.rating)}</div>
                <div>{userReview.review}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </Layout>
    );
  };
  
  
  

}

export default Recipe;
