import type { Component, VNode } from 'vue'
import type { PaginationProps, FormProps, FormItemProps } from 'ant-design-vue'

// 表格列配置
export interface TableColumn {
  /** 列标题 */
  title?: string
  /** 数据字段名 */
  dataIndex?: string
  /** 是否在表格中隐藏 */
  hideInTable?: boolean
  /** 自定义渲染函数 */
  customRender?: (params: {
    record: Record<string, any>
    text: any
    index: number
  }) => VNode | string
  /** 自定义渲染选项 */
  customRenderOption?: Record<string, any>
  /** 自定义单元格配置 */
  customCell?: () => Record<string, any>
  /** 是否可见（兼容旧版本） */
  visible?: boolean
  /** 列宽 */
  width?: number | string
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否固定 */
  fixed?: 'left' | 'right'
  /** 排序配置 */
  sorter?: boolean | ((a: any, b: any) => number)
}

// 搜索表单列配置
export interface SearchColumn {
  /** 搜索表单字段名（默认使用 dataIndex） */
  name?: string
  /** 搜索表单标签（默认使用 title） */
  label?: string
  /** 是否在搜索表单中隐藏 */
  hideInSearch?: boolean
  /** 值类型，'option' 表示操作列 */
  valueType?: string
  /** 搜索表单中的排序（数字越大越靠前） */
  order?: number
  /** 搜索表单中的自定义组件 */
  component?: Component
  /** 搜索表单组件的属性 */
  fieldProps?: Record<string, any>
  /** 搜索表单表单项的属性 */
  formItemProps?: FormItemProps
  /** 默认值 */
  defaultValue?: any
  /** 列配置选项 */
  colOptions?: Record<string, any>
  /** 是否必填 */
  required?: boolean
  /** 验证规则 */
  rules?: any[]
  /** 占位符 */
  placeholder?: string
}

// 完整的列配置（表格 + 搜索）
export interface BaseColumn extends TableColumn, SearchColumn {
  // 合并两个接口的所有属性
}

// 表格配置
export interface TableOptions {
  /** 是否隐藏分页 */
  hidePagination?: boolean
  /** Ant Design Table 的其他配置 */
  [key: string]: any
}

// 分页配置
export interface PageOptions extends Partial<PaginationProps> {
  /** 当前页码 */
  current?: number
  /** 每页大小 */
  pageSize?: number
  /** 总条数 */
  total?: number
}

// 搜索配置
export interface SearchOptions {
  /** 是否隐藏搜索按钮 */
  hideSearchButton?: boolean
  /** 表单配置 */
  formOptions?: FormProps
  /** 列配置选项 */
  colOptions?: Record<string, any>
}

// 请求函数返回类型
export interface RequestResult<T = any> {
  /** 请求是否成功 */
  success: boolean
  /** 数据列表 */
  data: T[]
  /** 总条数 */
  total: number
  /** 错误信息 */
  message?: string
}

// 请求函数类型
export type RequestFunction<T = any> = (params: Record<string, any>) => Promise<RequestResult<T>>

// ProTable Props
export interface ProTableProps<T = any> {
  /** 列配置数组 */
  columns: BaseColumn[]
  /** 数据请求函数 */
  request?: RequestFunction<T>
  /** 是否手动触发请求 */
  manualRequest?: boolean
  /** 是否显示搜索表单 */
  showSearch?: boolean
  /** 表格配置选项 */
  tableOptions?: TableOptions
  /** 分页配置选项 */
  pageOptions?: PageOptions
  /** 搜索配置选项 */
  searchOptions?: SearchOptions
}

// 分页变化事件参数
export interface PageChangeEvent {
  current: number
  pageSize: number
}

// 组件暴露的方法
export interface ProTableExposed {
  /** 刷新表格数据 */
  reload: () => Promise<void>
  /** 操作成功并刷新 */
  successAndReload: () => void
}
