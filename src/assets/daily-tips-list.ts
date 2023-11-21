const DailyTipsList_EN: {
  title: string
  description: string
  photo?: string
}[] = [
  {
    title: 'Multi-media input box',
    description: 'Multi-media input box, you can directly paste the image in the system clipboard into the input box, thereby enabling the system\'s Vision API.',
    photo: '/MultimediaInputBox',
  },
  {
    title: 'Multi-sensory experience',
    description: 'Through the built-in text-to-speech technology of GPT Next, you can directly convert text to speech, thereby achieving multi-sensory experience.',
    photo: '/Speech',
  },
  {
    title: 'Supported Function Calling feature',
    description: 'GPT Next will automatically check whether the current conversation supports Function Calling. If it does, it will query the network data according to the pre-set API.',
    photo: '/Function_Calling',
  },
  {
    title: 'Supported DALL·E feature',
    description: 'GPT Next supports the image generation function based on DALL·E. You can generate corresponding images by entering text.',
    photo: '/DrawImageMode',
  },
]

const DailyTipsList_CN: {
  title: string
  description: string
  photo?: string
}[] = [
  {
    title: '多媒体输入框',
    description: '多媒体输入框，您可以通过系统剪切板中的图片直接粘贴在输入框中，从而启用系统的Vision API。',
    photo: '/MultimediaInputBox',
  },
  {
    title: '多感官体验',
    description: '通过GPT Next内置的文字转语音技术，您可以直接将文字转换为语音，从而实现多感官体验。',
    photo: '/Speech',
  },
  {
    title: '支持Function Calling功能',
    description: 'GPT Next会自动检查当前的对话是否支持Function Calling，如果支持会根据提前设定好的API进行联网数据查询。',
    photo: '/Function_Calling',
  },
  {
    title: '支持DALL·E功能',
    description: 'GPT Next支持基于DALL·E的图像生成功能，您可以通过输入文字来生成对应的图片。',
    photo: '/DrawImageMode',
  },
]

export {
  DailyTipsList_EN,
  DailyTipsList_CN,
}
