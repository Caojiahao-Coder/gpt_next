<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emits = defineEmits(['onClose', 'onSubmit'])

const { t } = useI18n()

const columnsList = ref<HTMLInputElement[]>([])

const rootRef = ref<HTMLUListElement>()

const itemRefs = ref<HTMLInputElement[]>([])

function addNewColumn() {
  columnsList.value.push(document.createElement('input'))
}

function submitData() {
  const columns = itemRefs.value.map((item: any) => item.value) as string[]
  emits('onSubmit', columns)
}

function onRemoveColumn(index: number) {
  const newRef = []
  const oldRef = [...itemRefs.value]
  for (let j = 0; j < oldRef.length; j++) {
    if (j !== index)
      newRef.push(oldRef[j])
  }
  itemRefs.value = newRef
  document.getElementById(`item-${index}`)!.remove()
}
</script>

<template>
  <ul ref="rootRef" class="list-none p0 m0">
    <li v-for="(item, index) in columnsList" :id="`item-${index}`" :key="index" class="relative mt-2">
      <div class="flex flex-row">
        <input
          ref="itemRefs" type="text"
          class="flex-1 border-solid border-1 border-base m-0 p-2 bg-base b-rd outline-none color-base focus-bg-body"
          placeholder="Column name"
        >
      </div>
      <div class="w-20px h-20px icon-button right-8px top-8px absolute i-carbon-close" @click="onRemoveColumn(index)" />
    </li>
  </ul>

  <div class="flex flex-row">
    <button
      class="p2 border-base border-1 border-solid bg-body color-base b-rd mt-2 flex-1 flex gap-1 hover-bg-base"
      @click="addNewColumn"
    >
      <div class="flex-1" />
      <div class="w-24px h-24px line-height-24px m-auto i-carbon-add" />
      <div class="text-left h-24px line-height-24px">
        {{ t('add_new_columns') }}
      </div>
      <div class="flex-1" />
    </button>
  </div>

  <div class="flex flex-row-reverse gap-2 mt-6">
    <button
      class="p2 bg-base outline-none border-1 b-solid border-base color-base b-rd w-120px bg-body hover-bg-base"
      @click="() => $emit('onClose')"
    >
      {{ t('cancel') }}
    </button>
    <button
      class="p2 bg-base outline-none border-1 b-solid border-base color-base b-rd w-120px bg-body hover-bg-base"
      @click="submitData"
    >
      {{ t('submit') }}
    </button>
  </div>
</template>
