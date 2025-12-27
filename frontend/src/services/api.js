import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 用户相关API
export const userAPI = {
  // 创建用户
  createUser: (name) => api.post('/users', { name }),
  
  // 获取用户信息
  getUser: (name) => api.get(`/users/${name}`),
  
  // 获取用户偏好设置
  getPreferences: (name) => api.get(`/users/${name}/preferences`),
  
  // 更新用户偏好设置
  updatePreferences: (name, preferences) => api.put(`/users/${name}/preferences`, preferences)
};

// 营养相关API
export const nutritionAPI = {
  // 记录营养摄入
  recordNutrition: (data) => api.post('/nutrition/record', data),
  
  // 获取营养分析
  getNutritionAnalysis: (userName) => api.get(`/nutrition/analysis/${userName}`),
  
  // 获取营养记录
  getNutritionRecords: (userName) => api.get(`/nutrition/records/${userName}`),
  
  // 获取营养统计
  getNutritionStats: (userName, period) => api.get(`/nutrition/stats/${userName}`, { params: { period } })
};

// 推荐相关API
export const recommendAPI = {
  // 获取食物推荐
  getFoodRecommendation: (userName) => api.get(`/recommendations/food/${userName}`),
  
  // 获取附近店铺
  getNearbyShops: (foodName, location) => api.get('/recommendations/nearby', { 
    params: { foodName, location } 
  }),
  
  // 获取推荐历史
  getRecommendationHistory: (userName) => api.get(`/recommendations/history/${userName}`)
};
