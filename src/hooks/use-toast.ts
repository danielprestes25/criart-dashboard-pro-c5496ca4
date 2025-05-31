
import { useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, type = 'info' }: { title: string; description?: string; type?: ToastType }) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, title, description, type }
    
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  return { toast, toasts }
}

// Export toast function directly for convenience
export const toast = ({ title, description, type = 'info' }: { title: string; description?: string; type?: ToastType }) => {
  // This is a convenience export, but the main functionality should use the hook
  console.log(`Toast: ${title} - ${description} (${type})`)
}
