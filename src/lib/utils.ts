import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function randomColor(): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    return new Promise((resolve, reject) => {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

export function downloadFile(content: string, filename: string, contentType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function parseQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const urlObj = new URL(url)
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value))
    }
  })
  return searchParams.toString()
}

export function isObject(item: unknown): item is Record<string, any> {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (isObject(result[key]) && isObject(source[key])) {
        result[key] = deepMerge(result[key], source[key] as any)
      } else {
        result[key] = source[key] as any
      }
    }
  }
  
  return result
}

export function createCache<T>(maxSize: number = 100): {
  get: (key: string) => T | undefined
  set: (key: string, value: T) => void
  has: (key: string) => boolean
  delete: (key: string) => boolean
  clear: () => void
  size: () => number
} {
  const cache = new Map<string, T>()
  
  return {
    get(key) {
      const value = cache.get(key)
      if (value !== undefined) {
        // Move to end (LRU)
        cache.delete(key)
        cache.set(key, value)
      }
      return value
    },
    
    set(key, value) {
      if (cache.size >= maxSize) {
        // Remove oldest entry
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
      }
      cache.set(key, value)
    },
    
    has(key) {
      return cache.has(key)
    },
    
    delete(key) {
      return cache.delete(key)
    },
    
    clear() {
      cache.clear()
    },
    
    size() {
      return cache.size
    }
  }
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number)
  const v2Parts = version2.split('.').map(Number)
  
  const maxLength = Math.max(v1Parts.length, v2Parts.length)
  
  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0
    const v2Part = v2Parts[i] || 0
    
    if (v1Part > v2Part) return 1
    if (v1Part < v2Part) return -1
  }
  
  return 0
}

export function sanitizeHtml(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(number: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('en-US', options).format(number)
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}

export function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0
    
    const attempt = async () => {
      try {
        const result = await fn()
        resolve(result)
      } catch (error) {
        attempts++
        if (attempts >= maxAttempts) {
          reject(error)
        } else {
          setTimeout(attempt, delay * attempts)
        }
      }
    }
    
    attempt()
  })
}

export function createEventEmitter(): {
  on: (event: string, listener: (...args: any[]) => void) => void
  off: (event: string, listener: (...args: any[]) => void) => void
  emit: (event: string, ...args: any[]) => void
} {
  const listeners = new Map<string, Set<(...args: any[]) => void>>()
  
  return {
    on(event, listener) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set())
      }
      listeners.get(event)!.add(listener)
    },
    
    off(event, listener) {
      const eventListeners = listeners.get(event)
      if (eventListeners) {
        eventListeners.delete(listener)
        if (eventListeners.size === 0) {
          listeners.delete(event)
        }
      }
    },
    
    emit(event, ...args) {
      const eventListeners = listeners.get(event)
      if (eventListeners) {
        eventListeners.forEach(listener => listener(...args))
      }
    }
  }
}

export function measurePerformance<T>(
  fn: () => T,
  label?: string
): { result: T; duration: number } {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  const duration = end - start
  
  if (label) {
    console.log(`${label}: ${duration.toFixed(2)}ms`)
  }
  
  return { result, duration }
}

export async function measureAsyncPerformance<T>(
  fn: () => Promise<T>,
  label?: string
): Promise<{ result: T; duration: number }> {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  const duration = end - start
  
  if (label) {
    console.log(`${label}: ${duration.toFixed(2)}ms`)
  }
  
  return { result, duration }
}

export function noop(): void {
  // No operation function
}

export function identityFunction<T>(x: T): T {
  return x
}

export function constantFunction<T>(value: T): () => T {
  return () => value
}

export function compose<T, U, V>(f: (x: U) => V, g: (x: T) => U): (x: T) => V {
  return (x: T) => f(g(x))
}

export function pipe<T, U, V>(f: (x: T) => U, g: (x: U) => V): (x: T) => V {
  return (x: T) => g(f(x))
}

export function curry<T, U, V>(fn: (a: T, b: U) => V): (a: T) => (b: U) => V {
  return (a: T) => (b: U) => fn(a, b)
}

export function uncurry<T, U, V>(fn: (a: T) => (b: U) => V): (a: T, b: U) => V {
  return (a: T, b: U) => fn(a)(b)
}

export function memoize<T, U>(fn: (...args: T[]) => U): (...args: T[]) => U {
  const cache = new Map<string, U>()
  
  return (...args: T[]) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false
  let result: any
  
  return ((...args: any[]) => {
    if (!called) {
      called = true
      result = fn(...args)
    }
    return result
  }) as T
}

export function createPromiseWithResolvers<T>(): {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (reason?: any) => void
} {
  let resolve: (value: T) => void
  let reject: (reason?: any) => void
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  
  return { promise, resolve: resolve!, reject: reject! }
}

export function createAbortablePromise<T>(
  executor: (signal: AbortSignal) => Promise<T>
): { promise: Promise<T>; abort: () => void } {
  const controller = new AbortController()
  
  const promise = executor(controller.signal)
  
  return {
    promise,
    abort: () => controller.abort()
  }
}

export function batchPromises<T>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<any>
): Promise<any[]> {
  const batches = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  
  return batches.reduce(async (previousPromise, batch) => {
    const results = await previousPromise
    const batchResults = await Promise.all(batch.map(processor))
    return results.concat(batchResults)
  }, Promise.resolve([]))
}

export function createQueue<T>(): {
  enqueue: (item: T) => void
  dequeue: () => T | undefined
  peek: () => T | undefined
  isEmpty: () => boolean
  size: () => number
  clear: () => void
} {
  const items: T[] = []
  
  return {
    enqueue(item) {
      items.push(item)
    },
    
    dequeue() {
      return items.shift()
    },
    
    peek() {
      return items[0]
    },
    
    isEmpty() {
      return items.length === 0
    },
    
    size() {
      return items.length
    },
    
    clear() {
      items.length = 0
    }
  }
}

