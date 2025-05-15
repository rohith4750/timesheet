export function capitalizeWords(string: string) {
  return string
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function convertBracketNotationToObject(input: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}

  Object.entries(input).forEach(([key, value]) => {
    // Convert keys like '[rfidReader][numAntennas]' into an array of keys
    const keys = key.match(/\[([^\]]+)\]/g)?.map((k) => k.replace(/\[|\]/g, '')) || [key]

    // Build the nested object
    let current = result
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]
      if (i === keys.length - 1) {
        // current[k] = value
        if (/date|time|createdAt|updatedAt/i.test(k)) {
          // Modify the value as needed, e.g., converting to a specific format
          current[k] = { matches: value } // Example modification
        } else {
          current[k] = value
        }
      } else {
        current[k] = current[k] || {}
        current = current[k]
      }
    }
  })

  return result
}

export const getIcon = (icon: any) => {
  return require(`../../assets/images/${icon}`)
}

export const deepMerge = (target: any, source: any): any => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

export function formatPhoneNumber(phone: string) {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '')

  // Ensure it starts with +1
  if (!cleaned.startsWith('1')) {
    cleaned = '1' + cleaned
  }

  // Extract parts (assume US format)
  const countryCode = '+1'
  const areaCode = cleaned.slice(1, 4)
  const firstPart = cleaned.slice(4, 7)
  const secondPart = cleaned.slice(7, 11)

  // Format: +1 (123) 456-7890
  if (cleaned.length >= 11) {
    return `${countryCode} (${areaCode}) ${firstPart}-${secondPart}`
  } else {
    return phone // Return original if it's not a valid length
  }
}

export const updateErrorsInFields = (fields: any[], errors: any[]): any[] => {
  const updatedFields = JSON.parse(JSON.stringify(fields))
  // Iterate through the fields and update errors
  updatedFields.forEach((item: any) => {
    delete item.hasError // Clear any existing errors
    // Find errors for the current field
    const fieldErrors = errors.filter(
      (err: any) => item.key.toLowerCase() === err.field.toLowerCase(),
    )
    if (fieldErrors.length) {
      item.hasError = fieldErrors[0]['errors']
    }
  })
  return updatedFields
}

export const clearFormFieldsData = (formFields: any) => {
  const clearFieldsDefaultValue = (data: any[]) => {
    data.forEach((item: any) => {
      item.defaultValue = ''
      if (item?.nestedFields?.length) {
        item.nestedFields.forEach((ni: any) => {
          ni.data = [...clearFieldsDefaultValue(ni.data)]
        })
      }
    })
    return data
  }
  return [...clearFieldsDefaultValue(formFields)]
}
