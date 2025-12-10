<template>
  <div class="advanced-example">
    <h2>Advanced ProTable Usage</h2>

    <div class="control-panel">
      <a-space>
        <a-button type="primary" @click="handleManualReload">Manual Reload</a-button>
        <a-button @click="toggleSearch">
          Toggle Search ({{ showSearch ? 'Hide' : 'Show' }})
        </a-button>
        <a-button @click="changePageSize">Change Page Size to 20</a-button>
      </a-space>
    </div>

    <ProTable
      ref="tableRef"
      :columns="columns"
      :request="fetchData"
      :show-search="showSearch"
      :manual-request="true"
      :table-options="tableOptions"
      :page-options="pageOptions"
      :search-options="searchOptions"
      @page-change="handlePageChange"
    >
      <!-- 自定义搜索按钮插槽 -->
      <template #search-buttons="{ submit, reset, form }">
        <a-space>
          <a-button type="primary" @click="submit">Custom Search</a-button>
          <a-button @click="reset">Custom Reset</a-button>
          <a-button @click="exportData(form)">Export</a-button>
        </a-space>
      </template>

      <!-- 自定义表格操作栏 -->
      <template #table-header>
        <div class="table-header-actions">
          <a-space>
            <a-button type="primary" @click="handleAdd">Add New</a-button>
            <a-button @click="handleBatchDelete">Batch Delete</a-button>
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item key="export">Export All</a-menu-item>
                  <a-menu-item key="import">Import</a-menu-item>
                  <a-menu-item key="settings">Settings</a-menu-item>
                </a-menu>
              </template>
              <a-button>
                More Actions
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </a-space>
        </div>
      </template>

      <!-- 自定义列渲染 -->
      <template #name-column="{ text, record }">
        <a-tag color="blue">{{ text }}</a-tag>
        <a-tooltip :title="`ID: ${record.id}`">
          <InfoCircleOutlined style="margin-left: 8px; color: #999" />
        </a-tooltip>
      </template>

      <!-- 自定义空状态 -->
      <template #empty>
        <div class="custom-empty">
          <a-empty description="No data found">
            <template #image>
              <img src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" />
            </template>
            <a-button type="primary" @click="handleAdd">Create Now</a-button>
          </a-empty>
        </div>
      </template>
    </ProTable>

    <div class="debug-panel">
      <h3>Debug Info</h3>
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, h } from 'vue'
  import { ProTable } from '../src/export'
  import type { ProTableExposed, BaseColumn, RequestResult, PageChangeEvent } from '../src/types'
  import {
    DownOutlined,
    InfoCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
  } from '@ant-design/icons-vue'

  // 表格引用
  const tableRef = ref<ProTableExposed>()

  // 状态
  const showSearch = ref(true)
  const currentPage = ref(1)
  const selectedRows = ref<any[]>([])

  // 列配置
  const columns = ref<BaseColumn[]>([
    {
      title: 'Selection',
      dataIndex: 'selection',
      valueType: 'checkbox',
      width: 60,
      customRender: () => h('input', { type: 'checkbox' }),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      name: 'id',
      width: 80,
      sorter: true,
      fixed: 'left' as const,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      name: 'name',
      slots: { customRender: 'name-column' },
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      customRender: ({ text }: { text: string }) =>
        h('img', {
          src: text || 'https://joeschmoe.io/api/v1/random',
          style: 'width: 32px; height: 32px; border-radius: 50%;',
        }),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      customRender: ({ text }: { text: number }) =>
        h('a-progress', { percent: text, size: 'small' }),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      customRender: ({ text }: { text: string[] }) =>
        h(
          'div',
          text.map((tag) => h('a-tag', { color: 'blue', style: 'margin-right: 4px;' }, tag))
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      name: 'status',
      valueType: 'select',
      fieldProps: {
        options: [
          { label: 'Success', value: 'success', color: 'green' },
          { label: 'Error', value: 'error', color: 'red' },
          { label: 'Processing', value: 'processing', color: 'blue' },
          { label: 'Warning', value: 'warning', color: 'orange' },
        ],
      },
      customRender: ({ text }: { text: string }) => {
        const colors: Record<string, string> = {
          success: 'green',
          error: 'red',
          processing: 'blue',
          warning: 'orange',
        }
        return h('a-tag', { color: colors[text] || 'default' }, text)
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right' as const,
      width: 150,
      customRender: ({ record }: { record: any }) =>
        h('a-space', [
          h(
            'a-button',
            {
              type: 'link',
              icon: h(EditOutlined),
              onClick: () => handleEdit(record),
            },
            'Edit'
          ),
          h(
            'a-button',
            {
              type: 'link',
              danger: true,
              icon: h(DeleteOutlined),
              onClick: () => handleDelete(record),
            },
            'Delete'
          ),
          h('a-button', {
            type: 'link',
            icon: h(DownloadOutlined),
            onClick: () => handleDownload(record),
          }),
        ]),
    },
  ])

  // 表格配置
  const tableOptions = ref({
    bordered: true,
    size: 'middle' as const,
    scroll: { x: 1500 },
    rowSelection: {
      onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
        selectedRows.value = selectedRows
        console.log('Selected rows:', selectedRows)
      },
    },
  })

  // 分页配置
  const pageOptions = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total: number, range: [number, number]) =>
      `Showing ${range[0]}-${range[1]} of ${total} items`,
    showSizeChanger: true,
    showQuickJumper: true,
  })

  // 搜索配置
  const searchOptions = ref({
    hideSearchButton: true, // 使用自定义按钮
    formOptions: {
      layout: 'inline',
      colon: false,
    },
    colOptions: {
      span: 6,
    },
  })

  // 模拟数据请求
  const fetchData = async (params: Record<string, any>): Promise<RequestResult> => {
    console.log('Advanced fetch with params:', params)

    await new Promise((resolve) => setTimeout(resolve, 800))

    // 生成更丰富的模拟数据
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${String(i + 1).padStart(3, '0')}`,
      avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      age: Math.floor(Math.random() * 50) + 18,
      email: `user${i + 1}@example.com`,
      progress: Math.floor(Math.random() * 100),
      tags: ['VIP', 'New', 'Premium'].slice(0, Math.floor(Math.random() * 3) + 1),
      status: ['success', 'error', 'processing', 'warning'][Math.floor(Math.random() * 4)],
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    // 应用搜索和排序
    let filteredData = [...mockData]

    if (params.name) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(params.name.toLowerCase())
      )
    }

    if (params.status) {
      filteredData = filteredData.filter((item) => item.status === params.status)
    }

    // 应用排序
    if (params.sortField === 'id' && params.sortOrder) {
      filteredData.sort((a, b) => (params.sortOrder === 'ascend' ? a.id - b.id : b.id - a.id))
    }

    // 应用分页
    const start = (params.current - 1) * params.pageSize
    const end = start + params.pageSize
    const pageData = filteredData.slice(start, end)

    // 更新分页总数
    pageOptions.value.total = filteredData.length

    return {
      success: true,
      data: pageData,
      total: filteredData.length,
      message: 'Data fetched successfully',
    }
  }

  // 事件处理
  const handleManualReload = () => {
    if (tableRef.value) {
      tableRef.value.reload()
    }
  }

  const toggleSearch = () => {
    showSearch.value = !showSearch.value
  }

  const changePageSize = () => {
    pageOptions.value.pageSize = 20
    if (tableRef.value) {
      tableRef.value.reload()
    }
  }

  const handlePageChange = (event: PageChangeEvent) => {
    console.log('Page changed:', event)
    currentPage.value = event.current
    pageOptions.value.current = event.current
    pageOptions.value.pageSize = event.pageSize
  }

  const exportData = (formData: any) => {
    console.log('Exporting data with filters:', formData)
    alert(`Exporting data with filters: ${JSON.stringify(formData)}`)
  }

  const handleAdd = () => {
    console.log('Add new item')
    // 打开添加模态框
  }

  const handleBatchDelete = () => {
    if (selectedRows.value.length === 0) {
      alert('Please select items to delete')
      return
    }
    if (confirm(`Delete ${selectedRows.value.length} selected items?`)) {
      console.log('Batch delete:', selectedRows.value)
      selectedRows.value = []
      if (tableRef.value) {
        tableRef.value.reload()
      }
    }
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    console.log('Menu click:', key)
    switch (key) {
      case 'export':
        alert('Exporting all data...')
        break
      case 'import':
        alert('Import data...')
        break
      case 'settings':
        alert('Open settings...')
        break
    }
  }

  const handleEdit = (record: any) => {
    console.log('Edit:', record)
    alert(`Editing: ${record.name}`)
  }

  const handleDelete = (record: any) => {
    if (confirm(`Delete ${record.name}?`)) {
      console.log('Delete:', record)
      if (tableRef.value) {
        tableRef.value.successAndReload()
      }
    }
  }

  const handleDownload = (record: any) => {
    console.log('Download:', record)
    alert(`Downloading: ${record.name}`)
  }

  // 调试信息
  const debugInfo = computed(() => ({
    showSearch: showSearch.value,
    currentPage: currentPage.value,
    pageSize: pageOptions.value.pageSize,
    selectedRows: selectedRows.value.length,
    tableRef: !!tableRef.value,
  }))
</script>

<style scoped>
  .advanced-example {
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
  }

  .control-panel {
    margin-bottom: 20px;
    padding: 16px;
    background: #fafafa;
    border-radius: 6px;
  }

  .table-header-actions {
    margin-bottom: 16px;
    padding: 12px;
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 6px;
  }

  .custom-empty {
    padding: 40px 0;
  }

  .debug-panel {
    margin-top: 24px;
    padding: 16px;
    background: #f6f8fa;
    border-radius: 6px;
    border: 1px solid #e1e4e8;
  }

  .debug-panel h3 {
    margin-top: 0;
    color: #24292e;
  }

  .debug-panel pre {
    margin: 0;
    padding: 12px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #e1e4e8;
    font-size: 12px;
    overflow: auto;
  }
</style>
