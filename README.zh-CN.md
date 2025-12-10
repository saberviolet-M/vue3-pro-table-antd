# vue3-pro-table-antd

[![npm 版本](https://img.shields.io/npm/v/vue3-pro-table-antd.svg)](https://www.npmjs.com/package/vue3-pro-table-antd)
[![许可证: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883.svg)](https://vuejs.org/)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/saberviolet-M/vue3-pro-table/ci.yml)](https://github.com/saberviolet-M/vue3-pro-table/actions)

基于 Ant Design Vue 构建的专业 Vue 3 表格组件，内置搜索、分页和高级功能。

[English](README.md) | 简体中文

## 特性

- 🚀 **开箱即用** - 最小配置即可使用
- 🔍 **内置搜索** - 带验证的高级搜索表单
- 📊 **分页功能** - 内置分页，支持自定义选项
- 🎨 **高度可定制** - 灵活的列配置和样式
- 📱 **响应式设计** - 支持所有屏幕尺寸
- 🛡 **TypeScript 支持** - 完整的 TypeScript 类型定义
- 🎯 **高性能** - 针对大数据集优化
- 🔧 **可扩展** - 插件系统和自定义插槽

## 安装

```bash
npm install vue3-pro-table-antd
# 或
yarn add vue3-pro-table-antd
# 或
pnpm add vue3-pro-table-antd
```

## 依赖要求

此组件需要：
- Vue 3.x
- Ant Design Vue 4.x (可选，但推荐)

## 快速开始

```vue
<template>
  <ProTable
    :columns="columns"
    :request="fetchData"
  />
</template>

<script setup lang="ts">
import { ProTable } from 'vue3-pro-table'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    hideInSearch: true,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    name: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    name: 'status',
  },
]

const fetchData = async (params) => {
  const response = await api.getList(params)
  return {
    success: true,
    data: response.list,
    total: response.total,
  }
}
</script>
```

## 高级用法

### 使用列构建器

```typescript
import { ColumnBuilder } from 'vue3-pro-table'

const columns = [
  ColumnBuilder.create()
    .title('用户ID')
    .dataIndex('id')
    .hideInSearch(true)
    .width(100)
    .build(),

  ColumnBuilder.create()
    .title('用户名')
    .dataIndex('username')
    .name('username')
    .required(true)
    .placeholder('请输入用户名')
    .build(),

  ColumnBuilder.create()
    .title('操作')
    .dataIndex('actions')
    .valueType('option')
    .hideInSearch(true)
    .customRender(({ record }) => {
      return h('div', [
        h('a', { onClick: () => edit(record) }, '编辑'),
        h('a', { onClick: () => delete(record) }, '删除'),
      ])
    })
    .build(),
]
```

### 自定义插槽

```vue
<ProTable>
  <!-- 工具栏插槽 -->
  <template #tool>
    <a-button type="primary">新增</a-button>
  </template>

  <!-- 搜索表单按钮插槽 -->
  <template #search="{ submit, reset, form }">
    <a-button @click="submit">搜索</a-button>
    <a-button @click="reset">重置</a-button>
    <a-button @click="exportData(form)">导出</a-button>
  </template>
</ProTable>
```

## API 文档

### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| `columns` | `BaseColumn[]` | `[]` | 列配置数组 |
| `request` | `RequestFunction` | `undefined` | 数据请求函数 |
| `manualRequest` | `boolean` | `false` | 手动触发请求 |
| `showSearch` | `boolean` | `true` | 显示搜索表单 |
| `tableOptions` | `TableOptions` | `{}` | 表格配置 |
| `pageOptions` | `PageOptions` | `{}` | 分页配置 |
| `searchOptions` | `SearchOptions` | `{}` | 搜索表单配置 |

### 方法

通过组件引用访问：

```typescript
const tableRef = ref()

// 刷新表格数据
tableRef.value?.reload()

// 显示成功消息并刷新
tableRef.value?.successAndReload()
```

### 事件

| 事件 | 参数 | 描述 |
|-------|------------|-------------|
| `change` | `formData: Record<string, any>` | 搜索表单数据变化 |
| `search` | `params: Record<string, any>` | 搜索按钮点击 |

## 配置验证

ProTable 在开发模式下会验证您的配置：

```typescript
// 无效配置（会显示警告）
const invalidColumns = [
  {
    // 缺少 title 和 dataIndex
    hideInSearch: true,
  },
]
```

## 错误处理

ProTable 提供内置错误处理：

```typescript
const fetchData = async (params) => {
  try {
    const response = await api.getList(params)
    return {
      success: true,
      data: response.list,
      total: response.total,
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: [],
      total: 0,
    }
  }
}
```

## 主题定制

您可以使用 CSS 变量自定义主题：

```css
:root {
  --pro-table-header-bg: #fafafa;
  --pro-table-row-hover-bg: #f5f5f5;
  --pro-table-primary-color: #1890ff;
}

.pro-table {
  --ant-primary-color: var(--pro-table-primary-color);
}
```

## 浏览器支持

- Chrome ≥ 64
- Firefox ≥ 78
- Safari ≥ 12
- Edge ≥ 79

## 贡献指南

请在提交 Pull Request 前阅读我们的[贡献指南](CONTRIBUTING.md)。

## 更新日志

每个版本的详细更改记录在 [CHANGELOG.md](CHANGELOG.md) 中。

### 最近更新 (v1.0.0-alpha.4)

- ✅ **CI/CD 改进**: 修复所有 CI 测试失败和环境问题
- ✅ **测试基础设施**: 增强测试可靠性和稳定性
- ✅ **Ant Design Vue 兼容性**: 修复测试环境中的兼容性问题

### 历史更新 (v1.0.0-alpha.3)

- ✅ **ESLint 代码质量**: 修复所有 ESLint 警告和格式化问题
- ✅ **TypeScript 类型安全**: 减少 `any` 类型使用，提供正确的类型定义
- ✅ **测试维护**: 修复未使用变量警告和测试用例断言

### 历史更新 (v1.0.0-alpha.2)

- ✅ **完整的 TypeScript 支持**: 所有组件的完整类型定义
- ✅ **增强的测试覆盖**: 全面的边缘情况测试
- ✅ **CDN 支持**: 可通过 unpkg 和 jsDelivr 使用
- ✅ **CI/CD 流水线**: 自动化测试和发布
- ✅ **改进的文档**: 详细的示例和使用指南
- ✅ **错误修复**: 类型生成、表单验证和属性命名

## 文档

### 📚 核心文档
- **[API 参考](docs/API.md)** - 完整的 API 文档和示例
- **[开发工作流](DEVELOPMENT_WORKFLOW.md)** - 标准化的开发流程和模板
- **[更新日志](CHANGELOG.md)** - 版本历史和发布说明

### 🌐 语言支持
- **[English Documentation](README.md)** - 英文文档

### 🎯 示例
- **[基础用法](examples/basic-usage.vue)** - 简单实现示例
- **[高级用法](examples/advanced-usage.vue)** - 自定义插槽、渲染和高级功能
- **[CDN 用法](examples/cdn-usage.html)** - 无需构建工具的浏览器用法

### 🔧 开发资源
- 查看 [开发工作流](DEVELOPMENT_WORKFLOW.md) 获取：
  - 标准化的待办事项模板
  - 版本管理指南
  - 发布创建流程
  - 常用命令和问题排查

## 许可证

MIT © [saberviolet-M](https://github.com/saberviolet-M)