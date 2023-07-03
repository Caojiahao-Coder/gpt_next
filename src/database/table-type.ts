interface TBGlobalSettingInfo {
  id: number,
  api_key: string,
  chat_model: string
}

interface TBMessageInfo {
  id: number,
  conversation_id: number,
  user_content: string,
  gpt_content: string,
  create_time: number,
  token_id: string,
  status: 'finished' | 'waiting'
}

interface TBConverstationInfo {
  id: number,
  title: string,
  description: string,
  color: string,
  create_time: number,
  conversation_token: string
}

interface NewGlobalSettingInfo {
  api_key: string,
  chat_model: string
}

interface NewMessageInfo {
  conversation_id: number,
  user_content: string,
  gpt_content: string,
  create_time: number,
  token_id: string,
  status: 'finished' | 'waiting'
}

interface NewConverstationInfo {
  title: string,
  description: string,
  color: string,
  create_time: number,
  conversation_token: string
}

export type {
  TBGlobalSettingInfo,
  TBMessageInfo,
  TBConverstationInfo,

  NewGlobalSettingInfo,
  NewConverstationInfo,
  NewMessageInfo
}
