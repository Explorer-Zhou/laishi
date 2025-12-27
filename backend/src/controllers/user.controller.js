const db = require('../utils/database');

class UserController {
  // 创建用户
  async createUser(req, res) {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: '用户名不能为空' });
      }
      
      const result = await db.run(
        `INSERT INTO users (name) VALUES (?)`,
        [name]
      );
      
      res.status(201).json({ id: result.id, name });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ error: '用户名已存在' });
      }
      console.error('创建用户错误:', error);
      res.status(500).json({ error: '创建用户失败' });
    }
  }

  // 获取用户信息
  async getUser(req, res) {
    try {
      const { name } = req.params;
      
      const user = await db.get(
        `SELECT id, name, preferences, created_at FROM users WHERE name = ?`,
        [name]
      );
      
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      
      // 解析偏好设置JSON
      user.preferences = JSON.parse(user.preferences);
      
      res.status(200).json(user);
    } catch (error) {
      console.error('获取用户信息错误:', error);
      res.status(500).json({ error: '获取用户信息失败' });
    }
  }

  // 更新用户偏好设置
  async updatePreferences(req, res) {
    try {
      const { name } = req.params;
      const preferences = req.body;
      
      // 检查用户是否存在
      const existingUser = await db.get(
        `SELECT id FROM users WHERE name = ?`,
        [name]
      );
      
      if (!existingUser) {
        return res.status(404).json({ error: '用户不存在' });
      }
      
      await db.run(
        `UPDATE users SET preferences = ?, updated_at = datetime('now') WHERE name = ?`,
        [JSON.stringify(preferences), name]
      );
      
      res.status(200).json({ message: '偏好设置更新成功' });
    } catch (error) {
      console.error('更新偏好设置错误:', error);
      res.status(500).json({ error: '更新偏好设置失败' });
    }
  }

  // 获取用户偏好设置
  async getPreferences(req, res) {
    try {
      const { name } = req.params;
      
      const user = await db.get(
        `SELECT preferences FROM users WHERE name = ?`,
        [name]
      );
      
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      
      res.status(200).json(JSON.parse(user.preferences || '{}'));
    } catch (error) {
      console.error('获取偏好设置错误:', error);
      res.status(500).json({ error: '获取偏好设置失败' });
    }
  }
}

module.exports = new UserController();