export function createStack<T>(): {
  push: (item: T) => void
  pop: () => T | undefined
  peek: () => T | undefined
  isEmpty: () => boolean
  size: () => number
  clear: () => void
} {
  const items: T[] = []
  
  return {
    push(item) {
      items.push(item)
    },
    
    pop() {
      return items.pop()
    },
    
    peek() {
      return items[items.length - 1]
    },
    
    isEmpty() {
      return items.length === 0
    },
    
    size() {
      return items.length
    },
    
    clear() {
      items.length = 0
    }
  }
}

export function binarySearch<T>(
  array: T[],
  target: T,
  compare: (a: T, b: T) => number
): number {
  let left = 0
  let right = array.length - 1
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const comparison = compare(array[mid], target)
    
    if (comparison === 0) {
      return mid
    } else if (comparison < 0) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  
  return -1
}

export function quickSort<T>(array: T[], compare: (a: T, b: T) => number): T[] {
  if (array.length <= 1) {
    return array
  }
  
  const pivot = array[0]
  const left: T[] = []
  const right: T[] = []
  
  for (let i = 1; i < array.length; i++) {
    if (compare(array[i], pivot) < 0) {
      left.push(array[i])
    } else {
      right.push(array[i])
    }
  }
  
  return [...quickSort(left, compare), pivot, ...quickSort(right, compare)]
}

export function mergeSort<T>(array: T[], compare: (a: T, b: T) => number): T[] {
  if (array.length <= 1) {
    return array
  }
  
  const mid = Math.floor(array.length / 2)
  const left = mergeSort(array.slice(0, mid), compare)
  const right = mergeSort(array.slice(mid), compare)
  
  const result: T[] = []
  let leftIndex = 0
  let rightIndex = 0
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (compare(left[leftIndex], right[rightIndex]) <= 0) {
      result.push(left[leftIndex])
      leftIndex++
    } else {
      result.push(right[rightIndex])
      rightIndex++
    }
  }
  
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
}

export function heapSort<T>(array: T[], compare: (a: T, b: T) => number): T[] {
  const result = [...array]
  const n = result.length
  
  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(result, n, i, compare)
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [result[0], result[i]] = [result[i], result[0]]
    heapify(result, i, 0, compare)
  }
  
  return result
}

function heapify<T>(array: T[], n: number, i: number, compare: (a: T, b: T) => number): void {
  let largest = i
  const left = 2 * i + 1
  const right = 2 * i + 2
  
  if (left < n && compare(array[left], array[largest]) > 0) {
    largest = left
  }
  
  if (right < n && compare(array[right], array[largest]) > 0) {
    largest = right
  }
  
  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]]
    heapify(array, n, largest, compare)
  }
}

export function insertionSort<T>(array: T[], compare: (a: T, b: T) => number): T[] {
  const result = [...array]
  
  for (let i = 1; i < result.length; i++) {
    const key = result[i]
    let j = i - 1
    
    while (j >= 0 && compare(result[j], key) > 0) {
      result[j + 1] = result[j]
      j--
    }
    
    result[j + 1] = key
  }
  
  return result
}

export function selectionSort<T>(array: T[], compare: (a: T, b: T) => number): T[] {
  const result = [...array]
  
  for (let i = 0; i < result.length - 1; i++) {
    let minIndex = i
    
    for (let j = i + 1; j < result.length; j++) {
      if (compare(result[j], result[minIndex]) < 0) {
        minIndex = j
      }
    }
    
    if (minIndex !== i) {
      [result[i], result[minIndex]] = [result[minIndex], result[i]]
    }
  }
  
  return result
}

export function bubbleSort<T>(array: T[], compare: (a: T, b: T) => number): T[] {
  const result = [...array]
  const n = result.length
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (compare(result[j], result[j + 1]) > 0) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]]
      }
    }
  }
  
  return result
}

export function countingSort(array: number[]): number[] {
  if (array.length === 0) return []
  
  const max = Math.max(...array)
  const min = Math.min(...array)
  const range = max - min + 1
  const count = new Array(range).fill(0)
  const result = new Array(array.length)
  
  // Count occurrences
  for (const num of array) {
    count[num - min]++
  }
  
  // Calculate positions
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1]
  }
  
  // Build result array
  for (let i = array.length - 1; i >= 0; i--) {
    const num = array[i]
    result[count[num - min] - 1] = num
    count[num - min]--
  }
  
  return result
}

export function radixSort(array: number[]): number[] {
  if (array.length === 0) return []
  
  const max = Math.max(...array)
  const result = [...array]
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const count = new Array(10).fill(0)
    const output = new Array(result.length)
    
    // Count occurrences
    for (let i = 0; i < result.length; i++) {
      const digit = Math.floor(result[i] / exp) % 10
      count[digit]++
    }
    
    // Calculate positions
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1]
    }
    
    // Build output array
    for (let i = result.length - 1; i >= 0; i--) {
      const digit = Math.floor(result[i] / exp) % 10
      output[count[digit] - 1] = result[i]
      count[digit]--
    }
    
    // Copy to result
    for (let i = 0; i < result.length; i++) {
      result[i] = output[i]
    }
  }
  
  return result
}

export function bucketSort(array: number[], bucketSize: number = 5): number[] {
  if (array.length === 0) return []
  
  const min = Math.min(...array)
  const max = Math.max(...array)
  const bucketCount = Math.floor((max - min) / bucketSize) + 1
  const buckets: number[][] = Array.from({ length: bucketCount }, () => [])
  
  // Distribute elements into buckets
  for (const num of array) {
    const bucketIndex = Math.floor((num - min) / bucketSize)
    buckets[bucketIndex].push(num)
  }
  
  // Sort individual buckets and concatenate
  const result: number[] = []
  for (const bucket of buckets) {
    if (bucket.length > 0) {
      bucket.sort((a, b) => a - b)
      result.push(...bucket)
    }
  }
  
  return result
}

