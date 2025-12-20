'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaListUl,
  FaListOl,
  FaImage,
  FaTable,
  FaLink,
  FaUndo,
  FaRedo,
  FaCopy,
  FaPaintBrush,
  FaHeading,
  FaSubscript,
  FaSuperscript,
  FaIndent,
  FaOutdent,
} from 'react-icons/fa';
import styles from './index.module.css';

interface TextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  initialContent = '',
  onChange,
  placeholder = 'متن خود را اینجا بنویسید...',
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const fonts = [
    'Arial',
    'Tahoma',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Georgia',
    'Comic Sans MS',
  ];

  const fontSizes = ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

  // Initialize editor
  useEffect(() => {
    if (editorRef.current) {
      if (initialContent) {
        editorRef.current.innerHTML = initialContent;
      }
      setIsReady(true);
      saveToHistory();
    }
  }, []);

  // Save to history
  const saveToHistory = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(content);
        if (newHistory.length > 50) {
          newHistory.shift();
        }
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    }
  }, [historyIndex]);

  // Handle selection change
  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
          setSelection(sel);
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Restore selection
  const restoreSelection = useCallback(() => {
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const newSelection = window.getSelection();
      if (newSelection) {
        newSelection.removeAllRanges();
        newSelection.addRange(range);
      }
    }
  }, [selection]);

  // Execute command
  const execCommand = useCallback(
    (command: string, value: string | null = null, useDefaultUI: boolean = false) => {
      document.execCommand(command, useDefaultUI, value || undefined);
      editorRef.current?.focus();
      saveToHistory();
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    },
    [onChange, saveToHistory]
  );

  // Check if command is active
  const isCommandActive = useCallback(
    (command: string): boolean => {
      try {
        return document.queryCommandState(command);
      } catch {
        return false;
      }
    },
    []
  );

  // Get command value
  const getCommandValue = useCallback((command: string): string => {
    try {
      return document.queryCommandValue(command);
    } catch {
      return '';
    }
  }, []);

  // Format text
  const formatText = useCallback(
    (command: string) => {
      restoreSelection();
      execCommand(command);
    },
    [restoreSelection, execCommand]
  );

  // Set font size
  const handleFontSizeChange = useCallback(
    (size: string) => {
      setFontSize(size);
      restoreSelection();
      execCommand('fontSize', '7');
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
        if (fontElements && fontElements.length > 0) {
          const lastFont = fontElements[fontElements.length - 1] as HTMLElement;
          lastFont.removeAttribute('size');
          lastFont.style.fontSize = `${size}px`;
        }
      }
      saveToHistory();
    },
    [restoreSelection, execCommand, saveToHistory]
  );

  // Set font family
  const handleFontFamilyChange = useCallback(
    (family: string) => {
      setFontFamily(family);
      restoreSelection();
      execCommand('fontName', family);
    },
    [restoreSelection, execCommand]
  );

  // Set text color
  const handleTextColorChange = useCallback(
    (color: string) => {
      setTextColor(color);
      restoreSelection();
      execCommand('foreColor', color);
    },
    [restoreSelection, execCommand]
  );

  // Set background color
  const handleBackgroundColorChange = useCallback(
    (color: string) => {
      setBackgroundColor(color);
      restoreSelection();
      execCommand('backColor', color);
    },
    [restoreSelection, execCommand]
  );

  // Insert image
  const handleInsertImage = useCallback(() => {
    const url = prompt('آدرس تصویر را وارد کنید:');
    if (url) {
      restoreSelection();
      execCommand('insertImage', url);
    }
  }, [restoreSelection, execCommand]);

  // Insert link
  const handleInsertLink = useCallback(() => {
    const url = prompt('آدرس لینک را وارد کنید:');
    if (url) {
      restoreSelection();
      execCommand('createLink', url);
    }
  }, [restoreSelection, execCommand]);

  // Insert table
  const handleInsertTable = useCallback(() => {
    const rows = prompt('تعداد ردیف‌ها:', '3');
    const cols = prompt('تعداد ستون‌ها:', '3');
    if (rows && cols) {
      restoreSelection();
      const table = document.createElement('table');
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      table.style.margin = '10px 0';
      table.style.border = '1px solid #ddd';

      for (let i = 0; i < parseInt(rows); i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < parseInt(cols); j++) {
          const td = document.createElement('td');
          td.style.border = '1px solid #ddd';
          td.style.padding = '8px';
          td.innerHTML = '&nbsp;';
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(table);
      }
      saveToHistory();
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  }, [restoreSelection, saveToHistory, onChange]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
      }
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  }, [history, historyIndex, onChange]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = history[newIndex];
      }
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  }, [history, historyIndex, onChange]);

  // Copy formatting
  const handleCopyFormatting = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      if (container.nodeType === Node.TEXT_NODE) {
        const parent = container.parentElement;
        if (parent) {
          const style = window.getComputedStyle(parent);
          localStorage.setItem('copiedFormatting', JSON.stringify({
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
            color: style.color,
            backgroundColor: style.backgroundColor,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            textDecoration: style.textDecoration,
          }));
          alert('فرمت کپی شد!');
        }
      }
    }
  }, []);

  // Paste formatting
  const handlePasteFormatting = useCallback(() => {
    const formatting = localStorage.getItem('copiedFormatting');
    if (formatting) {
      restoreSelection();
      const format = JSON.parse(formatting);
      execCommand('fontSize', '7');
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
        if (fontElements && fontElements.length > 0) {
          const lastFont = fontElements[fontElements.length - 1] as HTMLElement;
          lastFont.removeAttribute('size');
          lastFont.style.fontSize = format.fontSize;
          lastFont.style.fontFamily = format.fontFamily;
          lastFont.style.color = format.color;
          lastFont.style.backgroundColor = format.backgroundColor;
          lastFont.style.fontWeight = format.fontWeight;
          lastFont.style.fontStyle = format.fontStyle;
          lastFont.style.textDecoration = format.textDecoration;
        }
      }
    }
  }, [restoreSelection, execCommand]);

  // Handle content change
  const handleInput = useCallback(() => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Handle paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const html = e.clipboardData.getData('text/html');
    
    if (html) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      // Clean up pasted content
      const cleanHtml = tempDiv.innerHTML;
      document.execCommand('insertHTML', false, cleanHtml);
    } else {
      document.execCommand('insertText', false, text);
    }
    saveToHistory();
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange, saveToHistory]);

  // if (!isReady) {
  //   return <div>در حال بارگذاری...</div>;
  // }

  return (
    <div className={`${styles.editorContainer} ${className}`}>
      {/* Toolbar */}
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

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={styles.editor}
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default TextEditor;

