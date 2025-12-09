<template>
  <div>
    <CustomSearch
      v-if="showSearch"
      :formItems="computedFormItems"
      @search="submit"
      ref="customSearchRef"
      @change="(val) => $emit('change', val)"
      v-bind="searchOptions"
      v-model:form="state.form"
    />
    <div>
      <slot name="tool"> </slot>
    </div>
    <CustomTable
      :page="state.page"
      :columns="computedColumns"
      :dataSource="state.list"
      :tableOptions="tableOptions"
      @on-change-page="handleChangePage"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, h, toRaw, ref, nextTick, withDefaults, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import type { VNode } from 'vue';

import CustomSearch from './search.vue';
import CustomTable from './table.vue';
import CustomWhaleDefinition from './definition.vue';
import { orderBy } from 'lodash';
import { safeExecute, ProTableError, validateColumns, normalizeColumns } from './utils';
import type {
  BaseColumn,
  ProTableProps,
  PageChangeEvent,
  ProTableExposed,
  RequestResult
} from './types';

const commonCustomCellStyle = { whiteSpace: 'nowrap', minWidth: '100px' };

// 配置验证
const validateConfig = (): void => {
  // 验证列配置
  const validation = validateColumns(props.columns);
  if (!validation.valid) {
    console.warn('ProTable 列配置验证失败:', validation.errors);
    // 开发环境下可以抛出错误
    if (process.env.NODE_ENV === 'development') {
      throw new ProTableError(
        `列配置验证失败: ${validation.errors.join('; ')}`,
        'CONFIG_VALIDATION_FAILED'
      );
    }
  }

  // 验证 request 函数
  if (!props.request && !props.manualRequest) {
    console.warn('ProTable: request 函数未提供，且 manualRequest 为 false，组件将无法加载数据');
  }
};

const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  manualRequest: false,
  request: undefined,
  tableOptions: () => ({
    hidePagination: false,
  }),
  pageOptions: () => ({}),
  showSearch: true,
  searchOptions: () => ({
    hideSearchButton: false,
    formOptions: {},
    colOptions: {},
  }),
});
// 规范化列配置
const normalizedColumns = computed<BaseColumn[]>(() => {
  return normalizeColumns(props.columns);
});

// 计算属性：处理visible状态，将visible: false的列设置为hideInTable: true
const visibleColumns = computed<BaseColumn[]>(() => {
  return normalizedColumns.value.map((col) => {
    const { visible, ...rest } = col;
    // 如果visible为false，设置hideInTable为true（如果未设置）
    if (visible === false && rest.hideInTable === undefined) {
      return { ...rest, hideInTable: true };
    }
    return rest;
  });
});

// 使用记忆化优化计算属性
const computedFormItems = computed(() => {
  // 先过滤，再根据 order 降序排列（数字越大越靠前）
  const filtered = visibleColumns.value.filter(
    (col: BaseColumn) => col.hideInSearch !== true && col.valueType !== 'option',
  );
  const ordered = orderBy(filtered, [(col: BaseColumn) => col.order ?? 0], ['desc']);
  return ordered.map((col) => ({
    ...col,
    label: col.label || col.title,
    name: col.name || col.dataIndex,
  }));
});

const computedColumns = computed(() => {
  return visibleColumns.value
    .filter((col) => !col.hideInTable)
    .map((col) => {
      // 避免直接修改原始对象
      const column = { ...col };

      if (!column.customCell) {
        column.customCell = () => ({
          style: commonCustomCellStyle,
          ...(column.customRenderOption || {})
        });
      }

      if (column.customRender) {
        return column;
      }

      return {
        ...column,
        customRender: ({ record }: { record: Record<string, any> }) =>
          h(CustomWhaleDefinition, {
            record,
            valueKey: column.dataIndex,
            ...(column.customRenderOption || {})
          }),
      };
    });
});

interface ProTableState {
  form: Record<string, any>
  page: {
    current: number
    pageSize: number
    total: number
  }
  list: any[]
}

const state = reactive<ProTableState>({
  form: {},
  page: {
    current: 1,
    pageSize: 10,
    total: 0,
    ...props.pageOptions,
  },
  list: [],
});

const params = computed<Record<string, any>>(() => {
  return {
    ...state.form,
    page_num: state.page.current,
    page_size: state.page.pageSize,
  };
});

const customSearchRef = ref<InstanceType<typeof CustomSearch> | null>(null);
const reload = async (): Promise<void> => {
  if (!props.request) {
    console.warn('ProTable: request function is not provided');
    return;
  }

  const result = await safeExecute(async () => {
    // 验证表单（如果有）
    await customSearchRef?.value?.formRef?.validate?.();

    // 执行请求
    const res = await props.request(toRaw(params.value));

    if (!res) {
      throw new ProTableError('请求返回为空', 'REQUEST_EMPTY');
    }

    if (!res.success) {
      throw new ProTableError(
        res.message || '请求失败',
        'REQUEST_FAILED',
        { response: res }
      );
    }

    return res;
  }, 'ProTable.reload');

  if (result.success && result.data) {
    state.list = result.data.data || [];
    state.page.total = result.data.total || 0;
  } else if (result.error) {
    // 显示错误信息给用户
    message.error({
      content: `加载失败: ${result.error.message}`,
      duration: 3,
    });

    // 清空数据
    state.list = [];
    state.page.total = 0;

    // 抛出错误以便外部捕获
    throw result.error;
  }
};

const submit = (data: Record<string, any> = {}): void => {
  state.form = data;
  state.page.current = 1;
  reload();
};

const handleChangePage = ({ current, pageSize }: PageChangeEvent): void => {
  state.page.current = current;
  state.page.pageSize = pageSize;
  reload();
};

const successAndReload = (): void => {
  message.success({
    content: '操作成功',
  });
  reload();
};

// 组件挂载时验证配置
onMounted(() => {
  validateConfig();
});

if (!props.manualRequest) {
  // 确保 columns 中 存在defaultValue属性的字段能 正确参与首次请求
  nextTick(() => {
    reload();
  });
}

defineExpose<ProTableExposed>({
  reload,
  successAndReload,
});
</script>
