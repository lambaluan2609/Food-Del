import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!query) return;

        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`${API_URL}/api/food/search?name=${query}`);
                const data = await response.json();

                if (data.success) {
                    setRecipes(data.data);
                } else {
                    setRecipes([]);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setError("Lỗi tải kết quả tìm kiếm");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) return <div className="loading">Đang tải kết quả...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="search-results-container">
            <h2>{`Kết quả tìm kiếm cho "${query}"`}</h2>  {/* Fix vấn đề dấu ngoặc kép */}
            <div className="results-grid">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div key={recipe._id} className="recipe-card" onClick={() => navigate(`/detail/${recipe._id}`)}>
                            <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                            <h3>{recipe.name}</h3>
                        </div>
                    ))
                ) : (
                    <p>Không tìm thấy công thức nào</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
