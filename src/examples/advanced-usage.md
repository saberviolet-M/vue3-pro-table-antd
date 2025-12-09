# ProTable 高级用法示例

## 使用配置构建器

ProTable 提供了 `ColumnBuilder` 类来简化列配置的创建：

```typescript
import { ColumnBuilder } from './utils';

// 使用构建器创建列配置
const columns = [
  ColumnBuilder.create()
    .title('用户ID')
    .dataIndex('id')
    .hideInSearch(true)
    .width(100)
    .align('center')
    .build(),

  ColumnBuilder.create()
    .title('用户名')
    .dataIndex('username')
    .name('username')
    .label('用户名')
    .order(1)
    .required(true)
    .placeholder('请输入用户名')
    .width(150)
    .build(),

  ColumnBuilder.create()
    .title('状态')
    .dataIndex('status')
    .name('status')
    .component(Select, {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
      placeholder: '请选择状态',
    })
    .defaultValue(1)
    .width(120)
    .build(),

  ColumnBuilder.create()
    .title('创建时间')
    .dataIndex('createTime')
    .hideInSearch(true)
    .customRender(({ record }) => {
      return dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss');
    })
    .width(180)
    .build(),

  ColumnBuilder.create()
    .title('操作')
    .dataIndex('action')
    .valueType('option')
    .hideInSearch(true)
    .customRender(({ record }) => {
      return h('div', [
        h('a', { onClick: () => edit(record) }, '编辑'),
        h('a', { onClick: () => del(record) }, '删除'),
      ]);
    })
    .width(150)
    .align('center')
    .build(),
];
```

## 完整的组件使用示例

```vue
<template>
  <ProTable
    :columns="columns"
    :request="fetchData"
    :tableOptions="{
      hidePagination: false,
      rowKey: 'id',
      bordered: true,
    }"
    :pageOptions="{
      pageSize: 20,
      showSizeChanger: true,
      showQuickJumper: true,
    }}"
    :searchOptions="{
      hideSearchButton: false,
      formOptions: {
        layout: 'horizontal',
      },
      colOptions: {
        sm: 24,
        md: 12,
        lg: 8,
      },
    }}"
    ref="tableRef"
    @change="handleFormChange"
  >
    <template #tool>
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        新增
      </a-button>
      <a-button @click="handleExport">
        <template #icon><ExportOutlined /></template>
        导出
      </a-button>
    </template>

    <template #search="{ submit, reset, form }">
      <a-button type="primary" @click="submit">搜索</a-button>
      <a-button @click="reset">重置</a-button>
      <a-button @click="handleAdvancedSearch(form)">高级搜索</a-button>
    </template>
  </ProTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { h } from 'vue';
import { Select, message } from 'ant-design-vue';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import ProTable from './index.vue';
import { ColumnBuilder } from './utils';

// 使用构建器创建列配置
const columns = [
  ColumnBuilder.create()
    .title('ID')
    .dataIndex('id')
    .hideInSearch(true)
    .width(80)
    .align('center')
    .build(),

  ColumnBuilder.create()
    .title('名称')
    .dataIndex('name')
    .name('name')
    .order(1)
    .required(true)
    .placeholder('请输入名称')
    .width(150)
    .build(),

  ColumnBuilder.create()
    .title('类型')
    .dataIndex('type')
    .name('type')
    .component(Select, {
      options: [
        { label: '类型A', value: 'A' },
        { label: '类型B', value: 'B' },
        { label: '类型C', value: 'C' },
      ],
    })
    .defaultValue('A')
    .width(120)
    .build(),

  ColumnBuilder.create()
    .title('状态')
    .dataIndex('status')
    .name('status')
    .component(Select, {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    })
    .defaultValue(1)
    .width(100)
    .build(),

  ColumnBuilder.create()
    .title('创建时间')
    .dataIndex('createTime')
    .hideInSearch(true)
    .customRender(({ record }) => {
      return record.createTime
        ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
        : '-';
    })
    .width(180)
    .build(),

  ColumnBuilder.create()
    .title('操作')
    .dataIndex('action')
    .valueType('option')
    .hideInSearch(true)
    .customRender(({ record }) => {
      return h('div', { class: 'action-buttons' }, [
        h('a', {
          onClick: () => handleEdit(record),
          style: { marginRight: '8px' }
        }, '编辑'),
        h('a', {
          onClick: () => handleDelete(record),
          style: { color: '#ff4d4f' }
        }, '删除'),
      ]);
    })
    .width(150)
    .align('center')
    .build(),
];

const tableRef = ref();

// 数据请求函数
const fetchData = async (params: Record<string, any>) => {
  try {
    const response = await api.getList(params);
    return {
      success: true,
      data: response.list,
      total: response.total,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: [],
      total: 0,
    };
  }
};

// 事件处理
const handleFormChange = (formData: Record<string, any>) => {
  console.log('表单数据变化:', formData);
};

const handleAdd = () => {
  // 新增逻辑
  message.success('点击了新增按钮');
};

const handleExport = () => {
  // 导出逻辑
  message.success('点击了导出按钮');
};

const handleEdit = (record: any) => {
  // 编辑逻辑
  message.info(`编辑: ${record.name}`);
};

const handleDelete = (record: any) => {
  // 删除逻辑
  message.warning(`删除: ${record.name}`);
};

const handleAdvancedSearch = (form: Record<string, any>) => {
  // 高级搜索逻辑
  console.log('高级搜索:', form);
};

// 通过 ref 调用组件方法
const refreshTable = () => {
  tableRef.value?.reload();
};

const successAndRefresh = () => {
  tableRef.value?.successAndReload();
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
```

