import type { GetWeatherArgsInfo } from '@/chat.function.calling/type.get_weather.arg'
import type { SearchPhotosArgsInfo } from '@/chat.function.calling/type.search_photos.arg'
import type { SearchPhotosFromUnsplashResult } from '@/chat.function.calling/type.search_photos.result'

const functionHandleList = [{
  functionName: 'get_current_weather',
  async handler(args: string): Promise<string> {
    return await handleWeather(args)
  },
}, {
  functionName: 'search_photo_from_unsplash',
  async handler(args: string): Promise<string> {
    return await handleSearchPhoto(args)
  },
}]

async function getFunctionResultByFunctionName(functionName: string, args: string): Promise<string> {
  const functionHandler = functionHandleList.find(item => item.functionName === functionName)?.handler
  if (functionHandler)
    return await functionHandler(args)
  else
    return ''
}

/**
 * 处理天气能力
 * @param args
 * @returns
 */
async function handleWeather(args: string): Promise<string> {
  const argsInfo = JSON.parse(args) as GetWeatherArgsInfo

  try {
    const response = await fetch(`https://gptnext-proxy.vercel.app/weather/cur?lat=${argsInfo.lat}&lon=${argsInfo.lon}&exclude=${argsInfo.exclude}&units=${argsInfo.units}`)

    const data = await response.json()
    const result = JSON.stringify(data)
    return result
  }
  catch {
    return ''
  }
}

/**
 * 处理图像搜索能力
 * @param args
 * @returns
 */
async function handleSearchPhoto(args: string): Promise<string> {
  const argsInfo = JSON.parse(args) as SearchPhotosArgsInfo

  try {
    const response = await fetch(`https://gptnext-proxy.vercel.app/image/search/?page=${argsInfo.page}&query=${argsInfo.query}&per_page=${argsInfo.per_page}`)

    const data = await response.json() as SearchPhotosFromUnsplashResult
    const result: {
      id: number
      slug: string
      created_at: string
      updated_at: string
      promoted_at: string
      width: number
      height: number
      color: string
      blur_hash: string
      description: string
      alt_description: string
      likes: number
      urls: {
        raw: string
        full: string
        regular: string
        small: string
        thumb: string
      }
    }[] = []

    // get only per_page items
    const myImageList = data.results.sort((a, b) => b.likes - a.likes).slice(0, Number.parseInt(argsInfo.per_page))

    myImageList.map(a => result.push({
      id: a.id,
      slug: a.slug,
      created_at: a.created_at,
      updated_at: a.updated_at,
      promoted_at: a.promoted_at,
      width: a.width,
      height: a.height,
      color: a.color,
      blur_hash: a.blur_hash,
      description: a.description,
      alt_description: a.alt_description,
      likes: a.likes,
      urls: {
        raw: a.urls.raw,
        full: a.urls.full,
        regular: a.urls.regular,
        small: a.urls.small,
        thumb: a.urls.thumb,
      },
    }))

    const myData = JSON.stringify(result)
    return myData
  }
  catch {
    return ''
  }
}

export default getFunctionResultByFunctionName
