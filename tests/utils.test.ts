import { describe, it, expect, vi } from 'vitest'
import {
  unFlattenForm,
  filterEmptyValues,
  debounce,
  throttle,
  ProTableError,
  handleError,
  safeExecute,
  validateColumns,
  normalizeColumns,
  ColumnBuilder,
} from '../src/utils'

describe('utils', () => {
  describe('unFlattenForm', () => {
    it('should flatten simple object', () => {
      const input = { 'name': 'John', 'age': '30' }
      const result = unFlattenForm(input)
      expect(result).toEqual({ name: 'John', age: '30' })
    })

    it('should handle nested objects', () => {
      const input = { 'user,name': 'John', 'user,age': '30' }
      const result = unFlattenForm(input)
      expect(result).toEqual({ user: { name: 'John', age: '30' } })
    })

    it('should handle arrays', () => {
      const input = { 'items,0,name': 'Item1', 'items,1,name': 'Item2' }
      const result = unFlattenForm(input)
      expect(result).toEqual({ items: [{ name: 'Item1' }, { name: 'Item2' }] })
    })
  })

  describe('filterEmptyValues', () => {
    it('should filter empty strings', () => {
      const input = { name: 'John', age: '', city: 'NYC' }
      const result = filterEmptyValues(input)
      expect(result).toEqual({ name: 'John', city: 'NYC' })
    })

    it('should filter null and undefined', () => {
      const input = { name: 'John', age: null, city: undefined, country: 'USA' }
      const result = filterEmptyValues(input)
      expect(result).toEqual({ name: 'John', country: 'USA' })
    })

    it('should keep zero and false', () => {
      const input = { count: 0, active: false, name: 'John' }
      const result = filterEmptyValues(input)
      expect(result).toEqual({ count: 0, active: false, name: 'John' })
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      await new Promise(resolve => setTimeout(resolve, 150))
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('ProTableError', () => {
    it('should create error with message', () => {
      const error = new ProTableError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('ProTableError')
    })

    it('should create error with code and details', () => {
      const details = { foo: 'bar' }
      const error = new ProTableError('Test error', 'TEST_CODE', details)
      expect(error.code).toBe('TEST_CODE')
      expect(error.details).toEqual(details)
    })
  })

  describe('handleError', () => {
    it('should handle Error instance', () => {
      const originalError = new Error('Original error')
      const result = handleError(originalError, 'Test')
      expect(result).toBeInstanceOf(ProTableError)
      expect(result.message).toBe('Test: Original error')
    })

    it('should handle string error', () => {
      const result = handleError('String error', 'Test')
      expect(result.message).toBe('Test: String error')
    })

    it('should handle object error', () => {
      const error = { message: 'Object error', code: 'OBJ_ERROR' }
      const result = handleError(error, 'Test')
      expect(result.message).toBe('Test: Object error')
      expect(result.code).toBe('OBJ_ERROR')
    })
  })

  describe('safeExecute', () => {
    it('should return success result', async () => {
      const fn = vi.fn().mockResolvedValue('success')
      const result = await safeExecute(fn, 'Test')
      expect(result.success).toBe(true)
      expect(result.data).toBe('success')
      expect(result.error).toBeUndefined()
    })

    it('should return error result', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Failed'))
      const result = await safeExecute(fn, 'Test')
      expect(result.success).toBe(false)
      expect(result.data).toBeUndefined()
      expect(result.error).toBeInstanceOf(ProTableError)
    })
  })

  describe('validateColumns', () => {
    it('should validate valid columns', () => {
      const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Name', dataIndex: 'name' },
      ]
      const result = validateColumns(columns)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid columns', () => {
      const columns = [
        { hideInSearch: true }, // Missing title and dataIndex
        { title: 'Test', dataIndex: 123 }, // dataIndex should be string
      ]
      const result = validateColumns(columns)
      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(2)
    })

    it('should reject non-array input', () => {
      const result = validateColumns({} as any)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('columns 必须是一个数组')
    })
  })

  describe('normalizeColumns', () => {
    it('should add missing name from dataIndex', () => {
      const columns = [{ title: 'ID', dataIndex: 'id' }]
      const result = normalizeColumns(columns)
      expect(result[0].name).toBe('id')
    })

    it('should add missing label from title', () => {
      const columns = [{ title: 'User ID', dataIndex: 'id' }]
      const result = normalizeColumns(columns)
      expect(result[0].label).toBe('User ID')
    })

    it('should handle visible property', () => {
      const columns = [{ title: 'ID', dataIndex: 'id', visible: false }]
      const result = normalizeColumns(columns)
      expect(result[0].hideInTable).toBe(true)
    })
  })

  describe('ColumnBuilder', () => {
    it('should build column with chain calls', () => {
      const column = ColumnBuilder.create()
        .title('User ID')
        .dataIndex('id')
        .hideInSearch(true)
        .width(100)
        .align('center')
        .build()

      expect(column).toEqual({
        title: 'User ID',
        dataIndex: 'id',
        hideInSearch: true,
        width: 100,
        align: 'center',
      })
    })

    it('should set component with fieldProps', () => {
      const MockComponent = {}
      const column = ColumnBuilder.create()
        .title('Status')
        .dataIndex('status')
        .component(MockComponent, { placeholder: 'Select status' })
        .build()

      expect(column.component).toBe(MockComponent)
      expect(column.fieldProps).toEqual({ placeholder: 'Select status' })
    })

    it('should set validation rules', () => {
      const column = ColumnBuilder.create()
        .title('Email')
        .dataIndex('email')
        .required(true)
        .rules([{ required: true, message: 'Email is required' }])
        .build()

      expect(column.required).toBe(true)
      expect(column.rules).toHaveLength(1)
    })
  })
})