export function cartesianProduct<T>(...arrays: T[][]): T[][] {
  if (arrays.length === 0) return [[]]
  
  const [first, ...rest] = arrays
  const restProduct = cartesianProduct(...rest)
  
  return first.flatMap(item => 
    restProduct.map(combination => [item, ...combination])
  )
}

export function permutations<T>(array: T[]): T[][] {
  if (array.length === 0) return [[]]
  
  const result: T[][] = []
  for (let i = 0; i < array.length; i++) {
    const current = array[i]
    const remaining = array.slice(0, i).concat(array.slice(i + 1))
    const remainingPermutations = permutations(remaining)
    
    for (const permutation of remainingPermutations) {
      result.push([current, ...permutation])
    }
  }
  
  return result
}

export function combinations<T>(array: T[], k: number): T[][] {
  if (k === 0) return [[]]
  if (k > array.length) return []
  
  if (k === array.length) return [array]
  
  const [first, ...rest] = array
  const withoutFirst = combinations(rest, k)
  const withFirst = combinations(rest, k - 1).map(combination => [first, ...combination])
  
  return [...withoutFirst, ...withFirst]
}

export function powerSet<T>(array: T[]): T[][] {
  const result: T[][] = [[]]
  
  for (const item of array) {
    const newSubsets = result.map(subset => [...subset, item])
    result.push(...newSubsets)
  }
  
  return result
}

export function subsets<T>(array: T[], minSize: number = 0, maxSize: number = array.length): T[][] {
  const result: T[][] = []
  
  for (let size = minSize; size <= maxSize; size++) {
    result.push(...combinations(array, size))
  }
  
  return result
}

export function intersect<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return []
  
  const [first, ...rest] = arrays
  return first.filter(item => 
    rest.every(array => array.includes(item))
  )
}

export function union<T>(...arrays: T[][]): T[] {
  const set = new Set<T>()
  for (const array of arrays) {
    for (const item of array) {
      set.add(item)
    }
  }
  return Array.from(set)
}

export function difference<T>(minuend: T[], subtrahend: T[]): T[] {
  const subtrahendSet = new Set(subtrahend)
  return minuend.filter(item => !subtrahendSet.has(item))
}

export function symmetricDifference<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return []
  if (arrays.length === 1) return arrays[0]
  
  const [first, second, ...rest] = arrays
  let result = [
    ...difference(first, second),
    ...difference(second, first)
  ]
  
  for (const array of rest) {
    result = symmetricDifference(result, array)
  }
  
  return result
}

export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const truthy: T[] = []
  const falsy: T[] = []
  
  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item)
    } else {
      falsy.push(item)
    }
  }
  
  return [truthy, falsy]
}

export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  const groups = {} as Record<K, T[]>
  
  for (const item of array) {
    const key = keySelector(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
  }
  
  return groups
}

export function keyBy<T, K extends string | number | symbol>(
  array: T[],
  keySelector: (item: T) => K
): Record<K, T> {
  const result = {} as Record<K, T>
  
  for (const item of array) {
    const key = keySelector(item)
    result[key] = item
  }
  
  return result
}

export function countBy<T, K extends string | number | symbol>(
  array: T[],
  keySelector: (item: T) => K
): Record<K, number> {
  const counts = {} as Record<K, number>
  
  for (const item of array) {
    const key = keySelector(item)
    counts[key] = (counts[key] || 0) + 1
  }
  
  return counts
}

export function sumBy<T>(array: T[], valueSelector: (item: T) => number): number {
  return array.reduce((sum, item) => sum + valueSelector(item), 0)
}

export function averageBy<T>(array: T[], valueSelector: (item: T) => number): number {
  if (array.length === 0) return 0
  return sumBy(array, valueSelector) / array.length
}

export function minBy<T>(array: T[], valueSelector: (item: T) => number): T | null {
  if (array.length === 0) return null
  
  let minItem = array[0]
  let minValue = valueSelector(minItem)
  
  for (let i = 1; i < array.length; i++) {
    const value = valueSelector(array[i])
    if (value < minValue) {
      minValue = value
      minItem = array[i]
    }
  }
  
  return minItem
}

export function maxBy<T>(array: T[], valueSelector: (item: T) => number): T | null {
  if (array.length === 0) return null
  
  let maxItem = array[0]
  let maxValue = valueSelector(maxItem)
  
  for (let i = 1; i < array.length; i++) {
    const value = valueSelector(array[i])
    if (value > maxValue) {
      maxValue = value
      maxItem = array[i]
    }
  }
  
  return maxItem
}

export function uniqBy<T, K>(array: T[], keySelector: (item: T) => K): T[] {
  const seen = new Set<K>()
  const result: T[] = []
  
  for (const item of array) {
    const key = keySelector(item)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }
  
  return result
}

export function uniq<T>(array: T[]): T[] {
  return uniqBy(array, item => item)
}

export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export function flatten<T>(array: (T | T[])[]): T[] {
  const result: T[] = []
  
  function flattenHelper(items: (T | T[])[]): void {
    for (const item of items) {
      if (Array.isArray(item)) {
        flattenHelper(item)
      } else {
        result.push(item)
      }
    }
  }
  
  flattenHelper(array)
  return result
}

export function compact<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item != null)
}

export function without<T>(array: T[], ...values: T[]): T[] {
  const excludeSet = new Set(values)
  return array.filter(item => !excludeSet.has(item))
}

export function xor<T>(...arrays: T[][]): T[] {
  const frequency = new Map<T, number>()
  
  for (const array of arrays) {
    for (const item of array) {
      frequency.set(item, (frequency.get(item) || 0) + 1)
    }
  }
  
  return Array.from(frequency.entries())
    .filter(([, count]) => count === 1)
    .map(([item]) => item)
}

export function sample<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  return array[Math.floor(Math.random() * array.length)]
}

