# 🚀 功能更新工作流 Todo 模板

## 📋 使用说明

这是一个标准化的功能更新工作流模板。当需要添加新功能或更新现有功能时，可以按照这个模板创建 todo 列表，确保工作流程的完整性和一致性。

## 🔄 标准工作流 Todo 模板

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

## 🎯 各阶段详细说明

### 阶段 1: 规划和分析
- **分析需求和技术方案**: 明确功能需求，评估技术可行性，设计整体架构
- **设计 API 和类型定义**: 设计清晰的 API 接口，完善 TypeScript 类型定义

### 阶段 2: 开发实现
- **实现核心功能**: 编写主要功能代码，遵循现有代码风格
- **编写单元测试**: 为新增功能编写测试用例，确保代码质量
- **更新类型声明**: 确保 TypeScript 类型定义完整准确

### 阶段 3: 文档和示例
- **添加示例代码**: 在 `examples/` 目录中添加使用示例
- **更新文档**: 更新 README、API 文档和相关说明

### 阶段 4: 质量保证
- **运行完整测试套件**: 运行所有测试，确保没有回归问题
- **构建和类型检查**: 执行构建和类型检查，确保打包正常

### 阶段 5: 发布部署
- **更新版本号**: 根据语义化版本规范更新 `package.json` 版本号
- **提交代码到 Git**: 提交所有更改到版本控制系统
- **发布新版本**: 发布到 npm registry
- **创建 GitHub Release**: 在 GitHub 上创建 Release 记录

## 📁 文件更新清单

每次功能更新通常需要更新以下文件：

### 必须更新的文件
1. `package.json` - 版本号更新
2. `CHANGELOG.md` - 版本变更记录
3. `src/` 目录 - 源代码文件
4. `tests/` 目录 - 测试文件
5. `dist/` 目录 - 构建产物（自动生成）

### 建议更新的文件
1. `README.md` - 功能说明和示例
2. `README.zh-CN.md` - 中文文档
3. `examples/` 目录 - 使用示例
4. `src/types.ts` - 类型定义
5. `src/export.ts` - 导出声明

## 🔧 常用命令参考

```bash
# 开发阶段
npm run dev          # 启动开发服务器
npm test            # 运行测试
npm run lint        # 代码检查

# 构建阶段
npm run build       # 构建项目
npm run build:types # 生成类型声明

# 发布阶段
npm version patch   # 更新补丁版本 (1.0.0 → 1.0.1)
npm version minor   # 更新小版本 (1.0.0 → 1.1.0)
npm version major   # 更新大版本 (1.0.0 → 2.0.0)
npm publish         # 发布到 npm

# 文档生成
node scripts/generate-release-md.js  # 生成 Release Markdown
```

## 📝 提交信息规范

使用一致的提交信息格式：

```
类型: 简要描述

详细说明（可选）

- 功能点 1
- 功能点 2
- 修复问题 3

相关 Issue: #123
```

**类型前缀**:
- `feat:` 新功能
- `fix:` 错误修复
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具变动

## 🚨 质量检查清单

在发布前检查以下项目：

### 代码质量
- [ ] 所有测试通过
- [ ] 代码 lint 检查通过
- [ ] TypeScript 类型检查通过
- [ ] 没有控制台警告/错误

### 功能完整性
- [ ] 核心功能实现完成
- [ ] 边缘情况处理完善
- [ ] 错误处理机制健全
- [ ] 性能考虑充分

### 文档完整性
- [ ] API 文档更新
- [ ] 使用示例完整
- [ ] 类型定义准确
- [ ] 更新日志记录

### 发布准备
- [ ] 版本号已更新
- [ ] 构建产物正常
- [ ] 依赖检查完成
- [ ] 发布脚本就绪

## 📈 版本策略

### 语义化版本规范
- **主版本号 (MAJOR)**: 不兼容的 API 修改
- **次版本号 (MINOR)**: 向下兼容的功能性新增
- **修订号 (PATCH)**: 向下兼容的问题修正

### 预发布版本
- `1.0.0-alpha.1` - Alpha 版本，内部测试
- `1.0.0-beta.1` - Beta 版本，公开测试
- `1.0.0-rc.1` - 发布候选版本

## 🆘 故障排除

### 常见问题
1. **类型生成失败**: 检查 `tsconfig.json` 配置和 `vue-tsc` 版本
2. **测试失败**: 检查测试环境配置和模拟数据
3. **构建错误**: 检查依赖版本和构建配置
4. **发布失败**: 检查 npm 登录状态和包权限

### 快速恢复
```bash
# 清理并重新构建
rm -rf dist node_modules/.vite
npm ci
npm run build

# 重新生成类型
rm -rf dist/types
npm run build:types
```

## 📞 支持资源

- **项目文档**: `README.md`, `CHANGELOG.md`
- **代码示例**: `examples/` 目录
- **测试用例**: `tests/` 目录
- **构建配置**: `vite.config.ts`, `tsconfig.json`
- **工作流配置**: `.github/workflows/`

---

**最后更新**: 2025-12-09
**适用版本**: vue3-pro-table-antd v1.0.0-alpha.2+
**维护状态**: 活跃维护中

> 💡 **提示**: 将此模板保存为参考，每次功能更新时复制并调整 todo 列表，确保工作流程的完整性和一致性。