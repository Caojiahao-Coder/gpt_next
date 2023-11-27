import { defineStore } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import type { NewPromptDetailInfo, NewPromptInfo, TBPromptDetailInfo, TBPromptInfo } from '@/database/table-type'
import db from '@/database/db'

const usePromptStore = defineStore('promptStore', () => {
  const promptList = ref<TBPromptInfo[]>([])
  const currentPrompt = ref<TBPromptInfo | null>(null)
  const promptDetail = ref<TBPromptDetailInfo[]>([])

  const userUsePrompt = ref<TBPromptInfo>()

  onMounted(() => {
    loadPromptList()
  })

  watch(promptList, (newVal) => {
    if (newVal.length > 0) {
      currentPrompt.value = newVal[0]
      loadPromptDetailById(newVal[0].id)
    }
    else { currentPrompt.value = null }
  })

  watch(currentPrompt, async (newVal) => {
    if (newVal)
      promptDetail.value = await loadPromptDetailById(newVal.id)
  })

  function loadPromptDetailById(id: number): Promise<TBPromptDetailInfo[]> {
    // eslint-disable-next-line promise/param-names
    return new Promise<TBPromptDetailInfo[]>((reslove) => {
      db.init().then(() => {
        db.select('tb_prompt_detail', 'prompt_id', id).then((res) => {
          promptDetail.value = res as TBPromptDetailInfo[]
          reslove(res as TBPromptDetailInfo[])
        })
      })
    })
  }

  function loadPromptList() {
    db.init().then(() => {
      db.selectAll('tb_prompt').then((result) => {
        const data = result as TBPromptInfo[]
        promptList.value = data.filter(a => a.is_deleted !== true).reverse()

        if (data.length > 0)
          currentPrompt.value = data[0]
      })
    })
  }

  function addNewPrompt(data: NewPromptInfo): Promise<number> {
    // eslint-disable-next-line promise/param-names
    return new Promise<number>((reslove) => {
      db.init().then(() => {
        db.add('tb_prompt', data).then((res) => {
          loadPromptList()
          reslove(res as number)
        }).catch(() => {
          reslove(-1)
        })
      })
    })
  }

  function clearPromptDetailById(id: number): Promise<boolean> {
    // eslint-disable-next-line promise/param-names
    return new Promise<boolean>((reslove) => {
      db.init().then(() => {
        // get all detail by prompt id
        db.select('tb_prompt_detail', 'prompt_id', id).then((res) => {
          const data = res as TBPromptDetailInfo[]
          data.map(item =>
            db.deleteById('tb_prompt_detail', item.id).then(() => {
            }).catch(() => reslove(false)),
          )
          reslove(true)
        })
      })
    })
  }

  function addPromptDetail(data: NewPromptDetailInfo[]): Promise<boolean> {
    // eslint-disable-next-line promise/param-names
    return new Promise<boolean>((reslove) => {
      db.init().then(() => {
        data.map(item =>
          db.add('tb_prompt_detail', item).then(() => {
            loadPromptList()
            reslove(true)
          }).catch(() => reslove(false)),
        )
      })
    })
  }

  function deletePromptById(key: number): Promise<boolean> {
    // eslint-disable-next-line promise/param-names
    return new Promise<boolean>((reslove) => {
      db.init().then(() => {
        db.deleteById('tb_prompt', key).then(() => {
          loadPromptList()
          reslove(true)
        }).catch(() => {
          reslove(false)
        })
      })
    })
  }

  function updatePromptInfo(data: TBPromptInfo): Promise<boolean> {
    // eslint-disable-next-line promise/param-names
    return new Promise<boolean>((reslove) => {
      db.init().then(() => {
        db.update('tb_prompt', data).then(() => {
          loadPromptList()
          reslove(true)
        }).catch(() => {
          reslove(false)
        })
      })
    })
  }

  return {
    promptList,
    currentPrompt,
    promptDetail,
    userUsePrompt,

    addNewPrompt,
    loadPromptList,
    deletePromptById,
    updatePromptInfo,
    addPromptDetail,
    clearPromptDetailById,
    loadPromptDetailById,
  }
})

export default usePromptStore
