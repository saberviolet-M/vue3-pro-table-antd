<template>
  <div>
    <a-table :dataSource="list" :columns="columns" :pagination="false" v-bind="option"> </a-table>
    <br />
    <a-row justify="end" v-if="!hidePagination">
      <a-pagination v-bind="pagination" @change="handleChangeCurrent" />
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs } from 'vue';
import type { TableProps, PaginationProps } from 'ant-design-vue';
import type { BaseColumn, TableOptions, PageChangeEvent } from './types';

const emit = defineEmits<{
  'on-change-page': [event: PageChangeEvent]
}>();

interface TableComponentProps {
  dataSource: any[]
  page: Partial<PaginationProps>
  columns: BaseColumn[]
  tableOptions: TableOptions
}

const props = withDefaults(defineProps<TableComponentProps>(), {
  dataSource: () => [],
  page: () => ({}),
  columns: () => [],
  tableOptions: () => ({}),
});
const hidePagination = computed<boolean>(() => {
  return !!props?.tableOptions?.hidePagination;
});

const pagination = reactive({
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '30', '40', '100'],
  showTotal: (total: number) => `共 ${total} 条`,
  ...toRefs(props.page),
});

// 使用 shallowRef 避免深度响应式转换
const list = computed<any[]>(() => props.dataSource);

// 缓存 tableOptions 避免每次重新计算
const option = computed<TableProps>(() => ({
  scroll: { x: true },
  bordered: false,
  ...props.tableOptions,
}));

const columns = computed<BaseColumn[]>(() => props.columns);

function handleChangeCurrent(current: number, pageSize: number): void {
  if (pageSize !== props.page.pageSize) {
    current = 1;
  }
  emit('on-change-page', { current, pageSize });
}
</script>