export function sampleSize<T>(array: T[], n: number): T[] {
  if (n >= array.length) return [...array]
  
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  
  return result.slice(0, n)
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function reverse<T>(array: T[]): T[] {
  return [...array].reverse()
}

export function take<T>(array: T[], n: number): T[] {
  return array.slice(0, n)
}

export function takeRight<T>(array: T[], n: number): T[] {
  return array.slice(Math.max(0, array.length - n))
}

export function drop<T>(array: T[], n: number): T[] {
  return array.slice(n)
}

export function dropRight<T>(array: T[], n: number): T[] {
  return array.slice(0, Math.max(0, array.length - n))
}

export function takeWhile<T>(array: T[], predicate: (item: T) => boolean): T[] {
  const result: T[] = []
  for (const item of array) {
    if (predicate(item)) {
      result.push(item)
    } else {
      break
    }
  }
  return result
}

export function dropWhile<T>(array: T[], predicate: (item: T) => boolean): T[] {
  let index = 0
  while (index < array.length && predicate(array[index])) {
    index++
  }
  return array.slice(index)
}

export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
  const length = Math.min(array1.length, array2.length)
  const result: [T, U][] = []
  
  for (let i = 0; i < length; i++) {
    result.push([array1[i], array2[i]])
  }
  
  return result
}

export function zipWith<T, U, V>(
  array1: T[],
  array2: U[],
  combiner: (a: T, b: U) => V
): V[] {
  const length = Math.min(array1.length, array2.length)
  const result: V[] = []
  
  for (let i = 0; i < length; i++) {
    result.push(combiner(array1[i], array2[i]))
  }
  
  return result
}

export function unzip<T, U>(pairs: [T, U][]): [T[], U[]] {
  const array1: T[] = []
  const array2: U[] = []
  
  for (const [a, b] of pairs) {
    array1.push(a)
    array2.push(b)
  }
  
  return [array1, array2]
}

export function transpose<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0) return []
  
  const rows = matrix.length
  const cols = matrix[0].length
  const result: T[][] = []
  
  for (let j = 0; j < cols; j++) {
    const row: T[] = []
    for (let i = 0; i < rows; i++) {
      row.push(matrix[i][j])
    }
    result.push(row)
  }
  
  return result
}

export function rotate<T>(array: T[], n: number): T[] {
  const length = array.length
  if (length === 0) return []
  
  const normalizedN = ((n % length) + length) % length
  return [...array.slice(normalizedN), ...array.slice(0, normalizedN)]
}

export function rotateLeft<T>(array: T[], n: number): T[] {
  return rotate(array, -n)
}

export function rotateRight<T>(array: T[], n: number): T[] {
  return rotate(array, n)
}

export function padStart<T>(array: T[], length: number, fillValue: T): T[] {
  if (array.length >= length) return [...array]
  
  const padding = Array(length - array.length).fill(fillValue)
  return [...padding, ...array]
}

export function padEnd<T>(array: T[], length: number, fillValue: T): T[] {
  if (array.length >= length) return [...array]
  
  const padding = Array(length - array.length).fill(fillValue)
  return [...array, ...padding]
}

export function pad<T>(array: T[], length: number, fillValue: T): T[] {
  if (array.length >= length) return [...array]
  
  const totalPadding = length - array.length
  const startPadding = Math.floor(totalPadding / 2)
  const endPadding = totalPadding - startPadding
  
  return [
    ...Array(startPadding).fill(fillValue),
    ...array,
    ...Array(endPadding).fill(fillValue)
  ]
}

export function repeat<T>(array: T[], n: number): T[] {
  const result: T[] = []
  for (let i = 0; i < n; i++) {
    result.push(...array)
  }
  return result
}

export function times<T>(n: number, mapper: (index: number) => T): T[] {
  const result: T[] = []
  for (let i = 0; i < n; i++) {
    result.push(mapper(i))
  }
  return result
}

export function range(start: number, end?: number, step: number = 1): number[] {
  if (end === undefined) {
    end = start
    start = 0
  }
  
  const result: number[] = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  
  return result
}

export function linspace(start: number, end: number, num: number): number[] {
  if (num <= 0) return []
  if (num === 1) return [start]
  
  const step = (end - start) / (num - 1)
  const result: number[] = []
  
  for (let i = 0; i < num; i++) {
    result.push(start + i * step)
  }
  
  return result
}

export function logspace(start: number, end: number, num: number, base: number = 10): number[] {
  const logs = linspace(start, end, num)
  return logs.map(log => Math.pow(base, log))
}

export function geomspace(start: number, end: number, num: number): number[] {
  if (start <= 0 || end <= 0) {
    throw new Error('Start and end must be positive numbers')
  }
  
  const ratio = Math.pow(end / start, 1 / (num - 1))
  const result: number[] = []
  
  for (let i = 0; i < num; i++) {
    result.push(start * Math.pow(ratio, i))
  }
  
  return result
}

export function arange(start: number, end: number, step: number = 1): number[] {
  const result: number[] = []
  
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i)
    }
  } else if (step < 0) {
    for (let i = start; i > end; i += step) {
      result.push(i)
    }
  }
  
  return result
}

export function meshgrid(...arrays: number[][]): number[][][] {
  if (arrays.length === 0) return []
  
  const sizes = arrays.map(arr => arr.length)
  const totalSize = sizes.reduce((prod, size) => prod * size, 1)
  
  return arrays.map((array, dimIndex) => {
    const repeatCount = sizes.slice(0, dimIndex).reduce((prod, size) => prod * size, 1)
    const tileCount = sizes.slice(dimIndex + 1).reduce((prod, size) => prod * size, 1)
    
    const result: number[] = []
    for (let tile = 0; tile < tileCount; tile++) {
      for (const value of array) {
        for (let repeat = 0; repeat < repeatCount; repeat++) {
          result.push(value)
        }
      }
    }
    
    return result
  })
}

export function indices(array: any[]): number[] {
  return range(array.length)
}

