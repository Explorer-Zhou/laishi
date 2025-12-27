const nutritionService = require('../services/nutrition.service');

class NutritionController {
  // 记录营养摄入
  async recordNutrition(req, res) {
    try {
      const { userName, foodName, calories, protein, carbs, fat } = req.body;
      
      // 验证必填字段
      if (!userName || !foodName || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
        return res.status(400).json({ error: '缺少必要的营养数据' });
      }
      
      const result = await nutritionService.recordNutrition(
        userName, foodName, calories, protein, carbs, fat
      );
      
      res.status(201).json({ 
        id: result.id, 
        message: '营养摄入记录成功' 
      });
    } catch (error) {
      console.error('记录营养摄入错误:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // 获取营养分析
  async getNutritionAnalysis(req, res) {
    try {
      const { userName } = req.params;
      
      const analysis = await nutritionService.getRecentNutritionAnalysis(userName);
      
      res.status(200).json(analysis);
    } catch (error) {
      console.error('获取营养分析错误:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // 获取营养记录列表
  async getNutritionRecords(req, res) {
    try {
      const { userName } = req.params;
      
      const records = await nutritionService.getAllNutritionRecords(userName);
      
      res.status(200).json(records);
    } catch (error) {
      console.error('获取营养记录错误:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // 获取营养统计数据
  async getNutritionStats(req, res) {
    try {
      const { userName } = req.params;
      const { period } = req.query;
      
      const stats = await nutritionService.getNutritionStats(userName, period);
      
      res.status(200).json(stats);
    } catch (error) {
      console.error('获取营养统计错误:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new NutritionController();
