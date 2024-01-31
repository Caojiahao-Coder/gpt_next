import db from '@/database/db'
import type { NewConverstationInfo, TBConverstationInfo } from '@/database/table-type'

async function getConversationList(): Promise<TBConverstationInfo[]> {
  return new Promise<TBConverstationInfo[]>((resolve) => {
    db.init().then(() => {
      db.selectAll('tb_conversation').then((res) => {
        resolve(res as TBConverstationInfo[])
      })
    })
  })
}

async function addNewConversationAsync(info: NewConverstationInfo): Promise<{
  result: boolean
  id: number
}> {
  return new Promise<{
    result: boolean
    id: number
  }>((resolve) => {
    db.init().then(() => {
      db.add('tb_conversation', info).then((res) => {
        resolve({
          result: true,
          id: res as number,
        })
      }).catch((e) => {
        resolve({
          result: false,
          id: -1,
        })
      })
    })
  })
}

async function getConversationByIdAsync(id: number): Promise<TBConverstationInfo> {
  return new Promise<TBConverstationInfo>((resolve) => {
    db.init().then(() => {
      db.selectById('tb_conversation', id).then((res) => {
        resolve(res as TBConverstationInfo)
      })
    })
  })
}

async function removeConversationByIdAsync(conversationId: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    db.init().then(() => {
      db.deleteById('tb_conversation', conversationId).then((res) => {
        resolve(res as boolean)
      })
    })
  })
}

async function updateConversationInfoAsync(info: TBConverstationInfo): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    db.init().then(() => {
      db.update('tb_conversation', info).then(res => resolve(res as boolean))
    })
  })
}

export {
  getConversationList,
  getConversationByIdAsync,
  addNewConversationAsync,
  removeConversationByIdAsync,
  updateConversationInfoAsync,
}
