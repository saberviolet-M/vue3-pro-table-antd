<template>
  <div>{{ content }}</div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { toRefs } from 'vue'

interface DefinitionProps {
  record: Record<string, any>
  valueKey?: string
  middleware?: (value: any) => any
}

const props = withDefaults(defineProps<DefinitionProps>(), {
  record: () => ({}),
  valueKey: undefined,
  middleware: (v) => v,
})

const { record, valueKey, middleware } = toRefs(props)

const content = computed<string>(() => {
  try {
    if (!record.value || !valueKey.value) return '-'
    const value = record.value?.[valueKey.value]

    // 检查是否为空值
    if (value === '' || value === undefined || value === null) {
      return '-'
    }

    // 应用中间件处理
    const processedValue = middleware.value(value)

    // 确保返回字符串
    if (processedValue === '' || processedValue === undefined || processedValue === null) {
      return '-'
    }

    return String(processedValue)
  } catch (error) {
    console.error('Definition component error:', error)
    return '-'
  }
})
</script>
