const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

class Database {
  constructor() {
    this.db = new sqlite3.Database(process.env.DB_PATH, (err) => {
      if (err) {
        console.error('数据库连接错误:', err.message);
      } else {
        console.log('成功连接到SQLite数据库');
      }
    });
  }

  // 初始化数据库表
  init() {
    // 创建用户表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        preferences TEXT DEFAULT '{}',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建营养记录表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS nutrition_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT NOT NULL,
        food_name TEXT NOT NULL,
        calories INTEGER NOT NULL,
        protein REAL NOT NULL,
        carbs REAL NOT NULL,
        fat REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_name) REFERENCES users (name)
      )
    `);

    // 创建食物推荐表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS food_recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT NOT NULL,
        recommended_food TEXT NOT NULL,
        nutrition_info TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_name) REFERENCES users (name)
      )
    `);
  }

  // 执行SQL查询
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  // 查询单行数据
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // 查询多行数据
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 关闭数据库连接
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = new Database();
