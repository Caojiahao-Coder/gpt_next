<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  role: string
  content: string
}>()

const emits = defineEmits(['onRemove', 'onRoleChange', 'onContentChange'])

const { t } = useI18n()

function onContentInput(event: Event) {
  const textarea = event.target as HTMLTextAreaElement

  textarea.style.height = 'auto' // 先将高度设置为auto，以便重新计算高度
  textarea.style.height = `${textarea.scrollHeight}px` // 根据内容的高度调整textarea的高度

  emits('onContentChange', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="flex flex-row b-1 border-base b-solid p-2 b-rd gap-2">
    <select
      class="b-1 border-base b-solid w-100px p-2 b-rd bg-base focus-bg-body color-base h-40px" :value="role"
      @input="$emit('onRoleChange', ($event.target as HTMLSelectElement).value)"
    >
      <option value="system">
        System
      </option>

      <option value="user">
        User
      </option>

      <option value="assistant">
        Assistant
      </option>
    </select>
    <textarea
      :value="content"
      class="outline-none b-1 text-4 border-base b-solid flex-1 p-2 b-rd bg-base focus-bg-body color-base min-h-20px resize-none"
      :placeholder="t('please_input_prompt_message')" @input="(e) => onContentInput(e)"
    />

    <div class="b-1 b-solid border-base b-rd w-36px h-36px hover-bg-body" @click="$emit('onRemove')">
      <div class="color-red w-24px h-24px m-6px i-carbon-trash-can" />
    </div>
  </div>
</template>
