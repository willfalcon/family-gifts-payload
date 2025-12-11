import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import wordsToNumbers from 'words-to-numbers'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function userInitials(name: string | null) {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

export function formatCurrency(amount: string | number | null) {
  if (typeof amount === 'number') {
    const tryFormat =
      typeof amount === 'number'
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
          }).format(amount)
        : NaN

    if (tryFormat !== 'NaN') {
      return tryFormat
    }
  }

  if (typeof amount === 'string') {
    const number = wordsToNumbers(amount)
    const numberInt = typeof number === 'string' ? parseFloat(number) : number
    if (numberInt === null) {
      return ''
    }
    const wordsConvert = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: numberInt % 1 === 0 ? 0 : 2,
    }).format(numberInt)

    if (wordsConvert !== 'NaN') {
      return wordsConvert
    }
  }

  return ''
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(time: Date | string) {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
