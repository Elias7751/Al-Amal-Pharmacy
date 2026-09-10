import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';
import api from '../utils/api';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    // Fetch Categories
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch Products with params
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (currentCategory) query.append('category', currentCategory);
        if (currentSearch) query.append('search', currentSearch);
        query.append('page', currentPage);
        query.append('limit', 8);

        const { data } = await api.get(`/products?${query.toString()}`);
        if (data.success) {
          setProducts(data.products);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, currentSearch, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.set('page', 1);
    navigate(`/shop?${params.toString()}`);
  };

  const handleCategorySelect = (categoryId) => {
    const params = new URLSearchParams(location.search);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    params.set('page', 1);
    navigate(`/shop?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>المتجر</h1>
        <p style={styles.subtitle}>تصفح أحدث الأدوية والمستلزمات الطبية</p>
      </div>

      <div style={styles.layout}>
        {/* Sidebar / Filters */}
        <aside style={styles.sidebar}>
          <div className="card" style={styles.filterCard}>
            <h3 style={styles.filterTitle}>
              <FaSearch /> بحث
            </h3>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="ابحث عن منتج..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                <FaSearch />
              </button>
            </form>
          </div>

          <div className="card" style={styles.filterCard}>
            <h3 style={styles.filterTitle}>
              <FaFilter /> الأقسام
            </h3>
            <ul style={styles.categoryList}>
              <li>
                <button 
                  style={{ ...styles.categoryBtn, fontWeight: currentCategory === '' ? 'bold' : 'normal', color: currentCategory === '' ? 'var(--primary)' : 'inherit' }}
                  onClick={() => handleCategorySelect('')}
                >
                  الكل
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    style={{ ...styles.categoryBtn, fontWeight: parseInt(currentCategory) === cat.id ? 'bold' : 'normal', color: parseInt(currentCategory) === cat.id ? 'var(--primary)' : 'inherit' }}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {cat.name_ar}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main style={styles.mainContent}>
          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
               <div className="spinner"></div>
             </div>
          ) : products.length === 0 ? (
            <div style={styles.emptyState}>
              <h2>لا توجد منتجات مطابقة لبحثك</h2>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3">
                {products.map((product) => (
                  <div key={product.id} className="card" style={styles.productCard}>
                    <div style={styles.imageContainer}>
                      <img 
                        src={product.image ? `http://localhost:5000${product.image}` : 'https://placehold.co/400x400/E5E7EB/A1A1AA?text=No+Image'} 
                        alt={product.name_ar} 
                        style={styles.productImage} 
                      />
                      {product.stock <= 5 && product.stock > 0 && (
                        <span style={styles.badgeWarning}>باقي {product.stock} فقط</span>
                      )}
                      {product.stock === 0 && (
                        <span style={styles.badgeDanger}>نفذت الكمية</span>
                      )}
                    </div>
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>{product.name_ar}</h3>
                      <p style={styles.productPrice}>{product.price} ريال</p>
                      <Link to={`/product/${product.id}`} className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
                        التفاصيل
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <button 
                    className="btn btn-outline" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    السابق
                  </button>
                  <span style={styles.pageInfo}>صفحة {currentPage} من {totalPages}</span>
                  <button 
                    className="btn btn-outline" 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: 'var(--primary-light)',
    padding: '3rem 2rem',
    borderRadius: 'var(--radius-xl)',
    marginBottom: '3rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--primary-dark)',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1.125rem'
  },
  layout: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start'
  },
  sidebar: {
    width: '280px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  mainContent: {
    flex: 1
  },
  filterCard: {
    padding: '1.5rem'
  },
  filterTitle: {
    fontSize: '1.125rem',
    fontWeight: '700',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-main)'
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  categoryBtn: {
    width: '100%',
    textAlign: 'right',
    padding: '0.5rem',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 0.2s',
    fontSize: '1rem'
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  imageContainer: {
    position: 'relative',
    paddingTop: '100%',
    backgroundColor: '#F3F4F6'
  },
  productImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  badgeWarning: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'var(--warning)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-xl)',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  badgeDanger: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'var(--danger)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-xl)',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  productInfo: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  productName: {
    fontSize: '1.125rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: 'var(--text-main)'
  },
  productPrice: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--primary)',
    marginTop: 'auto'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    backgroundColor: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px dashed var(--border)',
    color: 'var(--text-muted)'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '3rem'
  },
  pageInfo: {
    fontWeight: '600'
  }
};
