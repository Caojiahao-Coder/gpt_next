async function getCurrentWeather(lat: string, lon: string, exclude: string, units: string): Promise<string> {
  try {
    // https://openai-proxy-wine-phi.vercel.app
    const response = await fetch(`https://gptnext-proxy.vercel.app/weather/cur?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}`)

    const data = await response.json()
    const result = JSON.stringify(data)
    return result
  }
  catch {
    return ''
  }
}

async function searchPhotosFromUnsplash(query: string, page: number, per_page: number) {
  try {
    const response = await fetch(`https://gptnext-proxy.vercel.app/image/search/?page=${page}&query=${query}&per_page=10`)

    const data = await response.json() as SearchPhotosFromUnsplashResponse
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
    const myImageList = data.results.sort((a, b) => b.likes - a.likes).slice(0, per_page)

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

    console.log(result.length)
    const myData = JSON.stringify(result)
    return myData
  }
  catch {
    return ''
  }
}

interface SearchPhotosFromUnsplashResponse {
  total: number
  total_pages: number
  results: {
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
    urls: {
      raw: string
      full: string
      regular: string
      small: string
      thumb: string
    }
    links: {
      self: string
      html: string
      download: string
      download_location: string
    }
    likes: number
  }[]
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
        lat: {
          type: 'string',
          description: 'Latitude, decimal (-90; 90). If you need the geocoder to automatic convert city names and zip-codes to geo coordinates.',
        },
        lon: {
          type: 'string',
          description: 'Longitude, decimal (-180; 180). If you need the geocoder to automatic convert city names and zip-codes to geo coordinates.',
        },
        exclude: {
          type: 'string',
          enum: ['current', 'minutely', 'hourly', 'daily', 'alerts'],
          description: 'By using this parameter you can exclude some parts of the weather data from the API response. It should be a comma-delimited list (without spaces).',
        },
        units: {
          type: 'string',
          enum: ['standard', 'metric', 'imperial'],
          description: 'Units of measurement. standard, metric and imperial units are available. If you do not use the units parameter, standard units will be applied by default.',
        },
      },
      required: ['lat', 'lon', 'exclude', 'units'],
    },
  },
}, {
  type: 'function',
  function: {
    name: 'search_photo_from_unsplash',
    description: 'Search photos from Unsplash',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search for the type, category or description of the image (in English)',
        },
        page: {
          type: 'number',
          description: 'Page number default 1, max 10',
        },
        per_page: {
          type: 'number',
          description: 'Number of items per page default 1 , max 10',
        },
      },
      required: ['query', 'page', 'per_page'],
    },
  },
}]

export {
  toolsList,
  getCurrentWeather,
  searchPhotosFromUnsplash,
}

export type {
  ToolInfo,
}
