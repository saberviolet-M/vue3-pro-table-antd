<template>
  <div>
    <a-form
      ref="formRef"
      :model="formState"
      autocomplete="off"
      v-bind="Object.assign({ labelCol: { span: 6 } }, formOptions)"
    >
      <a-row :gutter="24">
        <template v-for="item in formItems" :key="item.name || item.dataIndex">
          <a-col
            v-bind="Object.assign({}, GRID_CONFIG, colOptions, item?.colOptions ?? {})"
            :style="item.hideInSearch ? { display: 'none' } : {}"
          >
            <a-form-item
              :label="item.label"
              :name="item.name || item.dataIndex"
              v-bind="item.formItemProps || {}"
            >
              <component
                :is="item.component || Input"
                v-model:value="formState[item.name || item.dataIndex || '']"
                v-bind="item.fieldProps || { placeholder: '请输入', allowClear: true }"
              />
            </a-form-item>
          </a-col>
        </template>
        <a-col flex="1">
          <a-form-item v-if="!hideSearchButton">
            <a-row justify="end">
              <a-space>
                <slot :submit="handleSearch" :reset="handleReset" :form="formState">
                  <a-button type="primary" @click="handleSearch">搜索</a-button>
                  <a-button @click="handleReset">重置</a-button>
                </slot>
              </a-space>
            </a-row>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { FormInstance, FormProps } from 'ant-design-vue'
  import { Input, message } from 'ant-design-vue'
  import { unFlattenForm, filterEmptyValues, safeExecute } from './utils'
  import type { BaseColumn } from './types'

  interface SearchComponentProps {
    formItems: BaseColumn[]
    hideSearchButton?: boolean
    formOptions?: FormProps
    colOptions?: Record<string, any>
    form?: Record<string, any>
  }

  const props = withDefaults(defineProps<SearchComponentProps>(), {
    formItems: () => [],
    hideSearchButton: false,
    formOptions: () => ({}),
    colOptions: () => ({}),
    form: () => ({}),
  })

  const emit = defineEmits<{
    search: [data: Record<string, any>]
    change: [data: Record<string, any>]
    'update:form': [data: Record<string, any>]
  }>()

  const formState = ref<Record<string, any>>({})
  const formRef = ref<FormInstance | null>(null)
  const GRID_CONFIG: Record<string, number> = {
    sm: 12,
    xl: 8,
    xxl: 6,
  }

  const initFormState = (): void => {
    if (formRef.value?.resetFields) {
      formRef.value.resetFields()
    }
    const state: Record<string, any> = {}
    let defaultFn = false
    props.formItems.forEach((item) => {
      // 只有当 defaultValue 属性存在时才设置值
      // 使用 hasOwnProperty 检查，避免将 undefined 显式设置为 undefined
      if (Object.prototype.hasOwnProperty.call(item, 'defaultValue')) {
        state[item.name || item.dataIndex || ''] = item.defaultValue
        defaultFn = true
      }
    })
    formState.value = state
    if (defaultFn) {
      emit('update:form', formState.value)
    }
  }

  initFormState()
  watch(() => props.formItems, initFormState)

  // 监听表单数据变化，触发 change 事件
  // 使用防抖减少触发频率
  import { debounce } from './utils'

  const emitChangeDebounced = debounce((val: Record<string, any>) => {
    emit('change', val)
  }, 300)

  watch(
    formState,
    (val) => {
      emitChangeDebounced(val)
    },
    { deep: true }
  )

  const handleSearch = async (): Promise<void> => {
    const result = await safeExecute(async () => {
      let data: Record<string, any>

      if (formRef.value?.validate) {
        const params = await formRef.value.validate()
        data = unFlattenForm(params)
      } else {
        data = { ...formState.value }
      }

      // 使用工具函数过滤空值
      data = filterEmptyValues(data)
      return data
    }, 'Search.handleSearch')

    if (result.success && result.data) {
      emit('search', result.data)
    } else if (result.error) {
      // 表单验证错误不显示全局提示，由表单组件自己处理
      if (result.error.code !== 'ValidationError') {
        message.error({
          content: `搜索失败: ${result.error.message}`,
          duration: 3,
        })
      }
      // 仍然抛出错误以便外部捕获
      throw result.error
    }
  }

  const handleReset = (): void => {
    initFormState()
    handleSearch()
  }

  interface SearchExposed {
    formRef: FormInstance | null
  }

  defineExpose<SearchExposed>({
    get formRef() {
      return formRef.value
    },
  })
</script>
