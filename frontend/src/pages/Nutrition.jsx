import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { nutritionAPI } from '../services/api';

function Nutrition() {
  const [userName, setUserName] = useState('');
  const [nutritionAnalysis, setNutritionAnalysis] = useState(null);
  const [nutritionRecords, setNutritionRecords] = useState([]);
  const [period, setPeriod] = useState('week');
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
  }, [navigate]);

  // 获取营养分析和记录
  useEffect(() => {
    if (userName) {
      fetchNutritionData(userName);
    }
  }, [userName, period]);

  const fetchNutritionData = async (name) => {
    setIsLoading(true);
    setError('');

    try {
      // 并行获取营养分析和记录
      const [analysisResponse, recordsResponse] = await Promise.all([
        nutritionAPI.getNutritionAnalysis(name),
        nutritionAPI.getNutritionRecords(name)
      ]);

      if (analysisResponse.data) {
        setNutritionAnalysis(analysisResponse.data);
      } else {
        setNutritionAnalysis(null);
      }

      if (recordsResponse.data) {
        setNutritionRecords(recordsResponse.data);
      } else {
        setNutritionRecords([]);
      }
    } catch (err) {
      setError(err.response?.data?.error || '获取营养数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>营养分析</h1>
        <div style={styles.userInfo}>
          <span style={styles.greeting}>您好，{userName}</span>
        </div>
      </div>

      <div style={styles.content}>
        {error && <div style={styles.error}>{error}</div>}

        {isLoading ? (
          <div style={styles.loading}>加载中...</div>
        ) : (
          <>
            {/* 营养分析卡片 */}
            {nutritionAnalysis && (
              <div style={styles.analysisCard}>
                <h2 style={styles.sectionTitle}>近期营养摄入（过去3天）</h2>
                <div style={styles.analysisGrid}>
                  <div style={styles.analysisItem}>
                    <div style={styles.analysisLabel}>平均卡路里</div>
                    <div style={styles.analysisValue}>{nutritionAnalysis.avgCalories} kcal</div>
                  </div>
                  <div style={styles.analysisItem}>
                    <div style={styles.analysisLabel}>平均蛋白质</div>
                    <div style={styles.analysisValue}>{nutritionAnalysis.avgProtein} g</div>
                  </div>
                  <div style={styles.analysisItem}>
                    <div style={styles.analysisLabel}>平均碳水</div>
                    <div style={styles.analysisValue}>{nutritionAnalysis.avgCarbs} g</div>
                  </div>
                  <div style={styles.analysisItem}>
                    <div style={styles.analysisLabel}>平均脂肪</div>
                    <div style={styles.analysisValue}>{nutritionAnalysis.avgFat} g</div>
                  </div>
                </div>
              </div>
            )}

            {/* 营养记录列表 */}
            <div style={styles.recordsSection}>
              <h2 style={styles.sectionTitle}>营养记录</h2>
              <div style={styles.periodSelector}>
                <button 
                  style={[styles.periodButton, period === 'week' && styles.activePeriodButton]} 
                  onClick={() => setPeriod('week')}
                >
                  本周
                </button>
                <button 
                  style={[styles.periodButton, period === 'month' && styles.activePeriodButton]} 
                  onClick={() => setPeriod('month')}
                >
                  本月
                </button>
              </div>

              {nutritionRecords.length > 0 ? (
                <div style={styles.recordsTable}>
                  <div style={styles.tableHeader}>
                    <span style={styles.headerCell}>食物名称</span>
                    <span style={styles.headerCell}>卡路里</span>
                    <span style={styles.headerCell}>蛋白质</span>
                    <span style={styles.headerCell}>碳水</span>
                    <span style={styles.headerCell}>脂肪</span>
                    <span style={styles.headerCell}>时间</span>
                  </div>
                  {nutritionRecords.map((record) => (
                    <div key={record.id} style={styles.tableRow}>
                      <span style={styles.tableCell}>{record.food_name}</span>
                      <span style={styles.tableCell}>{record.calories} kcal</span>
                      <span style={styles.tableCell}>{record.protein} g</span>
                      <span style={styles.tableCell}>{record.carbs} g</span>
                      <span style={styles.tableCell}>{record.fat} g</span>
                      <span style={styles.tableCell}>{new Date(record.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.empty}>暂无营养记录</div>
              )}
            </div>
          </>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  greeting: {
    fontSize: '16px'
  },
  content: {
    flex: 1,
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
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
    color: '#666'
  },
  analysisCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 20px 0'
  },
  analysisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  analysisItem: {
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  analysisLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  analysisValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  recordsSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px'
  },
  periodSelector: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  periodButton: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s'
  },
  activePeriodButton: {
    backgroundColor: '#4CAF50',
    color: 'white'
  },
  recordsTable: {
    overflowX: 'auto'
  },
  tableHeader: {
    display: 'flex',
    backgroundColor: '#f5f5f5',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '10px'
  },
  tableRow: {
    display: 'flex',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    marginBottom: '8px',
    fontSize: '14px'
  },
  headerCell: {
    flex: 1,
    color: '#333'
  },
  tableCell: {
    flex: 1,
    color: '#555'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
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

export default Nutrition;
