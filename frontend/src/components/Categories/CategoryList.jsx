import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import CategoryForm from './CategoryForm';
import './Categories.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    loadCategories();
  };

  if (loading) return <div className="loading">Loading categories...</div>;

  return (
    <div className="category-list-container">
      <h2>Expense Categories</h2>
      
      <CategoryForm onSuccess={handleSuccess} />

      {error && <div className="error-message">{error}</div>}

      <div className="category-grid">
        {categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories yet. Add your first category!</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category._id} className="category-card">
              <span className="category-icon">📁</span>
              <span className="category-name">{category.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryList;