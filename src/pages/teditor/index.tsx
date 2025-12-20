'use client'

import { useEffect, useRef } from 'react'

const Editor = () => {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return
      const range = selection.getRangeAt(0)
      let node: Node | null = range.commonAncestorContainer
      if (!editorRef.current || !editorRef.current.contains(node)) return

      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement
      }
      if (!(node instanceof HTMLElement)) return
    //   console.log('Selected node:', node)
const selectedText = selection.toString();
console.log('Selected text:', selectedText);
      //   console.log('Node HTML:', node.outerHTML)
    }
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [])
  return (
    <div
      ref={editorRef}
      contentEditable
      style={{ border: '2px solid blue', padding: 24 }}
    >
      This is a test editor. Select any part of this text to see the selected
      node details in the console.
      <b>this part is bold</b>
      <p>this is a test paragraph</p>
    </div>
  )
}
export default Editor
