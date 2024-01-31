import db from '@/database/db'
import type { NewPromptInfo, TBPromptInfo } from '@/database/table-type'

async function getPromptListAsync(): Promise<TBPromptInfo[]> {
  return new Promise<TBPromptInfo[]>((resolve) => {
    db.init().then(() => {
      db.selectAll('tb_prompt').then((result) => {
        const data = (result as TBPromptInfo[])
          .filter(a => !a.is_deleted)

        resolve(data)
      })
    })
  })
}

async function getPromptInfoByIdAsync(promptId: number): Promise<TBPromptInfo> {
  return new Promise<TBPromptInfo>((resolve) => {
    db.init().then(() => {
      db.selectById('tb_prompt', promptId).then(result => resolve(result as TBPromptInfo))
    })
  })
}

async function addNewPromptAsync(data: NewPromptInfo): Promise<{ result: boolean;id: number }> {
  return new Promise<{ result: boolean;id: number }>((resolve) => {
    db.init().then(() => {
      db.add('tb_prompt', data).then((res) => {
        resolve({
          result: true,
          id: res as number,
        })
      }).catch(() => {
        resolve({
          result: false,
          id: -1,
        })
      })
    })
  })
}

async function deletePromptByIdAsync(promptId: number): Promise<boolean> {
  const newData = await getPromptInfoByIdAsync(promptId)
  newData.is_deleted = true
  return new Promise<boolean>((resolve) => {
    db.init().then(() => {
      db.update('tb_prompt', newData).then((res) => {
        resolve(res as boolean)
      })
    })
  })
}

async function updatePromptInfoAsync(newInfo: TBPromptInfo): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    db.init().then(() => {
      db.update('tb_prompt', newInfo).then((res) => {
        resolve(res as boolean)
      })
    })
  })
}

export {
  getPromptListAsync,
  getPromptInfoByIdAsync,
  addNewPromptAsync,
  deletePromptByIdAsync,
  updatePromptInfoAsync,
}