export function unravelIndex(index: number, shape: number[]): number[] {
  const result: number[] = []
  let remainingIndex = index
  
  for (let i = shape.length - 1; i >= 0; i--) {
    const size = shape[i]
    result.unshift(remainingIndex % size)
    remainingIndex = Math.floor(remainingIndex / size)
  }
  
  return result
}

export function ravelMultiIndex(indices: number[], shape: number[]): number {
  let index = 0
  let stride = 1
  
  for (let i = shape.length - 1; i >= 0; i--) {
    index += indices[i] * stride
    stride *= shape[i]
  }
  
  return index
}

export function diagonal<T>(matrix: T[][], offset: number = 0): T[] {
  const rows = matrix.length
  const cols = matrix[0]?.length || 0
  
  const result: T[] = []
  
  if (offset >= 0) {
    const startCol = offset
    const maxRow = Math.min(rows, cols - startCol)
    for (let i = 0; i < maxRow; i++) {
      result.push(matrix[i][i + startCol])
    }
  } else {
    const startRow = -offset
    const maxCol = Math.min(cols, rows - startRow)
    for (let i = 0; i < maxCol; i++) {
      result.push(matrix[i + startRow][i])
    }
  }
  
  return result
}

export function trace<T>(matrix: T[][]): T {
  return diagonal(matrix).reduce((sum, val) => {
    if (typeof sum === 'number' && typeof val === 'number') {
      return sum + val
    }
    return sum
  }, 0 as T)
}

export function identity(n: number): number[][] {
  const result: number[][] = []
  for (let i = 0; i < n; i++) {
    const row: number[] = []
    for (let j = 0; j < n; j++) {
      row.push(i === j ? 1 : 0)
    }
    result.push(row)
  }
  return result
}

export function zeros(shape: number[]): number[][] {
  if (shape.length === 1) {
    return Array(shape[0]).fill(0)
  }
  
  const result: number[][] = []
  for (let i = 0; i < shape[0]; i++) {
    result.push(zeros(shape.slice(1)) as number[])
  }
  return result
}

export function ones(shape: number[]): number[][] {
  if (shape.length === 1) {
    return Array(shape[0]).fill(1)
  }
  
  const result: number[][] = []
  for (let i = 0; i < shape[0]; i++) {
    result.push(ones(shape.slice(1)) as number[])
  }
  return result
}

export function full(shape: number[], value: number): number[][] {
  if (shape.length === 1) {
    return Array(shape[0]).fill(value)
  }
  
  const result: number[][] = []
  for (let i = 0; i < shape[0]; i++) {
    result.push(full(shape.slice(1), value) as number[])
  }
  return result
}

export function eye(n: number, m?: number): number[][] {
  const cols = m || n
  const result: number[][] = []
  
  for (let i = 0; i < n; i++) {
    const row: number[] = []
    for (let j = 0; j < cols; j++) {
      row.push(i === j ? 1 : 0)
    }
    result.push(row)
  }
  
  return result
}

export function triu(matrix: number[][], k: number = 0): number[][] {
  const rows = matrix.length
  const cols = matrix[0]?.length || 0
  const result: number[][] = []
  
  for (let i = 0; i < rows; i++) {
    const row: number[] = []
    for (let j = 0; j < cols; j++) {
      row.push(j >= i - k ? matrix[i][j] : 0)
    }
    result.push(row)
  }
  
  return result
}

export function tril(matrix: number[][], k: number = 0): number[][] {
  const rows = matrix.length
  const cols = matrix[0]?.length || 0
  const result: number[][] = []
  
  for (let i = 0; i < rows; i++) {
    const row: number[] = []
    for (let j = 0; j < cols; j++) {
      row.push(j <= i - k ? matrix[i][j] : 0)
    }
    result.push(row)
  }
  
  return result
}

export function flip(matrix: number[][]): number[][] {
  return matrix.map(row => [...row].reverse())
}

export function fliplr(matrix: number[][]): number[][] {
  return flip(matrix)
}

export function flipud(matrix: number[][]): number[][] {
  return [...matrix].reverse()
}

export function rot90(matrix: number[][], k: number = 1): number[][] {
  const rotations = ((k % 4) + 4) % 4
  let result = matrix
  
  for (let i = 0; i < rotations; i++) {
    result = transpose(result).map(row => row.reverse())
  }
  
  return result
}

export function reshape<T>(array: T[], shape: number[]): T[][] {
  const totalSize = shape.reduce((prod, size) => prod * size, 1)
  
  if (array.length !== totalSize) {
    throw new Error(`Cannot reshape array of length ${array.length} into shape ${shape}`)
  }
  
  if (shape.length === 1) {
    return array as any
  }
  
  const result: T[][] = []
  const subArraySize = shape.slice(1).reduce((prod, size) => prod * size, 1)
  
  for (let i = 0; i < shape[0]; i++) {
    const start = i * subArraySize
    const end = start + subArraySize
    result.push(reshape(array.slice(start, end), shape.slice(1)))
  }
  
  return result
}

export function squeeze<T>(array: T[][]): T[] {
  if (array.length === 1) {
    return array[0] as any
  }
  throw new Error('Cannot squeeze array with more than one element')
}

export function expandDims<T>(array: T[], axis: number): T[][] {
  if (axis === 0) {
    return [array]
  } else if (axis === 1) {
    return array.map(item => [item])
  } else {
    throw new Error('Axis must be 0 or 1')
  }
}

export function concatenate<T>(arrays: T[][], axis: number = 0): T[][] {
  if (axis === 0) {
    return arrays.flat()
  } else if (axis === 1) {
    if (arrays.length === 0) return []
    
    const result: T[][] = []
    for (let i = 0; i < arrays[0].length; i++) {
      const row: T[] = []
      for (const array of arrays) {
        if (i < array.length) {
          row.push(array[i])
        }
      }
      result.push(row)
    }
    return result
  } else {
    throw new Error('Axis must be 0 or 1')
  }
}

export function stack<T>(arrays: T[][]): T[][] {
  return arrays
}

export function vstack<T>(arrays: T[][]): T[][] {
  return arrays.flat()
}