## 配置验证

ProTable 会自动验证配置，开发环境下会输出警告信息：

```typescript
// 无效的配置示例（会在控制台输出警告）
const invalidColumns = [
  {
    // 缺少 title 和 dataIndex
    hideInSearch: true,
  },
  {
    title: '测试',
    dataIndex: 123, // dataIndex 应该是字符串
  },
  {
    title: '测试2',
    order: '1', // order 应该是数字
  },
];

// 使用 validateColumns 手动验证
import { validateColumns } from './utils';

const validation = validateColumns(invalidColumns);
if (!validation.valid) {
  console.error('配置验证失败:', validation.errors);
}
```

## 响应式配置

ProTable 支持响应式配置，配置变化时会自动更新：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

// 响应式列配置
const showAdvancedColumns = ref(false);

const columns = computed(() => {
  const baseColumns = [
    // 基础列配置...
  ];

  if (showAdvancedColumns.value) {
    return [
      ...baseColumns,
      // 高级列配置...
    ];
  }

  return baseColumns;
});

// 动态切换列显示
const toggleAdvancedColumns = () => {
  showAdvancedColumns.value = !showAdvancedColumns.value;
};
</script>
```

## 自定义插槽

ProTable 提供了多个插槽用于自定义内容：

```vue
<ProTable>
  <!-- 工具栏插槽 -->
  <template #tool>
    <a-button>自定义按钮</a-button>
  </template>

  <!-- 搜索表单按钮插槽 -->
  <template #search="{ submit, reset, form }">
    <a-button @click="submit">搜索</a-button>
    <a-button @click="reset">重置</a-button>
    <a-button @click="customAction(form)">自定义</a-button>
  </template>

  <!-- 表格行展开插槽 -->
  <template #expand="{ record }">
    <div>展开内容: {{ record.id }}</div>
  </template>

  <!-- 空状态插槽 -->
  <template #empty>
    <div style="text-align: center; padding: 40px;">
      <img src="/empty.png" alt="空状态" />
      <div>暂无数据</div>
    </div>
  </template>
</ProTable>
```

## 主题定制

可以通过 CSS 变量定制 ProTable 的主题：

```css
/* 全局主题变量 */
:root {
  --pro-table-header-bg: #fafafa;
  --pro-table-row-hover-bg: #f5f5f5;
  --pro-table-border-color: #f0f0f0;
  --pro-table-primary-color: #1890ff;
}

/* 组件样式覆盖 */
.pro-table {
  --ant-primary-color: var(--pro-table-primary-color);
}

.pro-table .ant-table-thead > tr > th {
  background-color: var(--pro-table-header-bg);
}

.pro-table .ant-table-tbody > tr:hover > td {
  background-color: var(--pro-table-row-hover-bg);
}
```