async function getCurrentWeather(adcode: string, unit: 'celsius' | 'fahrenheit' = 'celsius'): Promise<string> {
  try {
    const response = await fetch(`https://openai-proxy-wine-phi.vercel.app/weather/cur/${adcode}`)
    const data = await response.json()
    const result = JSON.stringify(data)
    return result
  }
  catch {
    return ''
  }
}

async function getYoudaoTrans(q: string, from: string, to: string) {
  try {
    const address = `
  https://openapi.youdao.com/api?q=${q}&from=${from}&to=${to}&appKey=0d03846bbe5c9d0c&salt=beb9831b-f716-4952-becd-fcb179137f6a&sign=728516227d0cdb3f3f6ec771e789a4722978c089bb64082f8a8e0906651090ea&signType=v3&curtime=1699706066
  `
    const response = await fetch('')
  }
  catch {
    return ''
  }
}

interface ToolInfo {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: any
      required: string[]
    }
  }
}

const toolsList: ToolInfo[] = [{
  type: 'function',
  function: {
    name: 'get_current_weather',
    description: 'Get the current weather in a given location',
    parameters: {
      type: 'object',
      properties: {
        adcode: {
          type: 'string',
          description: 'Regional adcode information for weather api in Amap.',
        },
        unit: {
          type: 'string',
          enum: ['Celsius', 'Fahrenheit'],
        },
      },
      required: ['adcode'],
    },
  },
}]

// youdao
// , {
//   type: 'function',
//   function: {
//     name: 'youdao_trans',
//     description: 'Translation work through Youdao API service.',
//     parameters: {
//       type: 'object',
//       properties: {
//         q: {
//           type: 'string',
//           description: 'Text to be translated',
//         },
//         from: {
//           type: 'string',
//           description: 'Source language',
//         },
//         to: {
//           type: 'string',
//           description: 'Target language (Chinese and English preferred)',
//         },
//       },
//       required: ['q', 'from', 'to'],
//     },
//   },
// }

export {
  toolsList,
  getCurrentWeather,
}

export type {
  ToolInfo,
}
