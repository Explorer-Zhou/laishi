const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

class LLMService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    });
  }

  // 根据用户偏好和营养数据获取食物推荐
  async getFoodRecommendation(userPreferences, recentNutrition) {
    try {
      // 构建提示词
      const prompt = this._buildPrompt(userPreferences, recentNutrition);

      // 调用OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的营养师和美食推荐专家，根据用户的口味偏好和近期营养摄入情况，推荐健康美味的食物。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      // 解析结果
      const result = completion.choices[0].message.content;
      return this._parseRecommendation(result);
    } catch (error) {
      console.error('LLM推荐服务错误:', error);
      throw new Error('获取食物推荐失败');
    }
  }

  // 构建提示词
  _buildPrompt(preferences, recentNutrition) {
    const prefObj = JSON.parse(preferences || '{}');
    
    let prompt = `请根据以下用户信息推荐下一餐食物：\n\n`;
    
    if (prefObj.taste) {
      prompt += `口味偏好：${prefObj.taste}\n`;
    }
    
    if (prefObj.dietaryRestrictions) {
      prompt += `饮食限制：${prefObj.dietaryRestrictions}\n`;
    }
    
    if (prefObj.cuisinePreferences) {
      prompt += `菜系偏好：${prefObj.cuisinePreferences}\n`;
    }
    
    if (prefObj.budget) {
      prompt += `预算范围：${prefObj.budget}\n`;
    }
    
    if (recentNutrition) {
      prompt += `\n近期营养摄入（过去3天）：\n`;
      prompt += `平均卡路里：${recentNutrition.avgCalories}kcal\n`;
      prompt += `平均蛋白质：${recentNutrition.avgProtein}g\n`;
      prompt += `平均碳水：${recentNutrition.avgCarbs}g\n`;
      prompt += `平均脂肪：${recentNutrition.avgFat}g\n`;
    }
    
    prompt += `\n请推荐1-3种适合的食物，每种食物包含：\n`;
    prompt += `1. 食物名称\n`;
    prompt += `2. 简要描述\n`;
    prompt += `3. 营养成分（卡路里、蛋白质、碳水、脂肪）\n`;
    prompt += `4. 推荐理由\n\n`;
    prompt += `请以JSON格式返回，示例：\n`;
    prompt += `{"recommendations": [{"name": "食物名", "description": "描述", "nutrition": {"calories": 100, "protein": 10, "carbs": 20, "fat": 5}, "reason": "理由"}]}`;
    
    return prompt;
  }

  // 解析LLM返回的推荐结果
  _parseRecommendation(text) {
    try {
      // 提取JSON部分
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法解析推荐结果');
      }
      
      const recommendations = JSON.parse(jsonMatch[0]);
      return recommendations;
    } catch (error) {
      console.error('解析LLM结果错误:', error);
      throw new Error('解析推荐结果失败');
    }
  }
}

module.exports = new LLMService();
