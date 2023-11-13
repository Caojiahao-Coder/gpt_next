interface TBGlobalSettingInfo {
  id: number
  api_key: string
  chat_model: string
}

interface TBMessageInfo {
  id: number
  conversation_id: number
  user_content: string
  gpt_content: string
  create_time: number
  token_id: string
  status: 'finished' | 'waiting' | 'error'
  tool_call?: {
    function_name: string
    function_description: string
  }
  vision_file?: string
}

interface TBConverstationInfo {
  id: number
  title: string
  description: string
  color: string
  create_time: number
  conversation_token: string
  fixed_top?: boolean
  type?: 'chat' | 'dataworker' | 'draw_img_mode'
}

interface NewGlobalSettingInfo {
  api_key: string
  chat_model: string
}

interface NewMessageInfo {
  conversation_id: number
  user_content: string
  gpt_content: string
  create_time: number
  token_id: string
  status: 'finished' | 'waiting'
  tool_call?: {
    function_name: string
    function_description: string
  }
  vision_file?: string
}

interface NewConverstationInfo {
  title: string
  description: string
  color: string
  create_time: number
  conversation_token: string
  type?: 'chat' | 'dataworker' | 'draw_img_mode'
}

export type {
  TBGlobalSettingInfo,
  TBMessageInfo,
  TBConverstationInfo,

  NewGlobalSettingInfo,
  NewConverstationInfo,
  NewMessageInfo,
}
