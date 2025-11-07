'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseIANA, Language } from '../lib'

export default function LanguageSelector() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [filtered, setFiltered] = useState<Language[]>([])
  const [search, setSearch] = useState('')
  const [intlOptions, setIntlOptions] = useState<{
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

  useEffect(() => {
    const fetchLanguages = async () => {
      const res = await fetch('/api/languages')
      const data = await res.json()
      setLanguages(data)
      setFiltered(data)
    }
    fetchLanguages()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase()
    setSearch(q)
    setFiltered(
      languages.filter(
        (lang) =>
          lang.description.join(" ").toLowerCase().includes(q) ||
          lang.subtag.toLowerCase().includes(q)
      )
    )
  }

  const handleSelect = (language: string) => {
    const exampleNumber = new Intl.NumberFormat(language || intlOptions.selectedLanguage, {
      style: 'currency',
      currency: 'USD',
    }).format(123456.78)

    const exampleDate = new Intl.DateTimeFormat(language || intlOptions.selectedLanguage, {
      dateStyle: 'full',
    }).format(new Date())

    const exampleUnit = new Intl.NumberFormat(language || intlOptions.selectedLanguage, {
      style: 'unit',
      unit: 'kilometer-per-hour',
    }).format(120)

    setIntlOptions({
      ...intlOptions,
      exampleDate,
      exampleNumber,
      exampleUnit,
      selectedLanguage: language,
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value
    const formattedDate = new Intl.DateTimeFormat(intlOptions.selectedLanguage, {
      dateStyle: 'full',
    }).format(new Date(selectedDate))
    setIntlOptions({
      ...intlOptions,
      selectedDate: formattedDate,
    })
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
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                intlOptions.selectedLanguage === lang.subtag
                  ? 'bg-cyan-600'
                  : 'hover:bg-white/20'
              }`}
              onClick={() => handleSelect(lang.subtag)}
            >
              <span className='font-semibold'>{lang.description.join(', ')}</span>{' '}
              <span className='text-sm opacity-70'>({lang.subtag})</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className='mt-8 bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-lg w-full max-w-lg'>
        <h2 className='text-xl font-semibold mb-3'>
          ✨ Examples in <span className='text-cyan-300'>{intlOptions.selectedLanguage}</span>
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
            📅 <b>Converted Date:</b> {intlOptions.selectedDate || 'Select a date'}
          </p>
        </div>
      </div>
    </div>
  )
}
