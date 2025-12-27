const express = require('express');
const recommendController = require('../controllers/recommend.controller');

const router = express.Router();

// 推荐相关路由
router.get('/food/:userName', recommendController.getFoodRecommendation); // 获取食物推荐
router.get('/nearby', recommendController.getNearbyShops); // 获取附近店铺
router.get('/history/:userName', recommendController.getRecommendationHistory); // 获取推荐历史

module.exports = router;
