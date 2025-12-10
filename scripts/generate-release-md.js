#!/usr/bin/env node

/**
 * 生成 GitHub Release Markdown 内容
 * 用法: node scripts/generate-release-md.js
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

// 读取 package.json 获取版本信息
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))
const version = packageJson.version
const packageName = packageJson.name

// Release markdown 模板
const releaseMarkdown = `## 🚀 新版本亮点 v${version}

### ✅ 新增功能
- **完整的 TypeScript 支持**: 所有组件都有完整的类型定义
- **增强的测试覆盖**: 全面的边缘情况测试
- **CDN 支持**: 可通过 unpkg 和 jsDelivr 使用
- **CI/CD 流水线**: 自动化测试和发布工作流
- **详细的示例**: 基础、高级和 CDN 使用示例

### 🔧 技术改进
- 修复 TypeScript 类型生成问题
- 标准化属性命名 (\`hideInSearch\`)
- 改进表单验证处理
- 优化组件引用暴露
- 更新构建配置

### 📚 文档更新
- 完整的更新日志 (CHANGELOG.md)
- 详细的用法示例
- CDN 使用指南
- 版本信息徽章

## 📦 安装方式

\`\`\`bash
# npm
npm install ${packageName}

# yarn
yarn add ${packageName}

# pnpm
pnpm add ${packageName}

# CDN (UMD)
<script src="https://unpkg.com/${packageName}/dist/pro-table.umd.js"></script>

# CDN (ES Module)
<script type="module">
  import { ProTable } from 'https://unpkg.com/${packageName}/dist/pro-table.es.js'
</script>
\`\`\`

## 🔗 相关链接
- [npm 包页面](https://www.npmjs.com/package/${packageName})
- [完整文档](README.md)
- [更新日志](CHANGELOG.md)
- [示例代码](examples/)

## 📝 详细变更
查看完整的变更记录: [CHANGELOG.md](CHANGELOG.md)

---

**🤖 此版本由 Claude Code 协助生成**`

console.log('='.repeat(80))
console.log(`GitHub Release Markdown for v${version}`)
console.log('='.repeat(80))
console.log('\n复制以下内容到 GitHub Release 描述区域:\n')
console.log(releaseMarkdown)
console.log('\n' + '='.repeat(80))
console.log('\n发布信息:')
console.log(`- Tag: v${version}`)
console.log(`- 标题: v${version} - 类型支持、测试增强和文档完善`)
console.log(`- 目标分支: main`)
console.log('='.repeat(80))
