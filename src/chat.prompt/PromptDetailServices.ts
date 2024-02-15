import db from '@/database/db'
import type { NewPromptDetailInfo, TBPromptDetailInfo } from '@/database/table-type'

async function getPromptDetailByIdAsync(promptId: number): Promise<TBPromptDetailInfo[]> {
  return new Promise<TBPromptDetailInfo[]>((resolve) => {
    db.init().then(() => {
      db.select('tb_prompt_detail', 'prompt_id', promptId).then((result) => {
        resolve(result as TBPromptDetailInfo[])
      })
    })
  })
}

async function addPromptDetail(newData: NewPromptDetailInfo[]): Promise<boolean> {
  await db.init()

  for (const item of newData) {
    const result = await db.add('tb_prompt_detail', item)
    if (!result)
      return false
  }

  return true
}

async function deletePromptDetailByIdAsync(promptId: number): Promise<boolean> {
  await db.init()
  const detailList = await db.select('tb_prompt_detail', 'prompt_id', promptId) as TBPromptDetailInfo[]

  for (const item of detailList) {
    const result = await db.deleteById('tb_prompt_detail', item.id)
    if (!result)
      return false
  }

  return true
}

export {
  getPromptDetailByIdAsync,
  addPromptDetail,
  deletePromptDetailByIdAsync,
}
