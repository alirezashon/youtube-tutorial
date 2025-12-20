import { useEffect, useRef, useState } from "react"
import { FaBold } from "react-icons/fa"

const Test = () => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [selectedText, setSelectedText] = useState<String>('')
  const [finalText, setFinalText] = useState<String>('')
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
      const container = range.commonAncestorContainer

      // بررسی اینکه آیا انتخاب داخل ادیتور است؟
      const editorElement = editorRef.current
      if (!editorElement) return

      // اگر container یک Text node باشد، parentElement را بررسی می‌کنیم
      const element = container.nodeType === Node.TEXT_NODE
        ? container.parentElement
        : container as Element

      if (!element || !editorElement.contains(element)) return

      const text = selection.toString()
      if (text) {
        setSelectedText(text)
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [])

  const handleBold = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<b>${selectedText}</b>`)))
  }
  const handleItalic = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<i>${selectedText}</i>`)))
  }
  const handleUnderline = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<u>${selectedText}</u>`)))
  }
  const handleStrikethrough = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<s>${selectedText}</s>`)))
  }
  const handleCode = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<code>${selectedText}</code>`)))
  }
  const handleQuote = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<blockquote>${selectedText}</blockquote>`)))
  }
  const handleLink = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<a href="${selectedText}">${selectedText}</a>`)))
  }
  const handleImage = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<img src="${selectedText}" alt="${selectedText}" />`)))
  }
  const handleList = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<ul>${selectedText}</ul>`)))
  }
  const handleTable = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<table>${selectedText}</table>`)))
  }
  const handleVideo = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<video src="${selectedText}" controls />`)))
  }
  const handleAudio = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<audio src="${selectedText}" controls />`)))
  }
  const handleEmbed = () => {
    setFinalText((prv => prv.replace(`${selectedText}`, `<iframe src="${selectedText}" />`)))
  }

  return (
    <>
      <div onInput={(e) => setFinalText(e.currentTarget.innerText)} contentEditable className="border border-gray p-4 rounded-md" ref={editorRef} />

      <FaBold size={24} color="gray" onClick={handleBold} />
      {
        finalText
      }
    </>
  )
}

export default Test
