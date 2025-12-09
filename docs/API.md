# ProTable API Documentation

## Table of Contents

- [Components](#components)
- [Props](#props)
- [Methods](#methods)
- [Events](#events)
- [Types](#types)
- [Utilities](#utilities)
- [Examples](#examples)

## Components

### ProTable (Main Component)

The main table component that combines search, table, and pagination.

```vue
<template>
  <ProTable
    :columns="columns"
    :request="fetchData"
    :tableOptions="{ rowKey: 'id' }"
    :pageOptions="{ pageSize: 20 }"
    ref="tableRef"
    @change="handleFormChange"
    @search="handleSearch"
  >
    <template #tool>
      <a-button type="primary">Add New</a-button>
    </template>
  </ProTable>
</template>
```

### ProTableSearch (Search Component)

Standalone search form component.

```vue
<template>
  <ProTableSearch
    :formItems="searchColumns"
    @search="handleSearch"
    @change="handleChange"
  />
</template>
```

### ProTableTable (Table Component)

Standalone table component with pagination.

```vue
<template>
  <ProTableTable
    :dataSource="data"
    :columns="tableColumns"
    :page="pagination"
    @on-change-page="handlePageChange"
  />
</template>
```

### ProTableDefinition (Cell Renderer)

Cell content renderer with middleware support.

```vue
<template>
  <ProTableDefinition
    :record="rowData"
    :valueKey="fieldName"
    :middleware="formatValue"
  />
</template>
```

## Props

### ProTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `BaseColumn[]` | `[]` | Column configuration array |
| `request` | `RequestFunction` | `undefined` | Data request function |
| `manualRequest` | `boolean` | `false` | Manual request trigger |
| `showSearch` | `boolean` | `true` | Show search form |
| `tableOptions` | `TableOptions` | `{}` | Table configuration |
| `pageOptions` | `PageOptions` | `{}` | Pagination configuration |
| `searchOptions` | `SearchOptions` | `{}` | Search form configuration |

### ProTableSearch Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `formItems` | `BaseColumn[]` | `[]` | Search form items |
| `hideSearchButton` | `boolean` | `false` | Hide search buttons |
| `formOptions` | `FormProps` | `{}` | Form configuration |
| `colOptions` | `Record<string, any>` | `{}` | Grid column options |
| `form` | `Record<string, any>` | `{}` | Form data (v-model) |

### ProTableTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataSource` | `any[]` | `[]` | Table data |
| `columns` | `BaseColumn[]` | `[]` | Table columns |
| `page` | `Partial<PaginationProps>` | `{}` | Pagination state |
| `tableOptions` | `TableOptions` | `{}` | Table options |

### ProTableDefinition Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `record` | `Record<string, any>` | `{}` | Row data |
| `valueKey` | `string` | `undefined` | Field key |
| `middleware` | `(value: any) => any` | `(v) => v` | Value transformer |

## Methods

### Component Methods (via ref)

```typescript
const tableRef = ref<InstanceType<typeof ProTable>>()

// Refresh table data
tableRef.value?.reload()

// Show success message and refresh
tableRef.value?.successAndReload()
```

### Search Component Methods

```typescript
const searchRef = ref<InstanceType<typeof ProTableSearch>>()

// Get form reference
const formRef = searchRef.value?.formRef

// Manually trigger search
searchRef.value?.handleSearch()

// Reset form
searchRef.value?.handleReset()
```

## Events

### ProTable Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `change` | `formData: Record<string, any>` | Search form data change |
| `search` | `params: Record<string, any>` | Search triggered |
| `update:form` | `formData: Record<string, any>` | Form data update (v-model) |

### ProTableTable Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `on-change-page` | `{ current: number, pageSize: number }` | Pagination change |

### ProTableSearch Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `search` | `params: Record<string, any>` | Search triggered |
| `change` | `formData: Record<string, any>` | Form data change |
| `update:form` | `formData: Record<string, any>` | Form data update (v-model) |

## Types

### BaseColumn

The complete column configuration interface.

```typescript
interface BaseColumn {
  // Table properties
  title?: string
  dataIndex?: string
  hideInTable?: boolean
  customRender?: (params: { record: any; text: any; index: number }) => any
  customRenderOption?: Record<string, any>
  customCell?: () => Record<string, any>
  visible?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  sorter?: boolean | ((a: any, b: any) => number)

  // Search properties
  name?: string
  label?: string
  hideInSearch?: boolean
  valueType?: string
  order?: number
  component?: Component
  fieldProps?: Record<string, any>
  formItemProps?: FormItemProps
  defaultValue?: any
  colOptions?: Record<string, any>
  required?: boolean
  rules?: any[]
  placeholder?: string
}
```

### TableOptions

```typescript
interface TableOptions {
  hidePagination?: boolean
  rowKey?: string | ((record: any) => string)
  bordered?: boolean
  size?: 'default' | 'middle' | 'small'
  scroll?: { x?: number | string; y?: number | string }
  [key: string]: any // Other Ant Design Table props
}
```

### PageOptions

```typescript
interface PageOptions extends Partial<PaginationProps> {
  current?: number
  pageSize?: number
  total?: number
}
```

### SearchOptions

```typescript
interface SearchOptions {
  hideSearchButton?: boolean
  formOptions?: FormProps
  colOptions?: Record<string, any>
}
```

### RequestFunction

```typescript
type RequestFunction<T = any> = (params: Record<string, any>) => Promise<RequestResult<T>>

interface RequestResult<T = any> {
  success: boolean
  data: T[]
  total: number
  message?: string
}
```

## Utilities

### ColumnBuilder

Chainable builder for creating column configurations.

```typescript
import { ColumnBuilder } from '@your-org/pro-table'

const column = ColumnBuilder.create()
  .title('User ID')
  .dataIndex('id')
  .hideInSearch(true)
  .width(100)
  .align('center')
  .required(true)
  .placeholder('Enter ID')
  .component(Input, { allowClear: true })
  .defaultValue('')
  .rules([{ required: true, message: 'ID is required' }])
  .customRender(({ record }) => `#${record.id}`)
  .build()
```

### Validation Functions

```typescript
import { validateColumns, normalizeColumns } from '@your-org/pro-table'

// Validate column configuration
const validation = validateColumns(columns)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
}

// Normalize columns (add missing properties)
const normalized = normalizeColumns(columns)
```

### Error Handling

```typescript
import { ProTableError, handleError, safeExecute } from '@your-org/pro-table'

// Create custom error
throw new ProTableError('Custom error', 'CUSTOM_CODE', { details: '...' })

// Handle errors
try {
  // some operation
} catch (error) {
  const proTableError = handleError(error, 'Context')
  console.error(proTableError.message, proTableError.details)
}

// Safe execution
const result = await safeExecute(async () => {
  return await fetchData(params)
}, 'Data fetching')

if (result.success) {
  // Handle success
} else {
  // Handle error
  console.error(result.error?.message)
}
```

### Utility Functions

```typescript
import {
  unFlattenForm,
  filterEmptyValues,
  debounce,
  throttle
} from '@your-org/pro-table'

// Convert flat form data to nested object
const nested = unFlattenForm({ 'user,name': 'John', 'user,age': '30' })
// Result: { user: { name: 'John', age: '30' } }

// Filter empty values
const filtered = filterEmptyValues({ name: 'John', age: '', city: null })
// Result: { name: 'John' }

// Debounce function
const debouncedSearch = debounce(searchFunction, 300)

// Throttle function
const throttledScroll = throttle(handleScroll, 100)
```

## Examples

### Basic Example

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
    title: 'Email',
    dataIndex: 'email',
    name: 'email',
  },
]

const fetchData = async (params) => {
  const response = await api.getUsers(params)
  return {
    success: true,
    data: response.users,
    total: response.total,
  }
}
</script>
```

### Advanced Example with Customization

```vue
<template>
  <ProTable
    :columns="columns"
    :request="fetchData"
    :tableOptions="{
      rowKey: 'id',
      bordered: true,
      size: 'middle',
      scroll: { x: 1000 }
    }"
    :pageOptions="{
      pageSize: 20,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `Total ${total} items`
    }"
    :searchOptions="{
      hideSearchButton: false,
      formOptions: { layout: 'horizontal' },
      colOptions: { sm: 24, md: 12, lg: 8, xl: 6 }
    }"
    ref="tableRef"
    @change="handleFormChange"
  >
    <template #tool>
      <a-space>
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          Add New
        </a-button>
        <a-button @click="handleExport">
          <template #icon><ExportOutlined /></template>
          Export
        </a-button>
      </a-space>
    </template>

    <template #search="{ submit, reset, form }">
      <a-space>
        <a-button type="primary" @click="submit">Search</a-button>
        <a-button @click="reset">Reset</a-button>
        <a-button @click="handleAdvancedSearch(form)">Advanced</a-button>
      </a-space>
    </template>
  </ProTable>
</template>
```

### Custom Cell Rendering

```typescript
const columns = [
  {
    title: 'Status',
    dataIndex: 'status',
    customRender: ({ record }) => {
      const statusConfig = {
        0: { text: 'Draft', color: 'gray', icon: 'EditOutlined' },
        1: { text: 'Active', color: 'green', icon: 'CheckCircleOutlined' },
        2: { text: 'Archived', color: 'orange', icon: 'ArchiveOutlined' },
      }
      const config = statusConfig[record.status] || statusConfig[0]

      return h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
        h(config.icon, { style: { color: config.color } }),
        h('span', { style: { color: config.color, fontWeight: 500 } }, config.text)
      ])
    }
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    valueType: 'option',
    hideInSearch: true,
    customRender: ({ record }) => {
      return h('div', { class: 'action-buttons' }, [
        h('a', {
          onClick: () => handleEdit(record),
          style: { marginRight: '8px' }
        }, 'Edit'),
        h('a', {
          onClick: () => handleView(record),
          style: { marginRight: '8px' }
        }, 'View'),
        h('a', {
          onClick: () => handleDelete(record),
          style: { color: '#ff4d4f' }
        }, 'Delete'),
      ])
    }
  }
]
```

### Error Handling Example

```typescript
const fetchData = async (params) => {
  try {
    const response = await api.getList(params)

    if (!response.success) {
      throw new ProTableError(
        response.message || 'Request failed',
        'API_ERROR',
        { response }
      )
    }

    return {
      success: true,
      data: response.data,
      total: response.total,
    }
  } catch (error) {
    // Log error for debugging
    console.error('Fetch data error:', error)

    // Return error response
    return {
      success: false,
      message: error.message || 'Unknown error',
      data: [],
      total: 0,
    }
  }
}
```

### Theme Customization

```css
/* Global CSS variables */
:root {
  --pro-table-header-bg: #fafafa;
  --pro-table-row-hover-bg: #f5f5f5;
  --pro-table-border-color: #f0f0f0;
  --pro-table-primary-color: #1890ff;
  --pro-table-success-color: #52c41a;
  --pro-table-warning-color: #faad14;
  --pro-table-error-color: #ff4d4f;
}

/* Component styling */
.pro-table {
  --ant-primary-color: var(--pro-table-primary-color);
}

.pro-table .ant-table-thead > tr > th {
  background-color: var(--pro-table-header-bg);
  font-weight: 600;
}

.pro-table .ant-table-tbody > tr:hover > td {
  background-color: var(--pro-table-row-hover-bg);
}

.pro-table .ant-table {
  border-color: var(--pro-table-border-color);
}

/* Custom status colors */
.status-active {
  color: var(--pro-table-success-color);
}

.status-inactive {
  color: var(--pro-table-warning-color);
}

.status-error {
  color: var(--pro-table-error-color);
}
```