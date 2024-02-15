const defaultData = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxwYXRoIGZpbGw9IiNhZGFkYWQiIGQ9Ik0xOSAxNGEzIDMgMCAxIDAtMy0zYTMgMyAwIDAgMCAzIDNtMC00YTEgMSAwIDEgMS0xIDFhMSAxIDAgMCAxIDEtMSIvPjxwYXRoIGZpbGw9IiNhZGFkYWQiIGQ9Ik0yNiA0SDZhMiAyIDAgMCAwLTIgMnYyMGEyIDIgMCAwIDAgMiAyaDIwYTIgMiAwIDAgMCAyLTJWNmEyIDIgMCAwIDAtMi0ybTAgMjJINnYtNmw1LTVsNS41OSA1LjU5YTIgMiAwIDAgMCAyLjgyIDBMMjEgMTlsNSA1Wm0wLTQuODNsLTMuNTktMy41OWEyIDIgMCAwIDAtMi44MiAwTDE4IDE5LjE3bC01LjU5LTUuNTlhMiAyIDAgMCAwLTIuODIgMEw2IDE3LjE3VjZoMjBaIi8+PC9zdmc+'

async function ImageGenerationParser(response: Response): Promise<{
  b64_data: string
  revised_prompt: string
}> {
  try {
    const data = await response.json()
    const img_b64 = data.data[0].b64_json
    return {
      b64_data: `data:image/png;base64,${img_b64}`,
      revised_prompt: data.data[0].revised_prompt,
    }
  }
  catch {
    return {
      b64_data: defaultData,
      revised_prompt: 'Unknown error. Please try again.',
    }
  }
}

export {
  ImageGenerationParser,
  defaultData,
}
