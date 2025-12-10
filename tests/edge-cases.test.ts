import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Antd from 'ant-design-vue'
import { ProTable } from '../src/export'

describe('ProTable Edge Cases', () => {
  describe('Request Function Handling', () => {
    it('should handle request function returning empty data', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        success: true,
        data: [],
        total: 0,
      })

      const wrapper = mount(ProTable, {
        props: {
          columns: [{ title: 'Name', dataIndex: 'name' }],
          request: mockRequest,
          manualRequest: false,
        },
        global: {
          plugins: [Antd],
        },
      })

      // 等待初始请求完成
      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(mockRequest).toHaveBeenCalled()
      expect(wrapper.find('.ant-table-empty').exists()).toBe(true)
    })

    it('should handle request function throwing error', async () => {
      const mockRequest = vi.fn().mockRejectedValue(new Error('Network error'))

      const _wrapper = mount(ProTable, {
        props: {
          columns: [{ title: 'Name', dataIndex: 'name' }],
          request: mockRequest,
          manualRequest: false,
        },
        global: {
          plugins: [Antd],
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(mockRequest).toHaveBeenCalled()
    })

    it('should handle manual request mode', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        success: true,
        data: [{ id: 1, name: 'Test' }],
        total: 1,
      })

      const wrapper = mount(ProTable, {
        props: {
          columns: [{ title: 'Name', dataIndex: 'name' }],
          request: mockRequest,
          manualRequest: true,
        },
        global: {
          plugins: [Antd],
        },
      })

      // 初始不应该调用
      expect(mockRequest).not.toHaveBeenCalled()

      // 手动触发 reload
      await wrapper.vm.reload()
      expect(mockRequest).toHaveBeenCalled()
    })
  })

  describe('Column Configuration', () => {
    it('should handle columns with customRender', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        success: true,
        data: [{ id: 1, name: 'John' }],
        total: 1,
      })

      const wrapper = mount(ProTable, {
        props: {
          columns: [
            {
              title: 'Name',
              dataIndex: 'name',
              customRender: ({ text }: { text: string }) => `Hello ${text}`,
            },
          ],
          request: mockRequest,
        },
        global: {
          plugins: [Antd],
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(wrapper.find('.ant-table').exists()).toBe(true)
    })

    it('should handle columns with hideInTable', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        success: true,
        data: [{ id: 1, name: 'John', age: 30 }],
        total: 1,
      })

      const wrapper = mount(ProTable, {
        props: {
          columns: [
            { title: 'ID', dataIndex: 'id' },
            { title: 'Name', dataIndex: 'name', hideInTable: true },
            { title: 'Age', dataIndex: 'age' },
          ],
          request: mockRequest,
        },
        global: {
          plugins: [Antd],
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 100))
      // 应该只显示 ID 和 Age 列
      const headers = wrapper.findAll('.ant-table-thead th')
      expect(headers).toHaveLength(2) // ID 和 Age
    })

    it('should handle columns with hideInSearch', async () => {
      const wrapper = mount(ProTable, {
        props: {
          columns: [
            { title: 'ID', dataIndex: 'id', name: 'id' },
            { title: 'Name', dataIndex: 'name', name: 'name', hideInSearch: true },
            { title: 'Age', dataIndex: 'age', name: 'age' },
          ],
          request: vi.fn(),
          showSearch: true,
        },
        global: {
          plugins: [Antd],
        },
      })

      // 搜索表单应该只显示 ID 和 Age 字段
      const formItems = wrapper.findAll('.ant-form-item')
      expect(formItems.length).toBeLessThanOrEqual(3) // ID + Age + 搜索按钮
    })
  })

  describe('Pagination', () => {
    it('should handle page change', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        success: true,
        data: Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` })),
        total: 100,
      })

      const wrapper = mount(ProTable, {
        props: {
          columns: [{ title: 'Name', dataIndex: 'name' }],
          request: mockRequest,
          pageOptions: {
            current: 1,
            pageSize: 20,
            total: 100,
          },
        },
        global: {
          plugins: [Antd],
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 100))

      // 模拟点击第二页
      const paginationItems = wrapper.findAll('.ant-pagination-item')
      if (paginationItems.length > 1) {
        await paginationItems[1].trigger('click')
        // 请求应该被调用两次（初始 + 分页）
        expect(mockRequest).toHaveBeenCalledTimes(2)
      }
    })

    it('should handle custom pageSize', async () => {
      const mockRequest = vi.fn().mockImplementation((params) => {
        expect(params.pageSize).toBe(50)
        return Promise.resolve({
          success: true,
          data: Array.from({ length: 50 }, (_, i) => ({ id: i + 1 })),
          total: 100,
        })
      })

      const _wrapper = mount(ProTable, {
        props: {
          columns: [{ title: 'ID', dataIndex: 'id' }],
          request: mockRequest,
          pageOptions: {
            pageSize: 50,
          },
        },
        global: {
          plugins: [Antd],
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(mockRequest).toHaveBeenCalled()
    })
  })

  describe('Form Validation', () => {
    it('should handle form validation before request', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        success: true,
        data: [],
        total: 0,
      })

      const wrapper = mount(ProTable, {
        props: {
          columns: [
            {
              title: 'Name',
              dataIndex: 'name',
              name: 'name',
              required: true,
              rules: [{ required: true, message: '请输入姓名' }],
            },
          ],
          request: mockRequest,
          showSearch: true,
        },
        global: {
          plugins: [Antd],
        },
      })

      // 尝试搜索而不填写必填字段
      const searchButton = wrapper.find('button[type="primary"]')
      await searchButton.trigger('click')

      // 请求不应该被调用，因为表单验证失败
      expect(mockRequest).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid column configuration', () => {
      // 测试无效的列配置
      const wrapper = mount(ProTable, {
        props: {
          columns: [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - 故意测试无效配置
            { invalidProp: 'test' },
          ],
          request: vi.fn(),
        },
        global: {
          plugins: [Antd],
        },
      })

      // 组件应该仍然渲染
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle missing dataIndex in columns', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        success: true,
        data: [{ id: 1, name: 'Test' }],
        total: 1,
      })

      const wrapper = mount(ProTable, {
        props: {
          columns: [
            { title: 'ID' }, // 没有 dataIndex
            { title: 'Name', dataIndex: 'name' },
          ],
          request: mockRequest,
        },
        global: {
          plugins: [Antd],
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(wrapper.find('.ant-table').exists()).toBe(true)
    })
  })
})
