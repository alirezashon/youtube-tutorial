'use client'

import { useEffect, useCallback} from 'react'
import { motion } from 'framer-motion'
import { Language } from '../lib'
import React from 'react'

export default function LanguageSelector({}:{}) {
  const [languages, setLanguages] = React.useState<Language[]>([])
  const [filtered, setFiltered] = React.useState<Language[]>([])
  const [search, setSearch] = React.useState('')
  const [intlOptions, setIntlOptions] = React.useState<{
    exampleDate: string
    exampleUnit: string
    exampleNumber: string
    selectedLanguage: string
    selectedDate: string
  }>({
    exampleDate: '',
    exampleUnit: '',
    exampleNumber: '',
    selectedLanguage: 'fa',
    selectedDate: '',
  })

  // Helper function to format currency with fallback
  // Currency formatting works better with region codes, so we try that first
  const formatCurrency = useCallback((locale: string): string => {
    const regionMap: Record<string, string> = {
      'en': 'en-US',
      'fa': 'fa-IR',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'es': 'es-ES',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ru': 'ru-RU',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'ar': 'ar-SA',
    }

    // Try with region code first for better currency formatting
    const localeWithRegion = regionMap[locale] || (locale.includes('-') ? locale : `${locale}-${locale.toUpperCase()}`)

    try {
      return new Intl.NumberFormat(localeWithRegion, {
        style: 'currency',
        currency: 'USD',
      }).format(123456.78)
    } catch (e) {
      // If region-enhanced locale fails, try original locale
      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: 'USD',
        }).format(123456.78)
      } catch (e2) {
        // Final fallback to default locale
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(123456.78)
      }
    }
  }, [])

  const handleSelect = useCallback((language: string) => {
    const locale = language

    try {
      const exampleNumber = formatCurrency(locale)
      const exampleDate = new Intl.DateTimeFormat(locale, {
        dateStyle: 'full',
      }).format(new Date())

      const exampleUnit = new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: 'kilometer-per-hour',
      }).format(120)

      setIntlOptions((prev) => ({
        ...prev,
        exampleDate,
        exampleNumber,
        exampleUnit,
        selectedLanguage: language,
      }))
    } catch (error) {
      console.error('Error formatting with locale:', locale, error)
      // Fallback to default formatting
      setIntlOptions((prev) => ({
        ...prev,
        exampleDate: new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date()),
        exampleNumber: formatCurrency('en-US'),
        exampleUnit: new Intl.NumberFormat('en-US', { style: 'unit', unit: 'kilometer-per-hour' }).format(120),
        selectedLanguage: language,
      }))
    }
  }, [formatCurrency])

  useEffect(() => {
    const fetchLanguages = async () => {
      const res = await fetch('/api/languages')
      const data = await res.json()
      setLanguages(data)
      setFiltered(data)

      // Initialize examples with default language ('fa')
      if (data.length > 0) {
        const defaultLocale = 'fa'
        const exampleNumber = formatCurrency(defaultLocale)
        const exampleDate = new Intl.DateTimeFormat(defaultLocale, {
          dateStyle: 'full',
        }).format(new Date())
        const exampleUnit = new Intl.NumberFormat(defaultLocale, {
          style: 'unit',
          unit: 'kilometer-per-hour',
        }).format(120)

        setIntlOptions((prev) => ({
          ...prev,
          exampleDate,
          exampleNumber,
          exampleUnit,
        }))
      }
    }
    fetchLanguages()
  }, [formatCurrency])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase()
    setSearch(q)
    setFiltered(
      languages.filter(
        (lang) =>
          lang.description.join(' ').toLowerCase().includes(q) ||
          lang.subtag.toLowerCase().includes(q)
      )
    )
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value
    const formattedDate = new Intl.DateTimeFormat(
      intlOptions.selectedLanguage,
      {
        dateStyle: 'full',
      }
    ).format(new Date(selectedDate))
    setIntlOptions((prev) => ({
      ...prev,
      selectedDate: formattedDate,
    }))
  }

  return (
    <div className='flex flex-col items-center justify-center p-6 min-h-screen bg-gradient-to-br from-[#0099A8] to-[#8a0099] text-white'>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-3xl font-bold mb-6'
      >
        🌍 Dynamic Intl Language Explorer
      </motion.h1>

      <div className='bg-white/10 p-6 rounded-2xl shadow-lg w-full max-w-lg backdrop-blur-md'>
        <input
          type='text'
          value={search}
          onChange={handleSearch}
          placeholder='🔍 Search a language...'
          className='w-full mb-4 p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'
        />

        <div className='max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500'>
          {filtered.slice(0, 50).map((lang) => (
            <motion.div
              key={lang.subtag}
              whileHover={{ scale: 1.05 }}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${intlOptions.selectedLanguage === lang.subtag
                ? 'bg-cyan-600'
                : 'hover:bg-white/20'
                }`}
              onClick={() => handleSelect(lang.subtag)}
            >
              <span className='font-semibold'>
                {lang.description.join(', ')}
              </span>{' '}
              <span className='text-sm opacity-70'>({lang.subtag})</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className='mt-8 bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-lg w-full max-w-lg'>
        <h2 className='text-xl font-semibold mb-3'>
          ✨ Examples in{' '}
          <span className='text-cyan-300'>{intlOptions.selectedLanguage}</span>
        </h2>
        <div className='space-y-2'>
          <p>
            💰 <b>Currency:</b> {intlOptions.exampleNumber}
          </p>
          <p>
            📅 <b>Date:</b> {intlOptions.exampleDate}
          </p>
          <p>
            🏎️ <b>Unit:</b> {intlOptions.exampleUnit}
          </p>
        </div>
        <div className='mt-4'>
          <input
            type='date'
            onChange={handleDateChange}
            className='p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'
          />
          <p className='mt-2 text-sm'>
            📅 <b>Converted Date:</b>{' '}
            {intlOptions.selectedDate || 'Select a date'}
          </p>
        </div>
      </div>
    </div>
)
}
