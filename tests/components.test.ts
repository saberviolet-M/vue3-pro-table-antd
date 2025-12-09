import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import { ProTable } from '../src/export'

// 创建测试用的 Vue 应用
const createTestApp = (component: any, props: any = {}) => {
  const app = createApp(component, props)
  app.use(Antd)
  return app
}

describe('ProTable Components', () => {
  describe('ProTable', () => {
    it('should render with minimal props', () => {
      const wrapper = mount(ProTable, {
        props: {
          columns: [],
          request: vi.fn(),
        },
        global: {
          plugins: [Antd],
        },
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should show search form by default', () => {
      const wrapper = mount(ProTable, {
        props: {
          columns: [],
          request: vi.fn(),
        },
        global: {
          plugins: [Antd],
        },
      })

      expect(wrapper.find('.ant-form').exists()).toBe(true)
    })

    it('should hide search form when showSearch is false', () => {
      const wrapper = mount(ProTable, {
        props: {
          columns: [],
          request: vi.fn(),
          showSearch: false,
        },
        global: {
          plugins: [Antd],
        },
      })

      expect(wrapper.find('.ant-form').exists()).toBe(false)
    })
  })

  describe('ProTableSearch', () => {
    it('should render form items', async () => {
      const { default: ProTableSearch } = await import('../src/search.vue')

      const wrapper = mount(ProTableSearch, {
        props: {
          formItems: [
            { title: 'Name', dataIndex: 'name', name: 'name' },
            { title: 'Age', dataIndex: 'age', name: 'age' },
          ],
        },
        global: {
          plugins: [Antd],
        },
      })

      expect(wrapper.findAll('.ant-form-item')).toHaveLength(3) // 2 fields + search buttons
    })

    it('should hide search button when hideSearchButton is true', async () => {
      const { default: ProTableSearch } = await import('../src/search.vue')

      const wrapper = mount(ProTableSearch, {
        props: {
          formItems: [{ title: 'Name', dataIndex: 'name', name: 'name' }],
          hideSearchButton: true,
        },
        global: {
          plugins: [Antd],
        },
      })

      expect(wrapper.find('.ant-btn').exists()).toBe(false)
    })
  })

  describe('ProTableTable', () => {
    it('should render table with data', async () => {
      const { default: ProTableTable } = await import('../src/table.vue')

      const wrapper = mount(ProTableTable, {
        props: {
          dataSource: [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
          ],
          columns: [
            { title: 'ID', dataIndex: 'id' },
            { title: 'Name', dataIndex: 'name' },
          ],
          page: { current: 1, pageSize: 10, total: 2 },
        },
        global: {
          plugins: [Antd],
        },
      })

      expect(wrapper.find('.ant-table').exists()).toBe(true)
      expect(wrapper.findAll('.ant-table-row')).toHaveLength(2)
    })

    it('should hide pagination when hidePagination is true', async () => {
      const { default: ProTableTable } = await import('../src/table.vue')

      const wrapper = mount(ProTableTable, {
        props: {
          dataSource: [{ id: 1, name: 'John' }],
          columns: [{ title: 'ID', dataIndex: 'id' }],
          page: { current: 1, pageSize: 10, total: 1 },
          tableOptions: { hidePagination: true },
        },
        global: {
          plugins: [Antd],
        },
      })

      expect(wrapper.find('.ant-pagination').exists()).toBe(false)
    })
  })

  describe('ProTableDefinition', () => {
    it('should render value from record', async () => {
      const { default: ProTableDefinition } = await import('../src/definition.vue')

      const wrapper = mount(ProTableDefinition, {
        props: {
          record: { id: 1, name: 'John Doe', age: 30 },
          valueKey: 'name',
        },
      })

      expect(wrapper.text()).toBe('John Doe')
    })

    it('should show dash for empty value', async () => {
      const { default: ProTableDefinition } = await import('../src/definition.vue')

      const wrapper = mount(ProTableDefinition, {
        props: {
          record: { id: 1, name: '' },
          valueKey: 'name',
        },
      })

      expect(wrapper.text()).toBe('-')
    })

    it('should apply middleware function', async () => {
      const { default: ProTableDefinition } = await import('../src/definition.vue')

      const middleware = vi.fn((value) => `Mr. ${value}`)

      const wrapper = mount(ProTableDefinition, {
        props: {
          record: { id: 1, name: 'John' },
          valueKey: 'name',
          middleware,
        },
      })

      expect(middleware).toHaveBeenCalledWith('John')
      expect(wrapper.text()).toBe('Mr. John')
    })
  })
})