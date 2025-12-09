# @your-org/pro-table

[![npm version](https://img.shields.io/npm/v/@your-org/pro-table.svg)](https://www.npmjs.com/package/@your-org/pro-table)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883.svg)](https://vuejs.org/)

A professional table component for Vue 3 with built-in search, pagination, and advanced features. Built on top of Ant Design Vue.

## Features

- 🚀 **Out of the box** - Ready to use with minimal configuration
- 🔍 **Built-in search** - Advanced search form with validation
- 📊 **Pagination** - Built-in pagination with customizable options
- 🎨 **Customizable** - Flexible column configuration and styling
- 📱 **Responsive** - Works on all screen sizes
- 🛡 **TypeScript** - Full TypeScript support
- 🎯 **Performance** - Optimized for large datasets
- 🔧 **Extensible** - Plugin system and custom slots

## Installation

```bash
npm install @your-org/pro-table
# or
yarn add @your-org/pro-table
# or
pnpm add @your-org/pro-table
```

## Peer Dependencies

This component requires:
- Vue 3.x
- Ant Design Vue 4.x (optional, but recommended)

## Quick Start

```vue
<template>
  <ProTable
    :columns="columns"
    :request="fetchData"
  />
</template>

<script setup lang="ts">
import { ProTable } from '@your-org/pro-table'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    hideInSearch: true,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    name: 'name',
  },
  {
    title: 'Status',
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

## Advanced Usage

### Using Column Builder

```typescript
import { ColumnBuilder } from '@your-org/pro-table'

const columns = [
  ColumnBuilder.create()
    .title('User ID')
    .dataIndex('id')
    .hideInSearch(true)
    .width(100)
    .build(),

  ColumnBuilder.create()
    .title('Username')
    .dataIndex('username')
    .name('username')
    .required(true)
    .placeholder('Enter username')
    .build(),

  ColumnBuilder.create()
    .title('Actions')
    .dataIndex('actions')
    .valueType('option')
    .hideInSearch(true)
    .customRender(({ record }) => {
      return h('div', [
        h('a', { onClick: () => edit(record) }, 'Edit'),
        h('a', { onClick: () => delete(record) }, 'Delete'),
      ])
    })
    .build(),
]
```

### Custom Slots

```vue
<ProTable>
  <!-- Toolbar slot -->
  <template #tool>
    <a-button type="primary">Add New</a-button>
  </template>

  <!-- Search form buttons slot -->
  <template #search="{ submit, reset, form }">
    <a-button @click="submit">Search</a-button>
    <a-button @click="reset">Reset</a-button>
    <a-button @click="exportData(form)">Export</a-button>
  </template>
</ProTable>
```

## API Documentation

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `BaseColumn[]` | `[]` | Column configuration array |
| `request` | `RequestFunction` | `undefined` | Data request function |
| `manualRequest` | `boolean` | `false` | Manual request trigger |
| `showSearch` | `boolean` | `true` | Show search form |
| `tableOptions` | `TableOptions` | `{}` | Table configuration |
| `pageOptions` | `PageOptions` | `{}` | Pagination configuration |
| `searchOptions` | `SearchOptions` | `{}` | Search form configuration |

### Methods

Accessible via component ref:

```typescript
const tableRef = ref()

// Refresh table data
tableRef.value?.reload()

// Show success message and refresh
tableRef.value?.successAndReload()
```

### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `change` | `formData: Record<string, any>` | Search form data change |
| `search` | `params: Record<string, any>` | Search button clicked |

## Configuration Validation

ProTable validates your configuration in development mode:

```typescript
// Invalid configuration (will show warnings)
const invalidColumns = [
  {
    // Missing title and dataIndex
    hideInSearch: true,
  },
]
```

## Error Handling

ProTable provides built-in error handling:

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

## Theme Customization

You can customize the theme using CSS variables:

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

## Browser Support

- Chrome ≥ 64
- Firefox ≥ 78
- Safari ≥ 12
- Edge ≥ 79

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

## License

MIT © [Your Organization](https://github.com/your-org)