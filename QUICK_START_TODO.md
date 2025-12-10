# 🚀 快速启动 Todo 模板

## 📋 直接复制使用

将以下 JSON 复制到 Claude Code 的 TodoWrite 工具中即可开始工作：

```json
[
  {
    "content": "分析需求和技术方案",
    "activeForm": "分析需求和技术方案",
    "status": "pending"
  },
  {
    "content": "设计 API 和类型定义",
    "activeForm": "设计 API 和类型定义",
    "status": "pending"
  },
  {
    "content": "实现核心功能",
    "activeForm": "实现核心功能",
    "status": "pending"
  },
  {
    "content": "编写单元测试",
    "activeForm": "编写单元测试",
    "status": "pending"
  },
  {
    "content": "更新类型声明",
    "activeForm": "更新类型声明",
    "status": "pending"
  },
  {
    "content": "添加示例代码",
    "activeForm": "添加示例代码",
    "status": "pending"
  },
  {
    "content": "更新文档",
    "activeForm": "更新文档",
    "status": "pending"
  },
  {
    "content": "运行完整测试套件",
    "activeForm": "运行完整测试套件",
    "status": "pending"
  },
  {
    "content": "构建和类型检查",
    "activeForm": "构建和类型检查",
    "status": "pending"
  },
  {
    "content": "更新版本号",
    "activeForm": "更新版本号",
    "status": "pending"
  },
  {
    "content": "提交代码到 Git",
    "activeForm": "提交代码到 Git",
    "status": "pending"
  },
  {
    "content": "发布新版本",
    "activeForm": "发布新版本",
    "status": "pending"
  },
  {
    "content": "创建 GitHub Release",
    "activeForm": "创建 GitHub Release",
    "status": "pending"
  }
]
```

## 🎯 精简版（小型功能更新）

```json
[
  {
    "content": "实现功能代码",
    "activeForm": "实现功能代码",
    "status": "pending"
  },
  {
    "content": "更新类型定义",
    "activeForm": "更新类型定义",
    "status": "pending"
  },
  {
    "content": "添加测试用例",
    "activeForm": "添加测试用例",
    "status": "pending"
  },
  {
    "content": "更新文档和示例",
    "activeForm": "更新文档和示例",
    "status": "pending"
  },
  {
    "content": "运行测试和构建",
    "activeForm": "运行测试和构建",
    "status": "pending"
  },
  {
    "content": "更新版本并发布",
    "activeForm": "更新版本并发布",
    "status": "pending"
  }
]
```

## 🔧 常用命令速查

```bash
# 开发
npm run dev        # 开发服务器
npm test          # 运行测试
npm run lint      # 代码检查

# 构建
npm run build     # 构建项目
npm run build:types # 生成类型

# 发布
npm version patch # 更新版本
npm publish       # 发布到 npm
node scripts/generate-release-md.js # 生成 Release 内容
```

## 📝 快速检查清单

发布前快速检查：
- [ ] 所有测试通过 (`npm test`)
- [ ] 代码检查通过 (`npm run lint`)
- [ ] 类型检查通过 (`npm run build:types`)
- [ ] 构建成功 (`npm run build`)
- [ ] 版本号已更新
- [ ] 更新日志已记录
- [ ] 文档已更新

---

**💡 使用提示**:
1. 复制上方 JSON 到 TodoWrite 工具
2. 根据实际需求调整 todo 项目
3. 按顺序执行每个任务
4. 使用右侧命令快速操作