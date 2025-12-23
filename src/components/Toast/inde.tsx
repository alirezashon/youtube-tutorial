'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa'
import type { IconType } from 'react-icons'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  type: ToastType
  title: string
  msg?: string
}

interface ToastContextValue {
  success: (title: string, msg?: string) => void
  error: (title: string, msg?: string) => void
  warning: (title: string, msg?: string) => void
  info: (title: string, msg?: string) => void
}

interface ToastProviderProps {
  children: ReactNode
}

interface ToastProps {
  type: ToastType
  title: string
  msg?: string
  rm: () => void
}

interface ToastTypeConfig {
  c: string
  i: IconType
}

/* ---------------- styles ---------------- */

const styles = {
  /* 🆕 stack container */
  stack: {
    position: 'fixed' as const,
    top: 16,
    right: 16,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },

  /* ❗ position fixed از اینجا برداشته شد */
  wrap: {
    width: 320,
    animation: 'slide .35s ease',
    transition: 'transform .25s ease, opacity .25s ease',
  },

  toast: (c: string) => ({
    display: 'flex',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backdropFilter: 'blur(10px)',
    background: `linear-gradient(135deg, ${c}22, ${c}11)`,
    border: `1px solid ${c}55`,
    boxShadow: '0 15px 40px rgba(0,0,0,.15)',
    color: c,
  }),

  title: { fontSize: 14, fontWeight: 600 },
  msg: { fontSize: 12, opacity: .75 },
  close: { cursor: 'pointer', opacity: .6 },
}

/* ---------------- types ---------------- */

const types: Record<ToastType, ToastTypeConfig> = {
  success: { c: '#22c55e', i: FaCheckCircle },
  error: { c: '#ef4444', i: FaTimesCircle },
  warning: { c: '#f59e0b', i: FaExclamationTriangle },
  info: { c: '#3b82f6', i: FaInfoCircle },
}

/* ---------------- context ---------------- */

const ToastCtx = createContext<ToastContextValue | null>(null)
export const useToast = () => {
  const context = useContext(ToastCtx)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

/* ---------------- provider ---------------- */

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, set] = useState<ToastItem[]>([])

  const show = (type: ToastType, title: string, msg?: string) =>
    set(t => [...t, { id: crypto.randomUUID(), type, title, msg }])

  return (
    <ToastCtx.Provider value={{
      success:(t,m)=>show('success',t,m),
      error:(t,m)=>show('error',t,m),
      warning:(t,m)=>show('warning',t,m),
      info:(t,m)=>show('info',t,m),
    }}>
      {children}

      {/* 🆕 stack wrapper */}
      <div style={styles.stack}>
        {toasts.map(t => (
          <Toast
            key={t.id}
            {...t}
            rm={() => set(s => s.filter(x => x.id !== t.id))}
          />
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------------- toast ---------------- */

function Toast({ type, title, msg, rm }: ToastProps) {
  const { c, i: Icon } = types[type]

  useEffect(() => {
    const t = setTimeout(rm, 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={styles.wrap}>
      <style>{`
        @keyframes slide {
          from {
            transform: translateX(120%) translateY(-10px) scale(.95);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div style={styles.toast(c)}>
        <Icon size={22} />
        <div style={{ flex: 1 }}>
          <div style={styles.title}>{title}</div>
          {msg && <div style={styles.msg}>{msg}</div>}
        </div>
        <FaTimes onClick={rm} style={styles.close} />
      </div>
    </div>
  )
}
