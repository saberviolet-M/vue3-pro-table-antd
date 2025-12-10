<template>
  <div>
    <h2>ProTable 基本功能测试</h2>
    <ProTable
      ref="tableRef"
      :columns="testColumns"
      :request="mockRequest"
      :table-options="{ rowKey: 'id' }"
      :page-options="{ pageSize: 5 }"
    />
  </div>
</template>

<script setup lang="ts">
  import { ProTable, ColumnBuilder } from './export'

  // 测试数据
  const mockData = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: Math.floor(Math.random() * 50) + 18,
    status: i % 3,
    createTime: new Date(Date.now() - i * 86400000).toISOString(),
  }))

  // 使用构建器创建测试列配置
  const testColumns = [
    ColumnBuilder.create()
      .title('ID')
      .dataIndex('id')
      .hideInSearch(true)
      .width(80)
      .align('center')
      .build(),

    ColumnBuilder.create()
      .title('姓名')
      .dataIndex('name')
      .name('name')
      .order(1)
      .required(true)
      .placeholder('请输入姓名')
      .width(150)
      .build(),

    ColumnBuilder.create()
      .title('年龄')
      .dataIndex('age')
      .name('age')
      .width(100)
      .align('center')
      .build(),

    ColumnBuilder.create()
      .title('状态')
      .dataIndex('status')
      .name('status')
      .width(120)
      .customRender(({ record }) => {
        const statusMap = {
          0: { text: '禁用', color: 'red' },
          1: { text: '启用', color: 'green' },
          2: { text: '待审核', color: 'orange' },
        }
        const status = statusMap[record.status as keyof typeof statusMap] || {
          text: '未知',
          color: 'gray',
        }
        return `<span style="color: ${status.color}">${status.text}</span>`
      })
      .build(),

    ColumnBuilder.create()
      .title('创建时间')
      .dataIndex('createTime')
      .hideInSearch(true)
      .width(180)
      .customRender(({ record }) => {
        return new Date(record.createTime).toLocaleString()
      })
      .build(),
  ]

  // 模拟请求函数
  const mockRequest = async (params: Record<string, any>) => {
    console.log('请求参数:', params)

    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    const { page_num = 1, page_size = 10, name, age, status } = params

    // 过滤数据
    let filteredData = [...mockData]
    if (name) {
      filteredData = filteredData.filter((item) => item.name.includes(name))
    }
    if (age) {
      filteredData = filteredData.filter((item) => item.age === Number(age))
    }
    if (status !== undefined) {
      filteredData = filteredData.filter((item) => item.status === Number(status))
    }

    // 分页
    const start = (page_num - 1) * page_size
    const end = start + page_size
    const pageData = filteredData.slice(start, end)

    return {
      success: true,
      data: pageData,
      total: filteredData.length,
    }
  }
</script>

<style scoped>
  h2 {
    margin-bottom: 20px;
    color: #333;
  }
</style>
