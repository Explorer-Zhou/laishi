import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { recommendAPI } from '../services/api';

function FoodRecommend() {
  const [searchParams] = useSearchParams();
  const [foodName, setFoodName] = useState('');
  const [location, setLocation] = useState('');
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 从URL参数获取食物名称和位置
  useEffect(() => {
    const paramsFoodName = searchParams.get('foodName');
    const paramsLocation = searchParams.get('location');
    
    if (!paramsFoodName || !paramsLocation) {
      // 如果缺少参数，跳转到首页
      navigate('/home');
      return;
    }
    
    setFoodName(paramsFoodName);
    setLocation(paramsLocation);
    fetchNearbyShops(paramsFoodName, paramsLocation);
  }, [searchParams, navigate]);

  const fetchNearbyShops = async (name, loc) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await recommendAPI.getNearbyShops(name, loc);
      if (response.data) {
        setShops(response.data);
      } else {
        setShops([]);
      }
    } catch (err) {
      setError(err.response?.data?.error || '获取附近店铺失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <button 
            style={styles.backButton} 
            onClick={() => navigate('/home')}
          >
            ← 返回
          </button>
          <h1 style={styles.title}>食品推荐</h1>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.foodInfoCard}>
          <h2 style={styles.foodName}>{foodName}</h2>
          <p style={styles.foodDescription}>附近提供该食物的店铺</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {isLoading ? (
          <div style={styles.loading}>加载中...</div>
        ) : shops.length > 0 ? (
          <div style={styles.shopsList}>
            {shops.map((shop) => (
              <div key={shop.id} style={styles.shopCard}>
                <div style={styles.shopHeader}>
                  <h3 style={styles.shopTitle}>{shop.name}</h3>
                  <div style={styles.shopRating}>{shop.rating}</div>
                </div>
                
                <div style={styles.shopInfo}>
                  <p style={styles.shopAddress}>{shop.address}</p>
                  <p style={styles.shopDistance}>{shop.distance}米</p>
                  {shop.phone && <p style={styles.shopPhone}>{shop.phone}</p>}
                  {shop.businessArea && <p style={styles.shopArea}>{shop.businessArea}</p>}
                </div>
                
                <div style={styles.shopType}>{shop.type}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.empty}>暂无附近店铺信息</div>
        )}
      </div>

      <div style={styles.navBar}>
        <button style={styles.navButton} onClick={() => navigate('/home')}>
          首页
        </button>
        <button style={styles.navButton} onClick={() => navigate('/preferences')}>
          偏好设置
        </button>
        <button style={styles.navButton} onClick={() => navigate('/nutrition')}>
          营养分析
        </button>
        <button style={styles.navButton} onClick={() => navigate('/api-settings')}>
          API设置
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '20px',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  backButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0
  },
  content: {
    flex: 1,
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  foodInfoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px'
  },
  foodName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0'
  },
  foodDescription: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  shopsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  shopCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px'
  },
  shopHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  shopTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  shopRating: {
    backgroundColor: '#FFD700',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  shopInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '15px'
  },
  shopAddress: {
    fontSize: '14px',
    color: '#555',
    margin: 0
  },
  shopDistance: {
    fontSize: '13px',
    color: '#4CAF50',
    fontWeight: 'bold',
    margin: 0
  },
  shopPhone: {
    fontSize: '13px',
    color: '#2196F3',
    margin: 0
  },
  shopArea: {
    fontSize: '13px',
    color: '#999',
    margin: 0
  },
  shopType: {
    fontSize: '12px',
    color: '#999',
    backgroundColor: '#f5f5f5',
    padding: '4px 8px',
    borderRadius: '4px',
    alignSelf: 'flex-start'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  navBar: {
    backgroundColor: 'white',
    borderTop: '1px solid #ddd',
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'space-around',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0
  },
  navButton: {
    padding: '10px 20px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  }
};

export default FoodRecommend;
