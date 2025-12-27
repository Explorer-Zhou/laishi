import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendAPI } from '../services/api';

function Home() {
  const [userName, setUserName] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 从localStorage获取用户名
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (!storedName) {
      navigate('/');
      return;
    }
    setUserName(storedName);
    fetchRecommendations(storedName);
  }, [navigate]);

  const fetchRecommendations = async (name) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await recommendAPI.getFoodRecommendation(name);
      if (response.data && response.data.recommendations) {
        setRecommendations(response.data.recommendations);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      setError(err.response?.data?.error || '获取食物推荐失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetNearbyShops = (foodName) => {
    // 这里可以获取用户位置，然后跳转到食品推荐页
    // 暂时使用默认位置（北京）
    const defaultLocation = '116.4074,39.9042';
    navigate(`/food-recommend?foodName=${encodeURIComponent(foodName)}&location=${defaultLocation}`);
  };

  const handleRefresh = () => {
    fetchRecommendations(userName);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>来食</h1>
          <div style={styles.userInfo}>
            <span style={styles.greeting}>您好，{userName}</span>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>今日推荐</h2>
            <button 
              style={styles.refreshButton} 
              onClick={handleRefresh} 
              disabled={isLoading}
            >
              {isLoading ? '刷新中...' : '刷新推荐'}
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {isLoading ? (
            <div style={styles.loading}>加载中...</div>
          ) : recommendations.length > 0 ? (
            <div style={styles.recommendationGrid}>
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.card,
                    // 鼠标悬停效果
                    ':hover': styles.cardHover
                  }}
                >
                  <h3 style={styles.foodName}>{rec.name}</h3>
                  <p style={styles.description}>{rec.description}</p>
                  
                  <div style={styles.nutrition}>
                    <h4 style={styles.nutritionTitle}>营养成分</h4>
                    <div style={styles.nutritionDetails}>
                      <span>卡路里: {rec.nutrition.calories}kcal</span>
                      <span>蛋白质: {rec.nutrition.protein}g</span>
                      <span>碳水: {rec.nutrition.carbs}g</span>
                      <span>脂肪: {rec.nutrition.fat}g</span>
                    </div>
                  </div>
                  
                  <div style={styles.reason}>
                    <h4 style={styles.reasonTitle}>推荐理由</h4>
                    <p>{rec.reason}</p>
                  </div>
                  
                  <button 
                    style={styles.shopButton} 
                    onClick={() => handleGetNearbyShops(rec.name)}
                  >
                    查看附近提供该食物的店铺
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.empty}>暂无推荐，请稍后刷新</div>
          )}
        </div>
      </div>

      <div style={styles.navBar}>
        <button 
          style={{
            ...styles.navButton,
            ...(window.location.pathname === '/home' && styles.activeNavButton)
          }} 
          onClick={() => navigate('/home')}
        >
          首页
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(window.location.pathname === '/preferences' && styles.activeNavButton)
          }} 
          onClick={() => navigate('/preferences')}
        >
          偏好设置
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(window.location.pathname === '/nutrition' && styles.activeNavButton)
          }} 
          onClick={() => navigate('/nutrition')}
        >
          营养分析
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(window.location.pathname === '/api-settings' && styles.activeNavButton)
          }} 
          onClick={() => navigate('/api-settings')}
        >
          API设置
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    maxWidth: '1200px',
    width: '100%',
    padding: '0 20px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '8px 16px',
    borderRadius: '20px'
  },
  greeting: {
    fontSize: '16px',
    fontWeight: '500'
  },
  content: {
    flex: 1,
    padding: '30px 20px 80px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  section: {
    marginBottom: '36px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e9ecef'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
    letterSpacing: '-0.3px'
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.2)'
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: '#6c757d',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  error: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(201, 48, 48, 0.1)'
  },
  recommendationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
    gridAutoRows: 'minmax(300px, auto)'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '24px',
    transition: 'all 0.3s ease',
    border: '1px solid #e9ecef'
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
  },
  foodName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 12px 0',
    letterSpacing: '-0.3px'
  },
  description: {
    fontSize: '14px',
    color: '#6c757d',
    margin: '0 0 20px 0',
    lineHeight: '1.5'
  },
  nutrition: {
    margin: '20px 0',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    borderLeft: '4px solid #4CAF50'
  },
  nutritionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 12px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  nutritionDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    fontSize: '13px',
    color: '#555'
  },
  reason: {
    margin: '20px 0',
    padding: '16px',
    backgroundColor: '#e8f5e8',
    borderRadius: '10px',
    borderLeft: '4px solid #2e7d32'
  },
  reasonTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2e7d32',
    margin: '0 0 8px 0'
  },
  shopButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    marginTop: '20px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: '#6c757d',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '2px dashed #dee2e6'
  },
  navBar: {
    backgroundColor: 'white',
    borderTop: '1px solid #e9ecef',
    padding: '12px 0',
    display: 'flex',
    justifyContent: 'space-around',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
  },
  navButton: {
    padding: '12px 20px',
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    minWidth: '80px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  activeNavButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
  }
};

export default Home;