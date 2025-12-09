/**
 * 将扁平化的表单数据转换为嵌套对象
 * 支持数组字段自动识别（如 "items,0,name" -> items[0].name）
 * @param values - 扁平化的表单数据
 * @returns 嵌套对象
 */
export const unFlattenForm = (values: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.keys(values).forEach((key) => {
    // 支持数组字段自动识别
    const parts = key.split(',');
    let cur = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // 判断是否为数组下标
      if (!isNaN(Number(part)) && i > 0) {
        const arrKey = parts[i - 1];
        if (!Array.isArray(cur[arrKey])) cur[arrKey] = [];
        if (!cur[arrKey][Number(part)]) cur[arrKey][Number(part)] = {};
        cur = cur[arrKey][Number(part)];
      } else if (i === parts.length - 1) {
        cur[part] = values[key];
      } else {
        if (!cur[part]) cur[part] = {};
        cur = cur[part];
      }
    }
  });

  // 清理数组中的空项
  function cleanArrays(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(cleanArrays);
    } else if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((k) => {
        obj[k] = cleanArrays(obj[k]);
      });

      // 如果对象的所有 key 是数字且连续，则转为数组
      const keys = Object.keys(obj);
      if (keys.length && keys.every((k) => !isNaN(Number(k)))) {
        const arr: any[] = [];
        keys.forEach((k) => {
          arr[Number(k)] = obj[k];
        });
        return arr;
      }
      return obj;
    }
    return obj;
  }

  return cleanArrays(result);
};

/**
 * 过滤空值（空字符串、null、undefined）
 * @param data - 要过滤的数据对象
 * @returns 过滤后的数据对象
 */
export const filterEmptyValues = (data: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = { ...data };

  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (value === '' || value === null || value === undefined) {
      delete result[key];
    }
  });

  return result;
};

/**
 * 防抖函数
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param fn - 要节流的函数
 * @param limit - 限制时间（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * 错误处理类
 */
export class ProTableError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ProTableError';
  }
}

/**
 * 统一的错误处理函数
 * @param error - 错误对象
 * @param context - 错误上下文
 * @returns 处理后的错误信息
 */
export const handleError = (
  error: unknown,
  context: string = 'ProTable'
): ProTableError => {
  let errorMessage = '未知错误';
  let errorCode = 'UNKNOWN_ERROR';
  let errorDetails: Record<string, any> = {};

  if (error instanceof ProTableError) {
    return error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorCode = error.name;
    errorDetails = { stack: error.stack };
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    errorMessage = (error as any).message || JSON.stringify(error);
    errorCode = (error as any).code || 'OBJECT_ERROR';
    errorDetails = error as Record<string, any>;
  }

  console.error(`[${context}]`, errorMessage, errorDetails);

  return new ProTableError(
    `${context}: ${errorMessage}`,
    errorCode,
    errorDetails
  );
};

/**
 * 安全执行函数，捕获错误并返回统一格式
 * @param fn - 要执行的函数
 * @param context - 上下文信息
 * @returns 执行结果或错误
 */
export const safeExecute = async <T>(
  fn: () => Promise<T>,
  context: string = 'ProTable'
): Promise<{ success: boolean; data?: T; error?: ProTableError }> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const proTableError = handleError(error, context);
    return { success: false, error: proTableError };
  }
};

/**
 * 验证列配置
 * @param columns - 列配置数组
 * @returns 验证结果
 */
export const validateColumns = (
  columns: any[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!Array.isArray(columns)) {
    errors.push('columns 必须是一个数组');
    return { valid: false, errors };
  }

  columns.forEach((col, index) => {
    if (!col || typeof col !== 'object') {
      errors.push(`第 ${index + 1} 列: 必须是一个对象`);
      return;
    }

    // 检查必要的字段
    if (!col.title && !col.dataIndex) {
      errors.push(`第 ${index + 1} 列: 必须提供 title 或 dataIndex`);
    }

    // 检查 dataIndex 类型
    if (col.dataIndex && typeof col.dataIndex !== 'string') {
      errors.push(`第 ${index + 1} 列: dataIndex 必须是字符串`);
    }

    // 检查 name 类型
    if (col.name && typeof col.name !== 'string') {
      errors.push(`第 ${index + 1} 列: name 必须是字符串`);
    }

    // 检查 order 类型
    if (col.order !== undefined && typeof col.order !== 'number') {
      errors.push(`第 ${index + 1} 列: order 必须是数字`);
    }

    // 检查 component 类型
    if (col.component && typeof col.component !== 'function' && typeof col.component !== 'object') {
      errors.push(`第 ${index + 1} 列: component 必须是函数或组件对象`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * 规范化列配置
 * @param columns - 原始列配置
 * @returns 规范化后的列配置
 */
export const normalizeColumns = (columns: any[]): any[] => {
  return columns.map((col) => {
    const normalized = { ...col };

    // 确保有 name（默认使用 dataIndex）
    if (!normalized.name && normalized.dataIndex) {
      normalized.name = normalized.dataIndex;
    }

    // 确保有 label（默认使用 title）
    if (!normalized.label && normalized.title) {
      normalized.label = normalized.title;
    }

    // 处理 visible 属性（兼容旧版本）
    if (normalized.visible === false && normalized.hideInTable === undefined) {
      normalized.hideInTable = true;
    }

    // 确保 fieldProps 有基本配置
    if (normalized.component && !normalized.fieldProps) {
      normalized.fieldProps = { placeholder: '请输入', allowClear: true };
    }

    return normalized;
  });
};

/**
 * 创建列配置构建器（链式调用）
 */
export class ColumnBuilder {
  private column: any = {};

  title(title: string): ColumnBuilder {
    this.column.title = title;
    return this;
  }

  dataIndex(dataIndex: string): ColumnBuilder {
    this.column.dataIndex = dataIndex;
    return this;
  }

  name(name: string): ColumnBuilder {
    this.column.name = name;
    return this;
  }

  label(label: string): ColumnBuilder {
    this.column.label = label;
    return this;
  }

  hideInSearch(hide: boolean = true): ColumnBuilder {
    this.column.hideInSearch = hide;
    return this;
  }

  hideInTable(hide: boolean = true): ColumnBuilder {
    this.column.hideInTable = hide;
    return this;
  }

  order(order: number): ColumnBuilder {
    this.column.order = order;
    return this;
  }

  component(component: any, fieldProps?: Record<string, any>): ColumnBuilder {
    this.column.component = component;
    if (fieldProps) {
      this.column.fieldProps = fieldProps;
    }
    return this;
  }

  defaultValue(value: any): ColumnBuilder {
    this.column.defaultValue = value;
    return this;
  }

  required(required: boolean = true): ColumnBuilder {
    this.column.required = required;
    return this;
  }

  rules(rules: any[]): ColumnBuilder {
    this.column.rules = rules;
    return this;
  }

  placeholder(placeholder: string): ColumnBuilder {
    if (!this.column.fieldProps) {
      this.column.fieldProps = {};
    }
    this.column.fieldProps.placeholder = placeholder;
    return this;
  }

  customRender(render: (params: any) => any): ColumnBuilder {
    this.column.customRender = render;
    return this;
  }

  width(width: number | string): ColumnBuilder {
    this.column.width = width;
    return this;
  }

  align(align: 'left' | 'center' | 'right'): ColumnBuilder {
    this.column.align = align;
    return this;
  }

  build(): any {
    return { ...this.column };
  }

  static create(): ColumnBuilder {
    return new ColumnBuilder();
  }
}