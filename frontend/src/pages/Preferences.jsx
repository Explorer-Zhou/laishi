import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

function Preferences() {
  const [userName, setUserName] = useState('');
  const [preferences, setPreferences] = useState({
    taste: '',
    dietaryRestrictions: '',
    cuisinePreferences: '',
    budget: ''
  });
  const [isLoading, setIsLoading] = useState(false);
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
    // 获取用户已有的偏好设置
    fetchPreferences(storedName);
  }, [navigate]);

  const fetchPreferences = async (name) => {
    try {
      const response = await userAPI.getPreferences(name);
      if (response.data) {
        setPreferences(response.data);
      }
    } catch (err) {
      console.error('获取偏好设置失败:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await userAPI.updatePreferences(userName, preferences);
      // 跳转到首页
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || '更新偏好设置失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>偏好设置</h1>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <p style={styles.subtitle}>请设置您的饮食偏好，以便我们为您提供更精准的推荐</p>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="taste" style={styles.label}>口味偏好</label>
              <input
                type="text"
                id="taste"
                name="taste"
                value={preferences.taste}
                onChange={handleChange}
                placeholder="例如：微辣、酸甜、清淡"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="dietaryRestrictions" style={styles.label}>饮食限制</label>
              <input
                type="text"
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={preferences.dietaryRestrictions}
                onChange={handleChange}
                placeholder="例如：素食、无麸质、坚果过敏"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="cuisinePreferences" style={styles.label}>菜系偏好</label>
              <input
                type="text"
                id="cuisinePreferences"
                name="cuisinePreferences"
                value={preferences.cuisinePreferences}
                onChange={handleChange}
                placeholder="例如：川菜、粤菜、西餐"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="budget" style={styles.label}>预算范围</label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={preferences.budget}
                onChange={handleChange}
                placeholder="例如：10-20元、30-50元"
                style={styles.input}
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button 
              type="submit" 
              style={styles.button} 
              disabled={isLoading}
            >
              {isLoading ? '保存中...' : '保存偏好'}
            </button>
          </form>
        </div>
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
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '20px 0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    maxWidth: '1200px',
    width: '100%',
    padding: '0 20px',
    margin: '0 auto'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 20px 0',
    letterSpacing: '-0.5px'
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 20px 80px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '36px',
    width: '100%',
    maxWidth: '550px',
    border: '1px solid #e9ecef'
  },
  subtitle: {
    fontSize: '15px',
    color: '#6c757d',
    marginBottom: '32px',
    lineHeight: '1.5'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  input: {
    padding: '14px',
    fontSize: '16px',
    border: '1px solid #dee2e6',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  error: {
    color: '#c53030',
    fontSize: '14px',
    marginTop: '-8px',
    fontWeight: '500'
  },
  button: {
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '12px',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
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
    padding: '10px 16px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  }
};

export default Preferences;
