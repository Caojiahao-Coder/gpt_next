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
}]

export {
  toolsList,
  getCurrentWeather,
}

export type {
  ToolInfo,
}
