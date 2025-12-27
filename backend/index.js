const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/utils/database');

// 加载环境变量
dotenv.config();

// 初始化数据库
db.init();

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
const userRoutes = require('./src/routes/user.routes');
const nutritionRoutes = require('./src/routes/nutrition.routes');
const recommendRoutes = require('./src/routes/recommend.routes');

app.use('/api/users', userRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/recommendations', recommendRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '来食 API 服务正常运行中' });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