export function hstack<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return []
  
  const maxLength = Math.max(...arrays.map(arr => arr.length))
  const result: T[][] = []
  
  for (let i = 0; i < maxLength; i++) {
    const row: T[] = []
    for (const array of arrays) {
      if (i < array.length) {
        row.push(array[i])
      }
    }
    result.push(row)
  }
  
  return result
}

export function dstack<T>(arrays: T[][][]): T[][][] {
  if (arrays.length === 0) return []
  
  const rows = arrays[0].length
  const cols = arrays[0][0]?.length || 0
  
  const result: T[][][] = []
  
  for (let i = 0; i < rows; i++) {
    const row: T[][] = []
    for (let j = 0; j < cols; j++) {
      const depth: T[] = []
      for (const array of arrays) {
        if (i < array.length && j < array[i].length) {
          depth.push(array[i][j])
        }
      }
      row.push(depth)
    }
    result.push(row)
  }
  
  return result
}

export function columnStack<T>(arrays: T[][]): T[][] {
  return hstack(arrays)
}

export function rowStack<T>(arrays: T[][]): T[][] {
  return vstack(arrays)
}

export function dsplit<T>(array: T[][], sections: number): T[][][] {
  if (sections <= 0) {
    throw new Error('Number of sections must be positive')
  }
  
  const cols = array[0]?.length || 0
  const sectionSize = Math.floor(cols / sections)
  const result: T[][][] = []
  
  for (let i = 0; i < sections; i++) {
    const startCol = i * sectionSize
    const endCol = i === sections - 1 ? cols : startCol + sectionSize
    
    const section: T[][] = []
    for (const row of array) {
      section.push(row.slice(startCol, endCol))
    }
    result.push(section)
  }
  
  return result
}

export function hsplit<T>(array: T[][], sections: number): T[][][] {
  return dsplit(array, sections)
}

export function vsplit<T>(array: T[][], sections: number): T[][][] {
  if (sections <= 0) {
    throw new Error('Number of sections must be positive')
  }
  
  const rows = array.length
  const sectionSize = Math.floor(rows / sections)
  const result: T[][][] = []
  
  for (let i = 0; i < sections; i++) {
    const startRow = i * sectionSize
    const endRow = i === sections - 1 ? rows : startRow + sectionSize
    result.push(array.slice(startRow, endRow))
  }
  
  return result
}

export function split<T>(array: T[][], sections: number, axis: number = 0): T[][][] {
  if (axis === 0) {
    return vsplit(array, sections)
  } else if (axis === 1) {
    return hsplit(array, sections)
  } else {
    throw new Error('Axis must be 0 or 1')
  }
}

export function arraySplit<T>(array: T[][], indices: number[], axis: number = 0): T[][][] {
  if (axis === 0) {
    const result: T[][][] = []
    let start = 0
    
    for (const index of indices) {
      result.push(array.slice(start, index))
      start = index
    }
    result.push(array.slice(start))
    
    return result
  } else if (axis === 1) {
    const result: T[][][] = []
    let start = 0
    
    for (const index of indices) {
      const section: T[][] = []
      for (const row of array) {
        section.push(row.slice(start, index))
      }
      result.push(section)
      start = index
    }
    
    const lastSection: T[][] = []
    for (const row of array) {
      lastSection.push(row.slice(start))
    }
    result.push(lastSection)
    
    return result
  } else {
    throw new Error('Axis must be 0 or 1')
  }
}

export function tile<T>(array: T[], reps: number[]): T[] {
  if (reps.length === 1) {
    return repeat(array, reps[0])
  }
  
  let result = array
  for (let i = reps.length - 1; i >= 0; i--) {
    result = repeat(result, reps[i])
  }
  
  return result
}

export function repeatElements<T>(array: T[], repeats: number[]): T[] {
  if (array.length !== repeats.length) {
    throw new Error('Array and repeats must have the same length')
  }
  
  const result: T[] = []
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < repeats[i]; j++) {
      result.push(array[i])
    }
  }
  
  return result
}

export function deleteElements<T>(array: T[], indices: number[]): T[] {
  const indexSet = new Set(indices)
  return array.filter((_, index) => !indexSet.has(index))
}

export function insert<T>(array: T[], index: number, values: T[]): T[] {
  return [...array.slice(0, index), ...values, ...array.slice(index)]
}

export function append<T>(array: T[], values: T[]): T[] {
  return [...array, ...values]
}

export function prepend<T>(array: T[], values: T[]): T[] {
  return [...values, ...array]
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function setdiff1d<T>(ar1: T[], ar2: T[]): T[] {
  const set2 = new Set(ar2)
  return ar1.filter(item => !set2.has(item))
}

export function intersect1d<T>(ar1: T[], ar2: T[]): T[] {
  const set2 = new Set(ar2)
  return ar1.filter(item => set2.has(item))
}

export function union1d<T>(ar1: T[], ar2: T[]): T[] {
  return unique([...ar1, ...ar2])
}

export function in1d<T>(ar1: T[], ar2: T[]): boolean[] {
  const set2 = new Set(ar2)
  return ar1.map(item => set2.has(item))
}

export function setxor1d<T>(ar1: T[], ar2: T[]): T[] {
  const set1 = new Set(ar1)
  const set2 = new Set(ar2)
  
  return [
    ...ar1.filter(item => !set2.has(item)),
    ...ar2.filter(item => !set1.has(item))
  ]
}

export function isin<T>(element: T, testElements: T[]): boolean {
  return testElements.includes(element)
}

export function searchsorted<T>(array: T[], value: T, side: 'left' | 'right' = 'left'): number {
  let left = 0
  let right = array.length
  
  if (side === 'left') {
    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      if ((array[mid] as any) < (value as any)) {
        left = mid + 1
      } else {
        right = mid
      }
    }
  } else {
    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      if ((array[mid] as any) <= (value as any)) {
        left = mid + 1
      } else {
        right = mid
      }
    }
  }
  
  return left
}

