import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // ✅ Quản lý trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // ✅ Lưu tổng số trang
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;
    const limit = 10; // Số món ăn mỗi trang

    useEffect(() => {
        if (!query) return;

        const fetchSearchResults = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_URL}/api/food/search?name=${query}&page=${page}&limit=${limit}`);
                const data = await response.json();

                if (data.success) {
                    setRecipes(data.data);
                    setTotalPages(data.totalPages); // ✅ Cập nhật tổng số trang
                } else {
                    setRecipes([]);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setError("Lỗi tải kết quả tìm kiếm");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, page]); // ✅ Fetch lại khi query hoặc page thay đổi

    if (loading) return <div className="loading">Đang tải kết quả...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="search-results-container">
            <h2>{`Kết quả tìm kiếm cho "${query}"`}</h2>

            {recipes.length > 0 ? (
                <>
                    <p>{`Tìm thấy ${recipes.length} món ăn`}</p>

                    <div className="results-grid">
                        {recipes.map((recipe) => (
                            <div
                                key={recipe._id}
                                className="recipe-card"
                                onClick={() => navigate(`/detail/${recipe._id}`)}
                            >
                                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                                <h3>{recipe.name}</h3>
                                <p>{recipe.description || "Không có mô tả"}</p> {/* ✅ Hiển thị mô tả */}
                            </div>
                        ))}
                    </div>

                    {/* ✅ Phân trang */}
                    <div className="pagination">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Trang trước</button>
                        <span>Trang {page} / {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Trang sau</button>
                    </div>
                </>
            ) : (
                <p>Không tìm thấy công thức nào</p>
            )}
        </div>
    );
};

export default SearchResults;
