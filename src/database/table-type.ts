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
  status: 'finished' | 'waiting' | 'error' | 'stop'
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

interface TBPromptInfo {
  id: number
  title: string
  create_time: number
  is_deleted: boolean
}

interface NewPromptInfo {
  title: string
  create_time: number
  is_deleted: boolean
}

interface TBPromptDetailInfo {
  id: number
  prompt_id: number
  role: 'user' | 'system' | 'assistant'
  content: string
  is_deleted: boolean
}

interface NewPromptDetailInfo {
  prompt_id: number
  role: 'user' | 'system' | 'assistant'
  content: string
  is_deleted: boolean
}

interface TBPromptCategoryInfo {
  id: number
  title: string
  create_time: number
  is_deleted: boolean
}

interface NewPromptCategoryInfo {
  title: string
  create_time: number
  is_deleted: boolean
}

interface TBPromptCategoryListInfo {
  id: number
  category_id: number
  prompt_id: number
  create_time: number
  is_deleted: boolean
}

interface NewPromptCategoryListInfo {
  category_id: number
  prompt_id: number
  create_time: number
  is_deleted: boolean
}

export type {
  TBGlobalSettingInfo,
  TBMessageInfo,
  TBConverstationInfo,
  TBPromptInfo,
  TBPromptCategoryInfo,
  TBPromptCategoryListInfo,
  TBPromptDetailInfo,

  NewGlobalSettingInfo,
  NewConverstationInfo,
  NewMessageInfo,
  NewPromptInfo,
  NewPromptCategoryInfo,
  NewPromptCategoryListInfo,
  NewPromptDetailInfo,
}