export function digitize<T>(array: T[], bins: T[], right: boolean = false): number[] {
  return array.map(value => {
    if (right) {
      return searchsorted(bins, value, 'right')
    } else {
      return searchsorted(bins, value, 'left')
    }
  })
}

export function histogram<T>(array: T[], bins: number = 10): { counts: number[]; binEdges: T[] } {
  if (array.length === 0) {
    return { counts: [], binEdges: [] }
  }
  
  const min = Math.min(...(array as any[]))
  const max = Math.max(...(array as any[]))
  const binWidth = (max - min) / bins
  
  const binEdges: T[] = []
  const counts = new Array(bins).fill(0)
  
  for (let i = 0; i <= bins; i++) {
    binEdges.push((min + i * binWidth) as any)
  }
  
  for (const value of array) {
    const binIndex = Math.min(Math.floor(((value as any) - min) / binWidth), bins - 1)
    counts[binIndex]++
  }
  
  return { counts, binEdges }
}

export function histogram2d<T>(x: T[], y: T[], bins: number = 10): { counts: number[]; xedges: T[]; yedges: T[] } {
  const xHist = histogram(x, bins)
  const yHist = histogram(y, bins)
  
  const counts: number[] = []
  for (let i = 0; i < bins; i++) {
    for (let j = 0; j < bins; j++) {
      const xMin = xHist.binEdges[i]
      const xMax = xHist.binEdges[i + 1]
      const yMin = yHist.binEdges[j]
      const yMax = yHist.binEdges[j + 1]
      
      let count = 0
      for (let k = 0; k < x.length; k++) {
        if ((x[k] as any) >= xMin && (x[k] as any) < xMax &&
            (y[k] as any) >= yMin && (y[k] as any) < yMax) {
          count++
        }
      }
      counts.push(count)
    }
  }
  
  return { counts, xedges: xHist.binEdges, yedges: yHist.binEdges }
}

export function corrcoef(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length')
  }
  
  const n = x.length
  const sumX = x.reduce((sum, val) => sum + val, 0)
  const sumY = y.reduce((sum, val) => sum + val, 0)
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0)
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0)
  const sumY2 = y.reduce((sum, val) => sum + val * val, 0)
  
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  
  return denominator === 0 ? 0 : numerator / denominator
}

export function cov(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error('Arrays must have the same length')
  }
  
  const n = x.length
  const meanX = x.reduce((sum, val) => sum + val, 0) / n
  const meanY = y.reduce((sum, val) => sum + val, 0) / n
  
  const covariance = x.reduce((sum, val, i) => sum + (val - meanX) * (y[i] - meanY), 0) / n
  
  return covariance
}

export function std(array: number[]): number {
  const mean = array.reduce((sum, val) => sum + val, 0) / array.length
  const variance = array.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / array.length
  return Math.sqrt(variance)
}

export function variance(array: number[]): number {
  const mean = array.reduce((sum, val) => sum + val, 0) / array.length
  return array.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / array.length
}

export function mean(array: number[]): number {
  return array.reduce((sum, val) => sum + val, 0) / array.length
}

export function median(array: number[]): number {
  const sorted = [...array].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  } else {
    return sorted[mid]
  }
}

export function mode<T>(array: T[]): T[] {
  const frequency = new Map<T, number>()
  
  for (const item of array) {
    frequency.set(item, (frequency.get(item) || 0) + 1)
  }
  
  const maxFrequency = Math.max(...frequency.values())
  return Array.from(frequency.entries())
    .filter(([, count]) => count === maxFrequency)
    .map(([item]) => item)
}

export function percentile(array: number[], p: number): number {
  const sorted = [...array].sort((a, b) => a - b)
  const index = (p / 100) * (sorted.length - 1)
  
  if (Number.isInteger(index)) {
    return sorted[index]
  } else {
    const lower = Math.floor(index)
    const upper = Math.ceil(index)
    const weight = index - lower
    return sorted[lower] * (1 - weight) + sorted[upper] * weight
  }
}

export function quantile(array: number[], q: number): number {
  return percentile(array, q * 100)
}

export function iqr(array: number[]): number {
  return percentile(array, 75) - percentile(array, 25)
}

export function zscore(array: number[]): number[] {
  const meanValue = mean(array)
  const stdValue = std(array)
  
  return array.map(value => (value - meanValue) / stdValue)
}

export function normalize(array: number[]): number[] {
  const min = Math.min(...array)
  const max = Math.max(...array)
  
  if (max === min) {
    return array.map(() => 0)
  }
  
  return array.map(value => (value - min) / (max - min))
}

export function standardize(array: number[]): number[] {
  return zscore(array)
}

export function min(array: number[]): number {
  return Math.min(...array)
}

export function max(array: number[]): number {
  return Math.max(...array)
}

export function argmin(array: number[]): number {
  return array.indexOf(Math.min(...array))
}

export function argmax(array: number[]): number {
  return array.indexOf(Math.max(...array))
}

export function argsort(array: number[]): number[] {
  return array
    .map((value, index) => ({ value, index }))
    .sort((a, b) => a.value - b.value)
    .map(item => item.index)
}

export function sort(array: number[]): number[] {
  return [...array].sort((a, b) => a - b)
}

export function sortDescending(array: number[]): number[] {
  return [...array].sort((a, b) => b - a)
}

export function uniqueSorted(array: number[]): number[] {
  return unique(sort(array))
}

export function contains<T>(array: T[], element: T): boolean {
  return array.includes(element)
}

export function count<T>(array: T[], element: T): number {
  return array.filter(item => item === element).length
}

export function frequencies<T>(array: T[]): Map<T, number> {
  const freq = new Map<T, number>()
  
  for (const item of array) {
    freq.set(item, (freq.get(item) || 0) + 1)
  }
  
  return freq
}

