<template>
  <div class="example-container">
    <h2>Basic ProTable Usage</h2>
    <ProTable
      :columns="columns"
      :request="fetchData"
      :show-search="true"
      :page-options="pageOptions"
      :search-options="searchOptions"
      @success-and-reload="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { ProTable } from '../src/export'
  import type { BaseColumn, RequestResult } from '../src/types'

  // 列配置
  const columns = ref<BaseColumn[]>([
    {
      title: 'ID',
      dataIndex: 'id',
      name: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      name: 'name',
      required: true,
      rules: [{ required: true, message: 'Please enter name' }],
      placeholder: 'Enter name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      name: 'age',
      valueType: 'number',
      fieldProps: {
        type: 'number',
        min: 0,
        max: 150,
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      name: 'email',
      hideInSearch: true, // 不在搜索表单中显示
      fieldProps: {
        type: 'email',
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      name: 'status',
      valueType: 'select',
      fieldProps: {
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Pending', value: 'pending' },
        ],
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      name: 'createdAt',
      valueType: 'date',
      hideInTable: true, // 不在表格中显示
      fieldProps: {
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      valueType: 'option',
      customRender: ({ record }: { record: any }) => {
        return [
          h('a', { onClick: () => handleEdit(record) }, 'Edit'),
          h('a', { onClick: () => handleDelete(record) }, 'Delete'),
        ]
      },
    },
  ])

  // 分页配置
  const pageOptions = ref({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'],
  })

  // 搜索配置
  const searchOptions = ref({
    hideSearchButton: false,
    formOptions: {
      layout: 'horizontal',
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
  })

  // 模拟数据请求
  const fetchData = async (params: Record<string, any>): Promise<RequestResult> => {
    console.log('Fetching data with params:', params)

    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟数据
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: Math.floor(Math.random() * 50) + 18,
      email: `user${i + 1}@example.com`,
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    }))

    // 应用搜索过滤
    let filteredData = mockData
    if (params.name) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(params.name.toLowerCase())
      )
    }
    if (params.status) {
      filteredData = filteredData.filter((item) => item.status === params.status)
    }

    // 应用分页
    const start = (params.current - 1) * params.pageSize
    const end = start + params.pageSize
    const pageData = filteredData.slice(start, end)

    return {
      success: true,
      data: pageData,
      total: filteredData.length,
      message: 'Data fetched successfully',
    }
  }

  // 事件处理
  const handleSuccess = () => {
    console.log('Operation successful, table will reload')
  }

  const handleEdit = (record: any) => {
    console.log('Edit record:', record)
    // 这里可以打开编辑模态框等
  }

  const handleDelete = (record: any) => {
    console.log('Delete record:', record)
    if (confirm(`Are you sure you want to delete ${record.name}?`)) {
      // 这里可以调用删除 API
      console.log('Record deleted:', record.id)
    }
  }
</script>

<style scoped>
  .example-container {
    padding: 24px;
    background: #f5f5f5;
    border-radius: 8px;
    margin: 20px 0;
  }

  .example-container h2 {
    margin-bottom: 20px;
    color: #1890ff;
  }
</style>
