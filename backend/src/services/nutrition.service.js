const db = require('../utils/database');

class NutritionService {
  // 记录营养摄入
  async recordNutrition(userName, foodName, calories, protein, carbs, fat) {
    try {
      const result = await db.run(
        `INSERT INTO nutrition_records (user_name, food_name, calories, protein, carbs, fat) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userName, foodName, calories, protein, carbs, fat]
      );
      return result;
    } catch (error) {
      console.error('记录营养摄入错误:', error);
      throw new Error('记录营养摄入失败');
    }
  }

  // 获取近期营养摄入分析（过去3天）
  async getRecentNutritionAnalysis(userName) {
    try {
      const records = await db.all(
        `SELECT calories, protein, carbs, fat 
         FROM nutrition_records 
         WHERE user_name = ? 
         AND timestamp >= datetime('now', '-3 days')`,
        [userName]
      );

      if (records.length === 0) {
        return null;
      }

      // 计算平均值
      const total = records.reduce(
        (acc, record) => {
          acc.calories += record.calories;
          acc.protein += record.protein;
          acc.carbs += record.carbs;
          acc.fat += record.fat;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      return {
        avgCalories: Math.round(total.calories / records.length),
        avgProtein: parseFloat((total.protein / records.length).toFixed(1)),
        avgCarbs: parseFloat((total.carbs / records.length).toFixed(1)),
        avgFat: parseFloat((total.fat / records.length).toFixed(1)),
        totalRecords: records.length
      };
    } catch (error) {
      console.error('获取营养分析错误:', error);
      throw new Error('获取营养分析失败');
    }
  }

  // 获取用户所有营养记录
  async getAllNutritionRecords(userName) {
    try {
      const records = await db.all(
        `SELECT * FROM nutrition_records 
         WHERE user_name = ? 
         ORDER BY timestamp DESC`,
        [userName]
      );
      return records;
    } catch (error) {
      console.error('获取营养记录错误:', error);
      throw new Error('获取营养记录失败');
    }
  }

  // 获取用户营养摄入统计（按周/月）
  async getNutritionStats(userName, period = 'week') {
    try {
      let timeRange;
      switch (period) {
        case 'week':
          timeRange = '7 days';
          break;
        case 'month':
          timeRange = '30 days';
          break;
        default:
          timeRange = '7 days';
      }

      const records = await db.all(
        `SELECT date(timestamp) as date, 
               SUM(calories) as totalCalories, 
               SUM(protein) as totalProtein, 
               SUM(carbs) as totalCarbs, 
               SUM(fat) as totalFat 
         FROM nutrition_records 
         WHERE user_name = ? 
         AND timestamp >= datetime('now', '-' || ?) 
         GROUP BY date(timestamp) 
         ORDER BY date(timestamp)`,
        [userName, timeRange]
      );

      return records;
    } catch (error) {
      console.error('获取营养统计错误:', error);
      throw new Error('获取营养统计失败');
    }
  }
}

module.exports = new NutritionService();