export function mostCommon<T>(array: T[]): T[] {
  const freq = frequencies(array)
  const maxCount = Math.max(...freq.values())
  
  return Array.from(freq.entries())
    .filter(([, count]) => count === maxCount)
    .map(([item]) => item)
}

export function leastCommon<T>(array: T[]): T[] {
  const freq = frequencies(array)
  const minCount = Math.min(...freq.values())
  
  return Array.from(freq.entries())
    .filter(([, count]) => count === minCount)
    .map(([item]) => item)
}

export function summary<T>(array: T[]): {
  count: number
  unique: number
  mostCommon: T[]
  leastCommon: T[]
  frequencies: Map<T, number>
} {
  const freq = frequencies(array)
  const maxCount = Math.max(...freq.values())
  const minCount = Math.min(...freq.values())
  
  return {
    count: array.length,
    unique: freq.size,
    mostCommon: Array.from(freq.entries())
      .filter(([, count]) => count === maxCount)
      .map(([item]) => item),
    leastCommon: Array.from(freq.entries())
      .filter(([, count]) => count === minCount)
      .map(([item]) => item),
    frequencies: freq
  }
}

export function describe(array: number[]): {
  count: number
  mean: number
  std: number
  min: number
  max: number
  q25: number
  median: number
  q75: number
  iqr: number
  skewness: number
  kurtosis: number
} {
  const sorted = [...array].sort((a, b) => a - b)
  const meanValue = mean(array)
  const stdValue = std(array)
  const n = array.length
  
  const q1 = percentile(array, 25)
  const q3 = percentile(array, 75)
  const medianValue = median(array)
  
  // Calculate skewness
  const skewness = array.reduce((sum, val) => sum + Math.pow((val - meanValue) / stdValue, 3), 0) / n
  
  // Calculate kurtosis
  const kurtosis = array.reduce((sum, val) => sum + Math.pow((val - meanValue) / stdValue, 4), 0) / n - 3
  
  return {
    count: n,
    mean: meanValue,
    std: stdValue,
    min: sorted[0],
    max: sorted[n - 1],
    q25: q1,
    median: medianValue,
    q75: q3,
    iqr: q3 - q1,
    skewness,
    kurtosis
  }
}

export function rolling(array: number[], window: number, operation: 'mean' | 'sum' | 'min' | 'max' | 'std' = 'mean'): number[] {
  const result: number[] = []
  
  for (let i = 0; i <= array.length - window; i++) {
    const windowData = array.slice(i, i + window)
    
    switch (operation) {
      case 'mean':
        result.push(mean(windowData))
        break
      case 'sum':
        result.push(windowData.reduce((sum, val) => sum + val, 0))
        break
      case 'min':
        result.push(min(windowData))
        break
      case 'max':
        result.push(max(windowData))
        break
      case 'std':
        result.push(std(windowData))
        break
    }
  }
  
  return result
}

export function diff(array: number[]): number[] {
  const result: number[] = []
  for (let i = 1; i < array.length; i++) {
    result.push(array[i] - array[i - 1])
  }
  return result
}

export function gradient(array: number[]): number[] {
  const result: number[] = []
  
  for (let i = 0; i < array.length; i++) {
    if (i === 0) {
      result.push(array[1] - array[0])
    } else if (i === array.length - 1) {
      result.push(array[i] - array[i - 1])
    } else {
      result.push((array[i + 1] - array[i - 1]) / 2)
    }
  }
  
  return result
}

export function cumsum(array: number[]): number[] {
  const result: number[] = []
  let sum = 0
  
  for (const value of array) {
    sum += value
    result.push(sum)
  }
  
  return result
}

export function cumprod(array: number[]): number[] {
  const result: number[] = []
  let product = 1
  
  for (const value of array) {
    product *= value
    result.push(product)
  }
  
  return result
}

export function cummax(array: number[]): number[] {
  const result: number[] = []
  let currentMax = -Infinity
  
  for (const value of array) {
    currentMax = Math.max(currentMax, value)
    result.push(currentMax)
  }
  
  return result
}

export function cummin(array: number[]): number[] {
  const result: number[] = []
  let currentMin = Infinity
  
  for (const value of array) {
    currentMin = Math.min(currentMin, value)
    result.push(currentMin)
  }
  
  return result
}

export function trapz(y: number[], x?: number[]): number {
  if (!x) {
    x = range(y.length)
  }
  
  if (y.length !== x.length) {
    throw new Error('x and y must have the same length')
  }
  
  let area = 0
  for (let i = 0; i < y.length - 1; i++) {
    area += (x[i + 1] - x[i]) * (y[i] + y[i + 1]) / 2
  }
  
  return area
}

export function simps(y: number[], x?: number[]): number {
  if (!x) {
    x = range(y.length)
  }
  
  if (y.length !== x.length) {
    throw new Error('x and y must have the same length')
  }
  
  if (y.length < 3) {
    return trapz(y, x)
  }
  
  let area = 0
  
  // First and last terms (coeff = 1)
  area += (x[1] - x[0]) * y[0] / 3
  area += (x[y.length - 1] - x[y.length - 2]) * y[y.length - 1] / 3
  
  // Middle terms
  for (let i = 1; i < y.length - 1; i++) {
    const coeff = i % 2 === 0 ? 2 : 4
    area += (x[i + 1] - x[i - 1]) * y[i] * coeff / 3
  }
  
  return area
}

export function interp(x: number[], xp: number[], fp: number[]): number[] {
  if (xp.length !== fp.length) {
    throw new Error('xp and fp must have the same length')
  }
  
  return x.map(xi => {
    if (xi <= xp[0]) return fp[0]
    if (xi >= xp[xp.length - 1]) return fp[fp.length - 1]
    
    for (let i = 0; i < xp.length - 1; i++) {
      if (xi >= xp[i] && xi <= xp[i + 1]) {
        const t = (xi - xp[i]) / (xp[i + 1] - xp[i])
        return fp[i] + t * (fp[i + 1] - fp[i])
      }
    }
    
    return 0 // Should never reach here
  })
}