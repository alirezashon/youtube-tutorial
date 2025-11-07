export interface Language {
  subtag: string
  description: string[]
  type: string
  added: string
  suppressScript: string
  scope: string
  macrolanguage: string
}

export function parseIANA(text: string): Language[] {
  const blocks = text.split('%%')
  const result: Language[] = []

  for (const block of blocks) {
    const type = block.match(/Type:\s*(\w+)/)
    const subtag = block.match(/Subtag:\s*(\w+)/)
    const description = block.match(/Description:\s*(.+)/)

    if (type && type[1] === 'language' && subtag && description) {
      result.push({
        subtag: subtag[1],
        description: description[1].split(', '),
        type: type[1],
        added: block.match(/Added:\s*([\d-]+)/)?.[1] || '',
        suppressScript: block.match(/Suppress-Script:\s*(\w+)/)?.[1] || '',
        scope: block.match(/Scope:\s*(\w+)/)?.[1] || '',
        macrolanguage: block.match(/Macrolanguage:\s*(\w+)/)?.[1] || '',
      })
    }
  }

  return result.sort((a, b) =>
    a.description.join(', ').localeCompare(b.description.join(', '))
  )
}
