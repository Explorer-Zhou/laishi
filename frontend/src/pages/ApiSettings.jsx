import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ApiSettings() {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [amapApiKey, setAmapApiKey] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // 从localStorage获取已保存的API密钥
  useEffect(() => {
    const savedOpenaiKey = localStorage.getItem('openaiApiKey');
    const savedAmapKey = localStorage.getItem('amapApiKey');
    
    if (savedOpenaiKey) {
      setOpenaiApiKey(savedOpenaiKey);
    }
    
    if (savedAmapKey) {
      setAmapApiKey(savedAmapKey);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    
    // 保存API密钥到localStorage
    localStorage.setItem('openaiApiKey', openaiApiKey);
    localStorage.setItem('amapApiKey', amapApiKey);
    
    setSuccessMessage('API设置已保存');
    
    // 3秒后清除成功信息
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
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
          <h1 style={styles.title}>API设置</h1>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.subtitle}>请配置API密钥以获取完整功能</h2>
          
          <form onSubmit={handleSave} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="openaiApiKey" style={styles.label}>OpenAI API Key</label>
              <input
                type="password"
                id="openaiApiKey"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                style={styles.input}
              />
              <p style={styles.description}>用于智能食物推荐</p>
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="amapApiKey" style={styles.label}>高德地图API Key</label>
              <input
                type="password"
                id="amapApiKey"
                value={amapApiKey}
                onChange={(e) => setAmapApiKey(e.target.value)}
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                style={styles.input}
              />
              <p style={styles.description}>用于附近店铺搜索</p>
            </div>

            {successMessage && (
              <div style={styles.successMessage}>{successMessage}</div>
            )}

            <button 
              type="submit" 
              style={styles.button}
            >
              保存设置
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
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '30px'
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 24px 0',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  description: {
    fontSize: '13px',
    color: '#666',
    margin: '4px 0 0 0'
  },
  successMessage: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center'
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: '500',
    color: 'white',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '8px'
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
    fontWeight: '500',
    transition: 'all 0.3s'
  }
};

export default ApiSettings;