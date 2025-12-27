const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// 用户相关路由
router.post('/', userController.createUser); // 创建用户
router.get('/:name', userController.getUser); // 获取用户信息
router.get('/:name/preferences', userController.getPreferences); // 获取用户偏好
router.put('/:name/preferences', userController.updatePreferences); // 更新用户偏好

module.exports = router;
