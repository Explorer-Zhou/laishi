const llmService = require('../services/llm.service');
const nutritionService = require('../services/nutrition.service');
const amapService = require('../services/amap.service');
const db = require('../utils/database');

class RecommendController {
  // 获取食物推荐
  async getFoodRecommendation(req, res) {
    try {
      const { userName } = req.params;
      
      // 获取用户偏好设置
      const user = await db.get(
        `SELECT preferences FROM users WHERE name = ?`,
        [userName]
      );
      
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      
      // 获取近期营养分析
      const recentNutrition = await nutritionService.getRecentNutritionAnalysis(userName);
      
      // 调用LLM获取食物推荐
      const recommendations = await llmService.getFoodRecommendation(
        user.preferences,
        recentNutrition
      );
      
      // 保存推荐结果到数据库
      for (const rec of recommendations.recommendations) {
        await db.run(
          `INSERT INTO food_recommendations (user_name, recommended_food, nutrition_info) 
           VALUES (?, ?, ?)`,
          [userName, rec.name, JSON.stringify(rec.nutrition)]
        );
      }
      
      res.status(200).json(recommendations);
    } catch (error) {
      console.error('获取食物推荐错误:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // 获取附近提供推荐食物的店铺
  async getNearbyShops(req, res) {
    try {
      const { foodName, location } = req.query;
      
      // 验证必填参数
      if (!foodName || !location) {
        return res.status(400).json({ error: '缺少必要的查询参数' });
      }
      
      // 调用高德地图服务查询附近店铺
      const shops = await amapService.searchNearbyFoodShops(foodName, location);
      
      res.status(200).json(shops);
    } catch (error) {
      console.error('获取附近店铺错误:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // 获取用户历史推荐记录
  async getRecommendationHistory(req, res) {
    try {
      const { userName } = req.params;
      
      const history = await db.all(
        `SELECT id, recommended_food, nutrition_info, timestamp 
         FROM food_recommendations 
         WHERE user_name = ? 
         ORDER BY timestamp DESC 
         LIMIT 10`,
        [userName]
      );
      
      // 解析营养信息JSON
      const formattedHistory = history.map(item => ({
        ...item,
        nutrition_info: JSON.parse(item.nutrition_info)
      }));
      
      res.status(200).json(formattedHistory);
    } catch (error) {
      console.error('获取推荐历史错误:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RecommendController();
