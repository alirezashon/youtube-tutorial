import { useEffect, useRef, useState } from "react"
import { FaBold } from "react-icons/fa"
import styles from './index.module.css'
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

        <div className={styles.toolbar}>
        {/* Undo/Redo */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className={styles.toolbarButton}
            title="بازگشت"
          >
            <FaUndo />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={styles.toolbarButton}
            title="بازگشت به جلو"
          >
            <FaRedo />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        {/* Text Formatting */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => formatText('bold')}
            className={`${styles.toolbarButton} ${isCommandActive('bold') ? styles.active : ''}`}
            title="ضخیم"
          >
            <FaBold />
          </button>
          <button
            type="button"
            onClick={() => formatText('italic')}
            className={`${styles.toolbarButton} ${isCommandActive('italic') ? styles.active : ''}`}
            title="ایتالیک"
          >
            <FaItalic />
          </button>
          <button
            type="button"
            onClick={() => formatText('underline')}
            className={`${styles.toolbarButton} ${isCommandActive('underline') ? styles.active : ''}`}
            title="زیرخط"
          >
            <FaUnderline />
          </button>
          <button
            type="button"
            onClick={() => formatText('strikeThrough')}
            className={`${styles.toolbarButton} ${isCommandActive('strikeThrough') ? styles.active : ''}`}
            title="خط خورده"
          >
            <FaStrikethrough />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        {/* Font Size */}
        <div className={styles.toolbarGroup}>
          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className={styles.toolbarSelect}
            title="اندازه فونت"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Font Family */}
        <div className={styles.toolbarGroup}>
          <select
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className={styles.toolbarSelect}
            title="نوع فونت"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.toolbarSeparator} />

        {/* Text Alignment */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => formatText('justifyLeft')}
            className={`${styles.toolbarButton} ${getCommandValue('justifyLeft') === 'left' ? styles.active : ''}`}
            title="چپ چین"
          >
            <FaAlignLeft />
          </button>
          <button
            type="button"
            onClick={() => formatText('justifyCenter')}
            className={`${styles.toolbarButton} ${getCommandValue('justifyCenter') === 'center' ? styles.active : ''}`}
            title="وسط چین"
          >
            <FaAlignCenter />
          </button>
          <button
            type="button"
            onClick={() => formatText('justifyRight')}
            className={`${styles.toolbarButton} ${getCommandValue('justifyRight') === 'right' ? styles.active : ''}`}
            title="راست چین"
          >
            <FaAlignRight />
          </button>
          <button
            type="button"
            onClick={() => formatText('justifyFull')}
            className={`${styles.toolbarButton} ${getCommandValue('justifyFull') === 'justify' ? styles.active : ''}`}
            title="همتراز"
          >
            <FaAlignJustify />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        {/* Lists */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => formatText('insertUnorderedList')}
            className={`${styles.toolbarButton} ${isCommandActive('insertUnorderedList') ? styles.active : ''}`}
            title="لیست نامرتب"
          >
            <FaListUl />
          </button>
          <button
            type="button"
            onClick={() => formatText('insertOrderedList')}
            className={`${styles.toolbarButton} ${isCommandActive('insertOrderedList') ? styles.active : ''}`}
            title="لیست مرتب"
          >
            <FaListOl />
          </button>
          <button
            type="button"
            onClick={() => formatText('outdent')}
            className={styles.toolbarButton}
            title="کاهش تورفتگی"
          >
            <FaOutdent />
          </button>
          <button
            type="button"
            onClick={() => formatText('indent')}
            className={styles.toolbarButton}
            title="افزایش تورفتگی"
          >
            <FaIndent />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        {/* Colors */}
        <div className={styles.toolbarGroup}>
          <div className={styles.colorPickerContainer}>
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleTextColorChange(e.target.value)}
              className={styles.colorPicker}
              title="رنگ متن"
            />
            <FaPaintBrush className={styles.colorIcon} />
          </div>
          <div className={styles.colorPickerContainer}>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className={styles.colorPicker}
              title="رنگ پس‌زمینه"
            />
            <div
              className={styles.colorPreview}
              style={{ backgroundColor }}
            />
          </div>
        </div>

        <div className={styles.toolbarSeparator} />

        {/* Insert */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={handleInsertImage}
            className={styles.toolbarButton}
            title="درج تصویر"
          >
            <FaImage />
          </button>
          <button
            type="button"
            onClick={handleInsertLink}
            className={styles.toolbarButton}
            title="درج لینک"
          >
            <FaLink />
          </button>
          <button
            type="button"
            onClick={handleInsertTable}
            className={styles.toolbarButton}
            title="درج جدول"
          >
            <FaTable />
          </button>
        </div>

        <div className={styles.toolbarSeparator} />

        {/* Formatting */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={handleCopyFormatting}
            className={styles.toolbarButton}
            title="کپی فرمت"
          >
            <FaCopy />
          </button>
          <button
            type="button"
            onClick={handlePasteFormatting}
            className={styles.toolbarButton}
            title="چسباندن فرمت"
          >
            <FaPaintBrush />
          </button>
        </div>
      </div>

    </>
  )
}

export default Test
