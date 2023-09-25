import db from './db'
import type { NewMessageInfo, TBConverstationInfo, TBGlobalSettingInfo, TBMessageInfo } from './table-type'

/**
 * 进度状态：waiting、processing、finished、failed
 * @param onStatusChangeListener
 */
async function exportDBFileToJson(onStatusChangeListener: (status: 'waiting' | 'processing' | 'finished' | 'failed') => void | null) {
  if (onStatusChangeListener)
    onStatusChangeListener('waiting')

  const content = await generageDBFile()

  const jsonStr = JSON.stringify(content)

  if (onStatusChangeListener)
    onStatusChangeListener('processing')

  const blob = new Blob([jsonStr], {
    type: 'application/json',
  })

  downloadFileToLocal(blob, 'db_backup_file.json')

  if (onStatusChangeListener)
    onStatusChangeListener('finished')
}

/**
 * 将文件下载到本地
 * @param blob 下载文件数据 blob格式
 * @param fileName
 */
function downloadFileToLocal(blob: Blob, fileName: string) {
  const a = document.createElement('a')
  a.download = fileName
  a.href = URL.createObjectURL(blob)
  a.click()
}

async function generageDBFile() {
  const exportData = {
    global: await db.selectAll('tb_global'),
    conversation: await db.selectAll('tb_conversation'),
    message: await db.selectAll('tb_message'),
  }
  return exportData
}

function restoreDatabase(jsonData: {
  global: TBGlobalSettingInfo[]
  conversation: TBConverstationInfo[]
  message: TBMessageInfo[]
}) {
  try {
    const globalData = jsonData.global
    const conversationData = jsonData.conversation
    const messageData = jsonData.message

    db.clear('tb_global')
    db.clear('tb_conversation')
    db.clear('tb_message')

    globalData.map(item => db.add('tb_global', item))
    conversationData.map(item => db.add('tb_conversation', item))
    messageData.map(item => db.add('tb_message', {
      conversation_id: item.conversation_id,
      user_content: item.user_content,
      gpt_content: item.gpt_content,
      create_time: item.create_time,
      token_id: item.token_id,
      status: item.status,
    } as NewMessageInfo))
    return true
  }
  catch {
    return false
  }
}

export {
  exportDBFileToJson,
  restoreDatabase,
}
