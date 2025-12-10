import { config } from '@vue/test-utils'
import { expect, vi } from 'vitest'

// 配置 JSDOM 全局变量
if (typeof window !== 'undefined') {
  // 解决 window.matchMedia 问题
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // 解决 window.computedStyle 问题
  Object.defineProperty(window, 'getComputedStyle', {
    writable: true,
    value: () => ({
      getPropertyValue: (prop: string) => {
        if (prop === 'width') return '100px'
        if (prop === 'height') return '100px'
        return ''
      },
    }),
  })

  // 解决 document.body.style 问题
  Object.defineProperty(document.body, 'style', {
    writable: true,
    value: {
      width: '100px',
      height: '100px',
      overflow: '',
    },
  })

  // 添加其他必要的浏览器 API
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  })

  Object.defineProperty(window, 'resizeTo', {
    writable: true,
    value: vi.fn(),
  })
}

// 配置 Vue Test Utils
config.global.stubs = {
  // 添加全局 stub
  // 注释掉 ant-design-vue 组件的 stub，让它们能够正常渲染
  // 'a-table': true,
  // 'a-form': true,
  // 'a-row': true,
  // 'a-col': true,
  // 'a-button': true,
  // 'a-input': true,
  // 'a-select': true,
  // 'a-pagination': true,
  // 'a-spin': true,
  // 'a-empty': true,
}

// 添加自定义匹配器
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
})
