import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// 导入页面组件
import UserSetup from './pages/UserSetup';
import Preferences from './pages/Preferences';
import Home from './pages/Home';
import Nutrition from './pages/Nutrition';
import FoodRecommend from './pages/FoodRecommend';
import ApiSettings from './pages/ApiSettings';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* 初始页面：用户设置 */}
          <Route path="/" element={<UserSetup />} />
          {/* 偏好设置页面 */}
          <Route path="/preferences" element={<Preferences />} />
          {/* 首页：食物推荐 */}
          <Route path="/home" element={<Home />} />
          {/* 营养分析页面 */}
          <Route path="/nutrition" element={<Nutrition />} />
          {/* 食品推荐页：附近店铺 */}
          <Route path="/food-recommend" element={<FoodRecommend />} />
          {/* API设置页面 */}
          <Route path="/api-settings" element={<ApiSettings />} />
          {/* 兜底路由，重定向到首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
