export function formatPhoneNumber(phone: any) {
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