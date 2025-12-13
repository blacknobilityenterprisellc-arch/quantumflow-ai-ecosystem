import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest'
import { 
  cn, 
  formatDate, 
  formatTime, 
  formatDateTime, 
  generateId, 
  slugify, 
  truncate, 
  capitalize, 
  debounce, 
  throttle, 
  isValidEmail, 
  isValidUrl, 
  formatBytes, 
  sleep, 
  getInitials, 
  randomColor, 
  copyToClipboard, 
  downloadFile, 
  parseQueryParams, 
  buildQueryParams, 
  isObject, 
  deepMerge, 
  createCache, 
  generateUUID, 
  compareVersions, 
  sanitizeHtml, 
  escapeRegex, 
  isJsonString, 
  safeJsonParse, 
  formatCurrency, 
  formatNumber, 
  getRelativeTime, 
  retry, 
  createEventEmitter, 
  measurePerformance, 
  measureAsyncPerformance, 
  noop, 
  identityFunction, 
  constantFunction, 
  compose, 
  pipe, 
  curry, 
  uncurry, 
  memoize, 
  once, 
  createPromiseWithResolvers, 
  createAbortablePromise, 
  batchPromises, 
  createQueue, 
  createStack, 
  binarySearch, 
  quickSort, 
  mergeSort, 
  heapSort, 
  insertionSort, 
  selectionSort, 
  bubbleSort, 
  countingSort, 
  radixSort, 
  bucketSort, 
  cartesianProduct, 
  permutations, 
  combinations, 
  powerSet, 
  subsets, 
  intersect, 
  union, 
  difference, 
  symmetricDifference, 
  partition, 
  groupBy, 
  keyBy, 
  countBy, 
  sumBy, 
  averageBy, 
  minBy, 
  maxBy, 
  uniqBy, 
  uniq, 
  chunk, 
  flatten, 
  compact, 
  without, 
  xor, 
  sample, 
  sampleSize, 
  shuffle, 
  reverse, 
  take, 
  takeRight, 
  drop, 
  dropRight, 
  takeWhile, 
  dropWhile, 
  zip, 
  zipWith, 
  unzip, 
  transpose, 
  rotate, 
  rotateLeft, 
  rotateRight, 
  padStart, 
  padEnd, 
  pad, 
  repeat, 
  times, 
  range, 
  linspace, 
  logspace, 
  geomspace, 
  arange, 
  meshgrid, 
  indices, 
  unravelIndex, 
  ravelMultiIndex, 
  diagonal, 
  trace, 
  identity, 
  zeros, 
  ones, 
  full, 
  eye, 
  triu, 
  tril, 
  flip, 
  fliplr, 
  flipud, 
  rot90, 
  reshape, 
  squeeze, 
  expandDims, 
  concatenate, 
  stack, 
  vstack, 
  hstack, 
  dstack, 
  columnStack, 
  rowStack, 
  dsplit, 
  hsplit, 
  vsplit, 
  split, 
  arraySplit, 
  tile, 
  repeatElements, 
  deleteElements, 
  insert, 
  append, 
  prepend, 
  unique, 
  setdiff1d, 
  intersect1d, 
  union1d, 
  in1d, 
  setxor1d, 
  isin, 
  searchsorted, 
  digitize, 
  histogram, 
  histogram2d, 
  corrcoef, 
  cov, 
  std, 
  variance, 
  mean, 
  median, 
  mode, 
  percentile, 
  quantile, 
  iqr, 
  zscore, 
  normalize, 
  standardize, 
  min, 
  max, 
  argmin, 
  argmax, 
  argsort, 
  sort, 
  sortDescending, 
  uniqueSorted, 
  contains, 
  count, 
  frequencies, 
  mostCommon, 
  leastCommon, 
  summary, 
  describe, 
  rolling, 
  diff, 
  gradient, 
  cumsum, 
  cumprod, 
  cummax, 
  cummin, 
  trapz, 
  simps, 
  interp, 
} from '@/lib/utils'

describe('Utils Library', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
      expect(cn('foo', { bar: true })).toBe('foo bar')
      expect(cn('foo', { bar: false })).toBe('foo')
      expect(cn('foo', { bar: true, baz: false })).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      expect(cn('foo', null, undefined, '')).toBe('foo')
      expect(cn('foo', 'bar', null)).toBe('foo bar')
    })

    it('should handle arrays', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
      expect(cn(['foo', { bar: true }])).toBe('foo bar')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-25')
      const result = formatDate(date)
      expect(result).toContain('2023')
      expect(result).toContain('December')
      expect(result).toContain('25')
    })

    it('should handle string input', () => {
      const result = formatDate('2023-12-25')
      expect(result).toContain('2023')
      expect(result).toContain('December')
      expect(result).toContain('25')
    })
  })

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2023-12-25T14:30:00')
      const result = formatTime(date)
      expect(result).toContain('2:30')
      expect(result).toContain('PM')
    })

    it('should handle string input', () => {
      const result = formatTime('2023-12-25T14:30:00')
      expect(result).toContain('2:30')
      expect(result).toContain('PM')
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2023-12-25T14:30:00')
      const result = formatDateTime(date)
      expect(result).toContain('December')
      expect(result).toContain('25')
      expect(result).toContain('2:30')
      expect(result).toContain('PM')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world')
      expect(slugify('Hello World & Universe')).toBe('hello-world-universe')
      expect(slugify('  Hello   World  ')).toBe('hello-world')
    })

    it('should handle empty string', () => {
      expect(slugify('')).toBe('')
    })
  })

  describe('truncate', () => {
    it('should truncate text correctly', () => {
      expect(truncate('Hello World', 5)).toBe('Hello')
      expect(truncate('Hello World', 11)).toBe('Hello World')
      expect(truncate('Hello World', 8)).toBe('Hello...')
    })

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('HELLO')).toBe('HELLO')
      expect(capitalize('')).toBe('')
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      expect(fn).not.toHaveBeenCalled()
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)
      
      throttledFn()
      throttledFn()
      throttledFn()
      
      expect(fn).toHaveBeenCalledTimes(1)
      
      await new Promise(resolve => setTimeout(resolve, 150))
      throttledFn()
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('isValidEmail', () => {
    it('should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('test.name@example.com')).toBe(true)
      expect(isValidEmail('test@example.co.uk')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should validate URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('ftp://example.com')).toBe(true)
      expect(isValidUrl('invalid-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(1048576)).toBe('1 MB')
      expect(formatBytes(1073741824)).toBe('1 GB')
    })

    it('should handle decimal places', () => {
      expect(formatBytes(1500, 3)).toBe('1.465 KB')
    })
  })

  describe('sleep', () => {
    it('should resolve after specified time', async () => {
      const start = Date.now()
      await sleep(100)
      const end = Date.now()
      expect(end - start).toBeGreaterThanOrEqual(90)
    })
  })

  describe('getInitials', () => {
    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('John')).toBe('J')
      expect(getInitials('John Middle Doe')).toBe('JD')
      expect(getInitials('')).toBe('')
    })
  })

  describe('randomColor', () => {
    it('should return a valid color', () => {
      const color = randomColor()
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
  })

  describe('copyToClipboard', () => {
    it('should copy text to clipboard', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText
        }
      })

      await copyToClipboard('test text')
      expect(mockWriteText).toHaveBeenCalledWith('test text')
    })

    it('should fallback to execCommand when clipboard API not available', async () => {
      Object.assign(navigator, {
        clipboard: undefined
      })

      const mockExecCommand = vi.fn()
      Object.assign(document, {
        execCommand: mockExecCommand
      })

      await copyToClipboard('test text')
      expect(mockExecCommand).toHaveBeenCalledWith('copy')
    })
  })

  describe('downloadFile', () => {
    it('should download file', () => {
      const mockCreateElement = vi.fn()
      const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url')
      const mockRevokeObjectURL = vi.fn()
      
      Object.assign(document, {
        createElement: mockCreateElement
      })
      
      Object.assign(window, {
        URL: {
          createObjectURL: mockCreateObjectURL,
          revokeObjectURL: mockRevokeObjectURL
        }
      })

      downloadFile('test content', 'test.txt')
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
  })

  describe('parseQueryParams', () => {
    it('should parse query parameters', () => {
      const result = parseQueryParams('https://example.com?foo=bar&baz=qux')
      expect(result).toEqual({ foo: 'bar', baz: 'qux' })
    })

    it('should handle empty query string', () => {
      const result = parseQueryParams('https://example.com')
      expect(result).toEqual({})
    })
  })

  describe('buildQueryParams', () => {
    it('should build query parameters', () => {
      const result = buildQueryParams({ foo: 'bar', baz: 'qux' })
      expect(result).toBe('foo=bar&baz=qux')
    })

    it('should handle null and undefined values', () => {
      const result = buildQueryParams({ foo: 'bar', baz: null, qux: undefined })
      expect(result).toBe('foo=bar')
    })
  })

  describe('isObject', () => {
    it('should check if value is object', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ foo: 'bar' })).toBe(true)
      expect(isObject([])).toBe(false)
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(123)).toBe(false)
    })
  })

  describe('deepMerge', () => {
    it('should merge objects deeply', () => {
      const target = { a: 1, b: { c: 2 } }
      const source = { b: { d: 3 }, e: 4 }
      const result = deepMerge(target, source)
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 })
    })

    it('should not modify original objects', () => {
      const target = { a: 1 }
      const source = { b: 2 }
      const result = deepMerge(target, source)
      expect(target).toEqual({ a: 1 })
      expect(source).toEqual({ b: 2 })
    })
  })

  describe('createCache', () => {
    it('should create a cache with LRU behavior', () => {
      const cache = createCache(2)
      
      cache.set('a', 1)
      cache.set('b', 2)
      expect(cache.get('a')).toBe(1)
      expect(cache.get('b')).toBe(2)
      
      cache.set('c', 3)
      expect(cache.get('a')).toBe(undefined)
      expect(cache.get('b')).toBe(2)
      expect(cache.get('c')).toBe(3)
    })

    it('should track cache size', () => {
      const cache = createCache(3)
      expect(cache.size()).toBe(0)
      
      cache.set('a', 1)
      expect(cache.size()).toBe(1)
      
      cache.set('b', 2)
      expect(cache.size()).toBe(2)
    })
  })

  describe('generateUUID', () => {
    it('should generate a valid UUID', () => {
      const uuid = generateUUID()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID()
      const uuid2 = generateUUID()
      expect(uuid1).not.toBe(uuid2)
    })
  })

  describe('compareVersions', () => {
    it('should compare versions correctly', () => {
      expect(compareVersions('1.0.0', '1.0.1')).toBe(-1)
      expect(compareVersions('1.0.1', '1.0.0')).toBe(1)
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0)
      expect(compareVersions('1.0.0', '1.0')).toBe(0)
      expect(compareVersions('1.0', '1.0.0')).toBe(0)
    })
  })

  describe('sanitizeHtml', () => {
    it('should sanitize HTML', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      expect(sanitizeHtml('Hello <b>World</b>')).toBe('Hello &lt;b&gt;World&lt;/b&gt;')
    })
  })

  describe('escapeRegex', () => {
    it('should escape regex special characters', () => {
      expect(escapeRegex('test.*+')).toBe('test\\.\\.\\*\\+')
      expect(escapeRegex('[a-z]')).toBe('\\[a-z\\]')
    })
  })

  describe('isJsonString', () => {
    it('should check if string is valid JSON', () => {
      expect(isJsonString('{"a": 1}')).toBe(true)
      expect(isJsonString('[1, 2, 3]')).toBe(true)
      expect(isJsonString('invalid')).toBe(false)
      expect(isJsonString('')).toBe(true)
    })
  })

  describe('safeJsonParse', () => {
    it('should parse JSON safely', () => {
      expect(safeJsonParse('{"a": 1}', {})).toEqual({ a: 1 })
      expect(safeJsonParse('invalid', {})).toEqual({})
      expect(safeJsonParse('null', {})).toBe(null)
    })
  })

  describe('formatCurrency', () => {
    it('should format currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56')
      expect(formatNumber(1234.56, { minimumFractionDigits: 2 })).toBe('1,234.56')
    })
  })

  describe('getRelativeTime', () => {
    it('should get relative time', () => {
      const now = new Date()
      expect(getRelativeTime(now)).toBe('Just now')
      
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      expect(getRelativeTime(oneHourAgo)).toBe('1 hour ago')
      
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      expect(getRelativeTime(twoDaysAgo)).toBe('2 days ago')
    })
  })

  describe('retry', () => {
    it('should retry function on failure', async () => {
      const failingFn = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValueOnce('success')
      
      const result = await retry(failingFn, 3, 10)
      expect(result).toBe('success')
      expect(failingFn).toHaveBeenCalledTimes(2)
    })

    it('should fail after max attempts', async () => {
      const failingFn = vi.fn().mockRejectedValue(new Error('Always fails'))
      
      await expect(retry(failingFn, 2, 10)).rejects.toThrow('Always fails')
      expect(failingFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('createEventEmitter', () => {
    it('should create an event emitter', () => {
      const emitter = createEventEmitter()
      const listener = vi.fn()
      
      emitter.on('test', listener)
      emitter.emit('test', 'data')
      
      expect(listener).toHaveBeenCalledWith('data')
    })

    it('should handle multiple listeners', () => {
      const emitter = createEventEmitter()
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      
      emitter.on('test', listener1)
      emitter.on('test', listener2)
      emitter.emit('test', 'data')
      
      expect(listener1).toHaveBeenCalledWith('data')
      expect(listener2).toHaveBeenCalledWith('data')
    })

    it('should remove listeners', () => {
      const emitter = createEventEmitter()
      const listener = vi.fn()
      
      emitter.on('test', listener)
      emitter.off('test', listener)
      emitter.emit('test', 'data')
      
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('measurePerformance', () => {
    it('should measure function performance', () => {
      const fn = () => Math.random()
      const { result, duration } = measurePerformance(fn, 'test')
      
      expect(typeof result).toBe('number')
      expect(typeof duration).toBe('number')
      expect(duration).toBeGreaterThanOrEqual(0)
    })
  })

  describe('measureAsyncPerformance', () => {
    it('should measure async function performance', async () => {
      const fn = async () => Math.random()
      const { result, duration } = await measureAsyncPerformance(fn, 'test')
      
      expect(typeof result).toBe('number')
      expect(typeof duration).toBe('number')
      expect(duration).toBeGreaterThanOrEqual(0)
    })
  })

  describe('noop', () => {
    it('should be a no-op function', () => {
      expect(noop()).toBeUndefined()
    })
  })

  describe('identityFunction', () => {
    it('should return the input value', () => {
      expect(identityFunction(42)).toBe(42)
      expect(identityFunction('hello')).toBe('hello')
      expect(identityFunction(null)).toBe(null)
    })
  })

  describe('constantFunction', () => {
    it('should return a function that always returns the same value', () => {
      const fn = constantFunction(42)
      expect(fn()).toBe(42)
      expect(fn()).toBe(42)
      expect(fn()).toBe(42)
    })
  })

  describe('compose', () => {
    it('should compose functions', () => {
      const add1 = (x: number) => x + 1
      const multiply2 = (x: number) => x * 2
      const composed = compose(multiply2, add1)
      
      expect(composed(5)).toBe(12) // (5 + 1) * 2
    })
  })

  describe('pipe', () => {
    it('should pipe functions', () => {
      const add1 = (x: number) => x + 1
      const multiply2 = (x: number) => x * 2
      const piped = pipe(add1, multiply2)
      
      expect(piped(5)).toBe(12) // (5 + 1) * 2
    })
  })

  describe('curry', () => {
    it('should curry a function', () => {
      const add = (a: number, b: number) => a + b
      const curriedAdd = curry(add)
      
      expect(curriedAdd(1)(2)).toBe(3)
      expect(curriedAdd(1, 2)).toBe(3)
    })
  })

  describe('uncurry', () => {
    it('should uncurry a function', () => {
      const add = (a: number) => (b: number) => a + b
      const uncurriedAdd = uncurry(add)
      
      expect(uncurriedAdd(1, 2)).toBe(3)
    })
  })

  describe('memoize', () => {
    it('should memoize a function', () => {
      const expensiveFn = vi.fn((x: number) => x * 2)
      const memoizedFn = memoize(expensiveFn)
      
      expect(memoizedFn(5)).toBe(10)
      expect(memoizedFn(5)).toBe(10)
      expect(memoizedFn(6)).toBe(12)
      
      expect(expensiveFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('once', () => {
    it('should call function only once', () => {
      const fn = vi.fn(() => 'result')
      const onceFn = once(fn)
      
      expect(onceFn()).toBe('result')
      expect(onceFn()).toBe('result')
      expect(onceFn()).toBe('result')
      
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('createPromiseWithResolvers', () => {
    it('should create promise with resolvers', () => {
      const { promise, resolve, reject } = createPromiseWithResolvers<string>()
      
      resolve('success')
      
      return promise.then(result => {
        expect(result).toBe('success')
      })
    })
  })

  describe('createAbortablePromise', () => {
    it('should create abortable promise', () => {
      const executor = vi.fn()
      const { promise, abort } = createAbortablePromise(executor)
      
      expect(executor).toHaveBeenCalledWith(expect.any(AbortSignal))
      
      abort()
      
      return promise.catch(error => {
        expect(error.name).toBe('AbortError')
      })
    })
  })

  describe('batchPromises', () => {
    it('should process promises in batches', async () => {
      const processor = vi.fn((x: number) => x * 2)
      const items = [1, 2, 3, 4, 5]
      
      const result = await batchPromises(items, 2, processor)
      
      expect(result).toEqual([2, 4, 6, 8, 10])
      expect(processor).toHaveBeenCalledTimes(5)
    })
  })

  describe('createQueue', () => {
    it('should create a queue', () => {
      const queue = createQueue<number>()
      
      expect(queue.isEmpty()).toBe(true)
      expect(queue.size()).toBe(0)
      
      queue.enqueue(1)
      queue.enqueue(2)
      
      expect(queue.isEmpty()).toBe(false)
      expect(queue.size()).toBe(2)
      expect(queue.peek()).toBe(1)
      
      expect(queue.dequeue()).toBe(1)
      expect(queue.dequeue()).toBe(2)
      expect(queue.dequeue()).toBeUndefined()
    })
  })

  describe('createStack', () => {
    it('should create a stack', () => {
      const stack = createStack<number>()
      
      expect(stack.isEmpty()).toBe(true)
      expect(stack.size()).toBe(0)
      
      stack.push(1)
      stack.push(2)
      
      expect(stack.isEmpty()).toBe(false)
      expect(stack.size()).toBe(2)
      expect(stack.peek()).toBe(2)
      
      expect(stack.pop()).toBe(2)
      expect(stack.pop()).toBe(1)
      expect(stack.pop()).toBeUndefined()
    })
  })

  describe('binarySearch', () => {
    it('should perform binary search', () => {
      const array = [1, 3, 5, 7, 9]
      const compare = (a: number, b: number) => a - b
      
      expect(binarySearch(array, 5, compare)).toBe(2)
      expect(binarySearch(array, 6, compare)).toBe(-1)
      expect(binarySearch(array, 1, compare)).toBe(0)
      expect(binarySearch(array, 9, compare)).toBe(4)
    })
  })

  describe('quickSort', () => {
    it('should sort array using quick sort', () => {
      const array = [5, 2, 8, 1, 9]
      const compare = (a: number, b: number) => a - b
      
      const result = quickSort(array, compare)
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('mergeSort', () => {
    it('should sort array using merge sort', () => {
      const array = [5, 2, 8, 1, 9]
      const compare = (a: number, b: number) => a - b
      
      const result = mergeSort(array, compare)
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('heapSort', () => {
    it('should sort array using heap sort', () => {
      const array = [5, 2, 8, 1, 9]
      const compare = (a: number, b: number) => a - b
      
      const result = heapSort(array, compare)
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('insertionSort', () => {
    it('should sort array using insertion sort', () => {
      const array = [5, 2, 8, 1, 9]
      const compare = (a: number, b: number) => a - b
      
      const result = insertionSort(array, compare)
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('selectionSort', () => {
    it('should sort array using selection sort', () => {
      const array = [5, 2, 8, 1, 9]
      const compare = (a: number, b: number) => a - b
      
      const result = selectionSort(array, compare)
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('bubbleSort', () => {
    it('should sort array using bubble sort', () => {
      const array = [5, 2, 8, 1, 9]
      const compare = (a: number, b: number) => a - b
      
      const result = bubbleSort(array, compare)
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('countingSort', () => {
    it('should sort array using counting sort', () => {
      const array = [5, 2, 8, 1, 9]
      
      const result = countingSort(array)
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('radixSort', () => {
    it('should sort array using radix sort', () => {
      const array = [5, 2, 8, 1, 9]
      
      const result = radixSort(array)
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('bucketSort', () => {
    it('should sort array using bucket sort', () => {
      const array = [5, 2, 8, 1, 9]
      
      const result = bucketSort(array)
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('cartesianProduct', () => {
    it('should compute cartesian product', () => {
      const result = cartesianProduct([1, 2], ['a', 'b'])
      expect(result).toEqual([[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']])
    })

    it('should handle empty arrays', () => {
      expect(cartesianProduct()).toEqual([[]])
      expect(cartesianProduct([])).toEqual([[]])
    })
  })

  describe('permutations', () => {
    it('should compute permutations', () => {
      const result = permutations([1, 2, 3])
      expect(result).toHaveLength(6)
      expect(result).toContain([1, 2, 3])
      expect(result).toContain([1, 3, 2])
      expect(result).toContain([2, 1, 3])
      expect(result).toContain([2, 3, 1])
      expect(result).toContain([3, 1, 2])
      expect(result).toContain([3, 2, 1])
    })

    it('should handle empty array', () => {
      expect(permutations([])).toEqual([[]])
    })
  })

  describe('combinations', () => {
    it('should compute combinations', () => {
      const result = combinations([1, 2, 3], 2)
      expect(result).toEqual([[1, 2], [1, 3], [2, 3]])
    })

    it('should handle edge cases', () => {
      expect(combinations([1, 2, 3], 0)).toEqual([[]])
      expect(combinations([1, 2, 3], 3)).toEqual([[1, 2, 3]])
      expect(combinations([1, 2, 3], 4)).toEqual([])
    })
  })

  describe('powerSet', () => {
    it('should compute power set', () => {
      const result = powerSet([1, 2])
      expect(result).toEqual([[], [1], [2], [1, 2]])
    })

    it('should handle empty array', () => {
      expect(powerSet([])).toEqual([[]])
    })
  })

  describe('subsets', () => {
    it('should compute subsets', () => {
      const result = subsets([1, 2, 3], 1, 2)
      expect(result).toEqual([[1], [2], [3], [1, 2], [1, 3], [2, 3]])
    })
  })

  describe('intersect', () => {
    it('should compute intersection', () => {
      const result = intersect([1, 2, 3], [2, 3, 4], [3, 4, 5])
      expect(result).toEqual([3])
    })

    it('should handle empty arrays', () => {
      expect(intersect([1, 2], [])).toEqual([])
      expect(intersect()).toEqual([])
    })
  })

  describe('union', () => {
    it('should compute union', () => {
      const result = union([1, 2], [2, 3], [3, 4])
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('should handle empty arrays', () => {
      expect(union([1, 2], [])).toEqual([1, 2])
      expect(union()).toEqual([])
    })
  })

  describe('difference', () => {
    it('should compute difference', () => {
      const result = difference([1, 2, 3, 4], [2, 3])
      expect(result).toEqual([1, 4])
    })
  })

  describe('symmetricDifference', () => {
    it('should compute symmetric difference', () => {
      const result = symmetricDifference([1, 2, 3], [2, 3, 4])
      expect(result).toEqual([1, 4])
    })
  })

  describe('partition', () => {
    it('should partition array', () => {
      const result = partition([1, 2, 3, 4, 5, 6], x => x % 2 === 0)
      expect(result).toEqual([[2, 4, 6], [1, 3, 5]])
    })
  })

  describe('groupBy', () => {
    it('should group by key', () => {
      const result = groupBy(['apple', 'banana', 'apricot'], x => x[0])
      expect(result).toEqual({
        a: ['apple', 'apricot'],
        b: ['banana']
      })
    })
  })

  describe('keyBy', () => {
    it('should key by selector', () => {
      const result = keyBy([{ id: 1, name: 'a' }, { id: 2, name: 'b' }], x => x.id)
      expect(result).toEqual({
        1: { id: 1, name: 'a' },
        2: { id: 2, name: 'b' }
      })
    })
  })

  describe('countBy', () => {
    it('should count by key', () => {
      const result = countBy(['apple', 'banana', 'apricot'], x => x[0])
      expect(result).toEqual({
        a: 2,
        b: 1
      })
    })
  })

  describe('sumBy', () => {
    it('should sum by selector', () => {
      const result = sumBy([{ value: 1 }, { value: 2 }, { value: 3 }], x => x.value)
      expect(result).toBe(6)
    })
  })

  describe('averageBy', () => {
    it('should average by selector', () => {
      const result = averageBy([{ value: 1 }, { value: 2 }, { value: 3 }], x => x.value)
      expect(result).toBe(2)
    })

    it('should handle empty array', () => {
      expect(averageBy([], x => x.value)).toBe(0)
    })
  })

  describe('minBy', () => {
    it('should find minimum by selector', () => {
      const result = minBy([{ value: 3 }, { value: 1 }, { value: 2 }], x => x.value)
      expect(result).toEqual({ value: 1 })
    })

    it('should handle empty array', () => {
      expect(minBy([], x => x.value)).toBeNull()
    })
  })

  describe('maxBy', () => {
    it('should find maximum by selector', () => {
      const result = maxBy([{ value: 1 }, { value: 3 }, { value: 2 }], x => x.value)
      expect(result).toEqual({ value: 3 })
    })

    it('should handle empty array', () => {
      expect(maxBy([], x => x.value)).toBeNull()
    })
  })

  describe('uniqBy', () => {
    it('should get unique by selector', () => {
      const result = uniqBy([{ id: 1 }, { id: 2 }, { id: 1 }], x => x.id)
      expect(result).toEqual([{ id: 1 }, { id: 2 }])
    })
  })

  describe('uniq', () => {
    it('should get unique values', () => {
      const result = uniq([1, 2, 1, 3, 2])
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('chunk', () => {
    it('should chunk array', () => {
      const result = chunk([1, 2, 3, 4, 5], 2)
      expect(result).toEqual([[1, 2], [3, 4], [5]])
    })
  })

  describe('flatten', () => {
    it('should flatten array', () => {
      const result = flatten([1, [2, [3, 4]], 5])
      expect(result).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('compact', () => {
    it('should compact array', () => {
      const result = compact([1, null, undefined, 2, '', 3])
      expect(result).toEqual([1, 2, '', 3])
    })
  })

  describe('without', () => {
    it('should remove elements', () => {
      const result = without([1, 2, 3, 4, 5], 2, 4)
      expect(result).toEqual([1, 3, 5])
    })
  })

  describe('xor', () => {
    it('should compute XOR', () => {
      const result = xor([1, 2, 3], [2, 3, 4], [3, 4, 5])
      expect(result).toEqual([1, 5])
    })
  })

  describe('sample', () => {
    it('should sample random element', () => {
      const array = [1, 2, 3, 4, 5]
      const result = sample(array)
      expect(array).toContain(result)
    })

    it('should handle empty array', () => {
      expect(sample([])).toBeUndefined()
    })
  })

  describe('sampleSize', () => {
    it('should sample multiple elements', () => {
      const array = [1, 2, 3, 4, 5]
      const result = sampleSize(array, 3)
      expect(result).toHaveLength(3)
      expect(array).toEqual(expect.arrayContaining(result))
    })

    it('should handle n >= array length', () => {
      const array = [1, 2, 3]
      const result = sampleSize(array, 5)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const array = [1, 2, 3, 4, 5]
      const result = shuffle(array)
      expect(result).toHaveLength(5)
      expect(array).toEqual(expect.arrayContaining(result))
    })
  })

  describe('reverse', () => {
    it('should reverse array', () => {
      const result = reverse([1, 2, 3, 4, 5])
      expect(result).toEqual([5, 4, 3, 2, 1])
    })
  })

  describe('take', () => {
    it('should take first n elements', () => {
      const result = take([1, 2, 3, 4, 5], 3)
      expect(result).toEqual([1, 2, 3])
    })

    it('should handle n > array length', () => {
      const result = take([1, 2, 3], 5)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('takeRight', () => {
    it('should take last n elements', () => {
      const result = takeRight([1, 2, 3, 4, 5], 3)
      expect(result).toEqual([3, 4, 5])
    })

    it('should handle n > array length', () => {
      const result = takeRight([1, 2, 3], 5)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('drop', () => {
    it('should drop first n elements', () => {
      const result = drop([1, 2, 3, 4, 5], 2)
      expect(result).toEqual([3, 4, 5])
    })

    it('should handle n > array length', () => {
      const result = drop([1, 2, 3], 5)
      expect(result).toEqual([])
    })
  })

  describe('dropRight', () => {
    it('should drop last n elements', () => {
      const result = dropRight([1, 2, 3, 4, 5], 2)
      expect(result).toEqual([1, 2, 3])
    })

    it('should handle n > array length', () => {
      const result = dropRight([1, 2, 3], 5)
      expect(result).toEqual([])
    })
  })

  describe('takeWhile', () => {
    it('should take while predicate is true', () => {
      const result = takeWhile([1, 2, 3, 4, 5], x => x < 4)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('dropWhile', () => {
    it('should drop while predicate is true', () => {
      const result = dropWhile([1, 2, 3, 4, 5], x => x < 4)
      expect(result).toEqual([4, 5])
    })
  })

  describe('zip', () => {
    it('should zip arrays', () => {
      const result = zip([1, 2, 3], ['a', 'b', 'c'])
      expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']])
    })

    it('should handle different lengths', () => {
      const result = zip([1, 2, 3, 4], ['a', 'b'])
      expect(result).toEqual([[1, 'a'], [2, 'b']])
    })
  })

  describe('zipWith', () => {
    it('should zip with combiner', () => {
      const result = zipWith([1, 2, 3], ['a', 'b', 'c'], (a, b) => `${a}${b}`)
      expect(result).toEqual(['1a', '2b', '3c'])
    })
  })

  describe('unzip', () => {
    it('should unzip pairs', () => {
      const result = unzip([[1, 'a'], [2, 'b'], [3, 'c']])
      expect(result).toEqual([[1, 2, 3], ['a', 'b', 'c']])
    })
  })

  describe('transpose', () => {
    it('should transpose matrix', () => {
      const result = transpose([[1, 2, 3], [4, 5, 6]])
      expect(result).toEqual([[1, 4], [2, 5], [3, 6]])
    })

    it('should handle empty matrix', () => {
      expect(transpose([])).toEqual([])
    })
  })

  describe('rotate', () => {
    it('should rotate array', () => {
      expect(rotate([1, 2, 3, 4, 5], 2)).toEqual([3, 4, 5, 1, 2])
      expect(rotate([1, 2, 3, 4, 5], -2)).toEqual([4, 5, 1, 2, 3])
    })

    it('should handle empty array', () => {
      expect(rotate([], 2)).toEqual([])
    })
  })

  describe('rotateLeft', () => {
    it('should rotate left', () => {
      const result = rotateLeft([1, 2, 3, 4, 5], 2)
      expect(result).toEqual([3, 4, 5, 1, 2])
    })
  })

  describe('rotateRight', () => {
    it('should rotate right', () => {
      const result = rotateRight([1, 2, 3, 4, 5], 2)
      expect(result).toEqual([4, 5, 1, 2, 3])
    })
  })

  describe('padStart', () => {
    it('should pad start', () => {
      const result = padStart([1, 2, 3], 5, 0)
      expect(result).toEqual([0, 0, 1, 2, 3])
    })

    it('should handle array longer than length', () => {
      const result = padStart([1, 2, 3], 2, 0)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('padEnd', () => {
    it('should pad end', () => {
      const result = padEnd([1, 2, 3], 5, 0)
      expect(result).toEqual([1, 2, 3, 0, 0])
    })

    it('should handle array longer than length', () => {
      const result = padEnd([1, 2, 3], 2, 0)
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('pad', () => {
    it('should pad both sides', () => {
      const result = pad([1, 2, 3], 5, 0)
      expect(result).toEqual([0, 1, 2, 3, 0])
    })

    it('should handle even padding', () => {
      const result = pad([1, 2], 4, 0)
      expect(result).toEqual([0, 1, 2, 0])
    })
  })

  describe('repeat', () => {
    it('should repeat array', () => {
      const result = repeat([1, 2, 3], 3)
      expect(result).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3])
    })
  })

  describe('times', () => {
    it('should call function n times', () => {
      const result = times(5, i => i * 2)
      expect(result).toEqual([0, 2, 4, 6, 8])
    })
  })

  describe('range', () => {
    it('should create range', () => {
      expect(range(5)).toEqual([0, 1, 2, 3, 4])
      expect(range(2, 5)).toEqual([2, 3, 4])
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
    })
  })

  describe('linspace', () => {
    it('should create linear space', () => {
      const result = linspace(0, 10, 5)
      expect(result).toEqual([0, 2.5, 5, 7.5, 10])
    })

    it('should handle single element', () => {
      const result = linspace(5, 5, 1)
      expect(result).toEqual([5])
    })
  })

  describe('logspace', () => {
    it('should create logarithmic space', () => {
      const result = logspace(0, 2, 3, 10)
      expect(result).toEqual([1, 10, 100])
    })
  })

  describe('geomspace', () => {
    it('should create geometric space', () => {
      const result = geomspace(1, 100, 3)
      expect(result).toEqual([1, 10, 100])
    })

    it('should handle invalid input', () => {
      expect(() => geomspace(-1, 100, 3)).toThrow()
      expect(() => geomspace(1, -100, 3)).toThrow()
    })
  })

  describe('arange', () => {
    it('should create arithmetic progression', () => {
      expect(arange(0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(arange(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
      expect(arange(10, 0, -2)).toEqual([10, 8, 6, 4, 2])
    })
  })

  describe('meshgrid', () => {
    it('should create mesh grid', () => {
      const result = meshgrid([1, 2], [3, 4])
      expect(result).toEqual([
        [1, 1, 3, 3],
        [2, 2, 4, 4]
      ])
    })
  })

  describe('indices', () => {
    it('should create indices', () => {
      const result = indices([1, 2, 3])
      expect(result).toEqual([0, 1, 2])
    })
  })

  describe('unravelIndex', () => {
    it('should unravel index', () => {
      const result = unravelIndex(7, [3, 4])
      expect(result).toEqual([1, 3])
    })
  })

  describe('ravelMultiIndex', () => {
    it('should ravel multi-index', () => {
      const result = ravelMultiIndex([1, 3], [3, 4])
      expect(result).toBe(7)
    })
  })

  describe('diagonal', () => {
    it('should get diagonal', () => {
      const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
      expect(diagonal(matrix)).toEqual([1, 5, 9])
      expect(diagonal(matrix, 1)).toEqual([2, 6])
      expect(diagonal(matrix, -1)).toEqual([4, 8])
    })
  })

  describe('trace', () => {
    it('should compute trace', () => {
      const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
      expect(trace(matrix)).toBe(15)
    })
  })

  describe('identity', () => {
    it('should create identity matrix', () => {
      const result = identity(3)
      expect(result).toEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ])
    })
  })

  describe('zeros', () => {
    it('should create zero matrix', () => {
      const result = zeros([2, 3])
      expect(result).toEqual([
        [0, 0, 0],
        [0, 0, 0]
      ])
    })
  })

  describe('ones', () => {
    it('should create ones matrix', () => {
      const result = ones([2, 3])
      expect(result).toEqual([
        [1, 1, 1],
        [1, 1, 1]
      ])
    })
  })

  describe('full', () => {
    it('should create full matrix', () => {
      const result = full([2, 3], 7)
      expect(result).toEqual([
        [7, 7, 7],
        [7, 7, 7]
      ])
    })
  })

  describe('eye', () => {
    it('should create identity matrix', () => {
      const result = eye(3)
      expect(result).toEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ])
    })

    it('should create rectangular identity matrix', () => {
      const result = eye(2, 3)
      expect(result).toEqual([
        [1, 0, 0],
        [0, 1, 0]
      ])
    })
  })

  describe('triu', () => {
    it('should get upper triangular', () => {
      const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
      const result = triu(matrix)
      expect(result).toEqual([
        [1, 2, 3],
        [0, 5, 6],
        [0, 0, 9]
      ])
    })
  })

  describe('tril', () => {
    it('should get lower triangular', () => {
      const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
      const result = tril(matrix)
      expect(result).toEqual([
        [1, 0, 0],
        [4, 5, 0],
        [7, 8, 9]
      ])
    })
  })

  describe('flip', () => {
    it('should flip matrix horizontally', () => {
      const matrix = [[1, 2, 3], [4, 5, 6]]
      const result = flip(matrix)
      expect(result).toEqual([[3, 2, 1], [6, 5, 4]])
    })
  })

  describe('fliplr', () => {
    it('should flip matrix left-right', () => {
      const matrix = [[1, 2, 3], [4, 5, 6]]
      const result = fliplr(matrix)
      expect(result).toEqual([[3, 2, 1], [6, 5, 4]])
    })
  })

  describe('flipud', () => {
    it('should flip matrix up-down', () => {
      const matrix = [[1, 2, 3], [4, 5, 6]]
      const result = flipud(matrix)
      expect(result).toEqual([[4, 5, 6], [1, 2, 3]])
    })
  })

  describe('rot90', () => {
    it('should rotate matrix 90 degrees', () => {
      const matrix = [[1, 2, 3], [4, 5, 6]]
      const result = rot90(matrix)
      expect(result).toEqual([[4, 1], [5, 2], [6, 3]])
    })

    it('should rotate multiple times', () => {
      const matrix = [[1, 2], [3, 4]]
      const result = rot90(matrix, 2)
      expect(result).toEqual([[4, 3], [2, 1]])
    })
  })

  describe('reshape', () => {
    it('should reshape array', () => {
      const result = reshape([1, 2, 3, 4, 5, 6], [2, 3])
      expect(result).toEqual([[1, 2, 3], [4, 5, 6]])
    })

    it('should handle 1D reshape', () => {
      const result = reshape([1, 2, 3], [3])
      expect(result).toEqual([1, 2, 3])
    })

    it('should handle invalid reshape', () => {
      expect(() => reshape([1, 2, 3], [2, 2])).toThrow()
    })
  })

  describe('squeeze', () => {
    it('should squeeze array', () => {
      const result = squeeze([[1, 2, 3]])
      expect(result).toEqual([1, 2, 3])
    })

    it('should handle multiple elements', () => {
      expect(() => squeeze([[1, 2], [3, 4]])).toThrow()
    })
  })

  describe('expandDims', () => {
    it('should expand dimensions', () => {
      const result = expandDims([1, 2, 3], 0)
      expect(result).toEqual([[1, 2, 3]])
    })

    it('should expand at axis 1', () => {
      const result = expandDims([1, 2, 3], 1)
      expect(result).toEqual([[1], [2], [3]])
    })

    it('should handle invalid axis', () => {
      expect(() => expandDims([1, 2, 3], 2)).toThrow()
    })
  })

  describe('concatenate', () => {
    it('should concatenate along axis 0', () => {
      const result = concatenate([[1, 2], [3, 4]], 0)
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('should concatenate along axis 1', () => {
      const result = concatenate([[1, 2], [3, 4]], 1)
      expect(result).toEqual([[1, 3], [2, 4]])
    })
  })

  describe('stack', () => {
    it('should stack arrays', () => {
      const result = stack([[1, 2], [3, 4]])
      expect(result).toEqual([[1, 2], [3, 4]])
    })
  })

  describe('vstack', () => {
    it('should stack vertically', () => {
      const result = vstack([[1, 2], [3, 4]])
      expect(result).toEqual([1, 2, 3, 4])
    })
  })

  describe('hstack', () => {
    it('should stack horizontally', () => {
      const result = hstack([[1, 2], [3, 4]])
      expect(result).toEqual([[1, 3], [2, 4]])
    })
  })

  describe('dstack', () => {
    it('should stack in 3D', () => {
      const result = dstack([[[1, 2]], [[3, 4]]])
      expect(result).toEqual([[[[1, 3]], [[2, 4]]])
    })
  })

  describe('columnStack', () => {
    it('should stack columns', () => {
      const result = columnStack([[1, 2], [3, 4]])
      expect(result).toEqual([[1, 3], [2, 4]])
    })
  })

  describe('rowStack', () => {
    it('should stack rows', () => {
      const result = rowStack([[1, 2], [3, 4]])
      expect(result).toEqual([1, 2, 3, 4])
    })
  })

  describe('dsplit', () => {
    it('should split depth-wise', () => {
      const result = dsplit([[1, 2, 3], [4, 5, 6]], 2)
      expect(result).toEqual([[[1, 2], [4, 5]], [[3], [6]]])
    })
  })

  describe('hsplit', () => {
    it('should split horizontally', () => {
      const result = hsplit([[1, 2, 3], [4, 5, 6]], 2)
      expect(result).toEqual([[[1, 2], [4, 5]], [[3], [6]]])
    })
  })

  describe('vsplit', () => {
    it('should split vertically', () => {
      const result = vsplit([[1, 2, 3], [4, 5, 6]], 2)
      expect(result).toEqual([[[1, 2, 3]], [[4, 5, 6]]])
    })
  })

  describe('split', () => {
    it('should split along axis', () => {
      const result = split([[1, 2, 3], [4, 5, 6]], 2, 0)
      expect(result).toEqual([[[1, 2, 3]], [[4, 5, 6]]])
    })
  })

  describe('arraySplit', () => {
    it('should split at indices', () => {
      const result = arraySplit([[1, 2, 3], [4, 5, 6]], [1], 0)
      expect(result).toEqual([[[1, 2, 3]], [[4, 5, 6]]])
    })
  })

  describe('tile', () => {
    it('should tile array', () => {
      const result = tile([1, 2], [2, 3])
      expect(result).toEqual([1, 2, 1, 2, 1, 2])
    })
  })

  describe('repeatElements', () => {
    it('should repeat elements', () => {
      const result = repeatElements([1, 2], [2, 3])
      expect(result).toEqual([1, 1, 2, 2, 2])
    })
  })

  describe('deleteElements', () => {
    it('should delete elements at indices', () => {
      const result = deleteElements([1, 2, 3, 4, 5], [1, 3])
      expect(result).toEqual([2, 4, 5])
    })
  })

  describe('insert', () => {
    it('should insert elements', () => {
      const result = insert([1, 2, 5], 2, [3, 4])
      expect(result).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('append', () => {
    it('should append elements', () => {
      const result = append([1, 2], [3, 4])
      expect(result).toEqual([1, 2, 3, 4])
    })
  })

  describe('prepend', () => {
    it('should prepend elements', () => {
      const result = prepend([3, 4], [1, 2])
      expect(result).toEqual([1, 2, 3, 4])
    })
  })

  describe('unique', () => {
    it('should get unique elements', () => {
      const result = unique([1, 2, 1, 3, 2])
      expect(result).toEqual([1, 2, 3])
    })
  })

  describe('setdiff1d', () => {
    it('should compute set difference', () => {
      const result = setdiff1d([1, 2, 3, 4], [2, 3, 5])
      expect(result).toEqual([1, 4])
    })
  })

  describe('intersect1d', () => {
    it('should compute set intersection', () => {
      const result = intersect1d([1, 2, 3], [2, 3, 4])
      expect(result).toEqual([2, 3])
    })
  })

  describe('union1d', () => {
    it('should compute set union', () => {
      const result = union1d([1, 2, 3], [2, 3, 4])
      expect(result).toEqual([1, 2, 3, 4])
    })
  })

  describe('in1d', () => {
    it('should check if elements are in set', () => {
      const result = in1d([1, 2, 3], [2, 3, 4])
      expect(result).toEqual([false, true, true])
    })
  })

  describe('setxor1d', () => {
    it('should compute symmetric difference', () => {
      const result = setxor1d([1, 2, 3], [2, 3, 4])
      expect(result).toEqual([1, 4])
    })
  })

  describe('isin', () => {
    it('should check if element is in array', () => {
      expect(isin(2, [1, 2, 3])).toBe(true)
      expect(isin(4, [1, 2, 3])).toBe(false)
    })
  })

  describe('searchsorted', () => {
    it('should search sorted array', () => {
      const array = [1, 3, 5, 7, 9]
      expect(searchsorted(array, 5)).toBe(2)
      expect(searchsorted(array, 5, 'right')).toBe(3)
      expect(searchsorted(array, 6)).toBe(2)
      expect(searchsorted(array, 6, 'right')).toBe(3)
    })
  })

  describe('digitize', () => {
    it('should digitize array', () => {
      const array = [1, 3, 5, 7, 9]
      const bins = [0, 2, 4, 6, 8, 10]
      const result = digitize(array, bins)
      expect(result).toEqual([1, 2, 2, 3, 4])
    })
  })

  describe('histogram', () => {
    it('should compute histogram', () => {
      const array = [1, 2, 3, 4, 5]
      const result = histogram(array, 5)
      expect(result.counts).toEqual([1, 1, 1, 1, 1])
      expect(result.binEdges).toHaveLength(6)
    })

    it('should handle empty array', () => {
      const result = histogram([], 5)
      expect(result.counts).toEqual([])
      expect(result.binEdges).toEqual([])
    })
  })

  describe('histogram2d', () => {
    it('should compute 2D histogram', () => {
      const x = [1, 2, 3, 4]
      const y = [5, 6, 7, 8]
      const result = histogram2d(x, y, 2)
      expect(result.counts).toHaveLength(4)
      expect(result.xedges).toHaveLength(3)
      expect(result.yedges).toHaveLength(3)
    })
  })

  describe('corrcoef', () => {
    it('should compute correlation coefficient', () => {
      const x = [1, 2, 3, 4, 5]
      const y = [2, 4, 6, 8, 10]
      const result = corrcoef(x, y)
      expect(result).toBe(1)
    })

    it('should handle different lengths', () => {
      expect(() => corrcoef([1, 2, 3], [1, 2])).toThrow()
    })
  })

  describe('cov', () => {
    it('should compute covariance', () => {
      const x = [1, 2, 3, 4, 5]
      const y = [2, 4, 6, 8, 10]
      const result = cov(x, y)
      expect(result).toBe(2)
    })
  })

  describe('std', () => {
    it('should compute standard deviation', () => {
      const result = std([1, 2, 3, 4, 5])
      expect(result).toBeCloseTo(1.414, 2)
    })
  })

  describe('variance', () => {
    it('should compute variance', () => {
      const result = variance([1, 2, 3, 4, 5])
      expect(result).toBe(2)
    })
  })

  describe('mean', () => {
    it('should compute mean', () => {
      const result = mean([1, 2, 3, 4, 5])
      expect(result).toBe(3)
    })
  })

  describe('median', () => {
    it('should compute median', () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3)
      expect(median([1, 2, 3, 4])).toBe(2.5)
    })
  })

  describe('mode', () => {
    it('should compute mode', () => {
      const result = mode([1, 2, 2, 3, 3, 3])
      expect(result).toEqual([3])
    })

    it('should handle multiple modes', () => {
      const result = mode([1, 2, 2, 3, 3])
      expect(result).toEqual([2, 3])
    })
  })

  describe('percentile', () => {
    it('should compute percentile', () => {
      const result = percentile([1, 2, 3, 4, 5], 50)
      expect(result).toBe(3)
    })

    it('should handle fractional percentile', () => {
      const result = percentile([1, 2, 3, 4, 5], 25)
      expect(result).toBe(2)
    })
  })

  describe('quantile', () => {
    it('should compute quantile', () => {
      const result = quantile([1, 2, 3, 4, 5], 0.5)
      expect(result).toBe(3)
    })
  })

  describe('iqr', () => {
    it('should compute interquartile range', () => {
      const result = iqr([1, 2, 3, 4, 5])
      expect(result).toBe(2)
    })
  })

  describe('zscore', () => {
    it('should compute z-scores', () => {
      const result = zscore([1, 2, 3, 4, 5])
      expect(result[0]).toBeCloseTo(-1.264, 2)
      expect(result[2]).toBe(0)
      expect(result[4]).toBeCloseTo(1.264, 2)
    })
  })

  describe('normalize', () => {
    it('should normalize array', () => {
      const result = normalize([1, 2, 3, 4, 5])
      expect(result[0]).toBe(0)
      expect(result[4]).toBe(1)
    })

    it('should handle constant array', () => {
      const result = normalize([3, 3, 3])
      expect(result).toEqual([0, 0, 0])
    })
  })

  describe('standardize', () => {
    it('should standardize array', () => {
      const result = standardize([1, 2, 3, 4, 5])
      expect(result[0]).toBeCloseTo(-1.264, 2)
      expect(result[2]).toBe(0)
      expect(result[4]).toBeCloseTo(1.264, 2)
    })
  })

  describe('min', () => {
    it('should find minimum', () => {
      expect(min([1, 2, 3, 4, 5])).toBe(1)
    })
  })

  describe('max', () => {
    it('should find maximum', () => {
      expect(max([1, 2, 3, 4, 5])).toBe(5)
    })
  })

  describe('argmin', () => {
    it('should find index of minimum', () => {
      expect(argmin([5, 2, 8, 1, 9])).toBe(3)
    })
  })

  describe('argmax', () => {
    it('should find index of maximum', () => {
      expect(argmax([5, 2, 8, 1, 9])).toBe(4)
    })
  })

  describe('argsort', () => {
    it('should get sorted indices', () => {
      const result = argsort([5, 2, 8, 1, 9])
      expect(result).toEqual([3, 1, 0, 2, 4])
    })
  })

  describe('sort', () => {
    it('should sort array', () => {
      const result = sort([5, 2, 8, 1, 9])
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('sortDescending', () => {
    it('should sort array descending', () => {
      const result = sortDescending([5, 2, 8, 1, 9])
      expect(result).toEqual([9, 8, 5, 2, 1])
    })
  })

  describe('uniqueSorted', () => {
    it('should sort and unique array', () => {
      const result = uniqueSorted([5, 2, 8, 1, 9, 2])
      expect(result).toEqual([1, 2, 5, 8, 9])
    })
  })

  describe('contains', () => {
    it('should check if array contains element', () => {
      expect(contains([1, 2, 3, 4, 5], 3)).toBe(true)
      expect(contains([1, 2, 3, 4, 5], 6)).toBe(false)
    })
  })

  describe('count', () => {
    it('should count occurrences', () => {
      expect(count([1, 2, 1, 3, 1], 1)).toBe(3)
      expect(count([1, 2, 3, 4, 5], 6)).toBe(0)
    })
  })

  describe('frequencies', () => {
    it('should compute frequencies', () => {
      const result = frequencies([1, 2, 1, 3, 1])
      expect(result.get(1)).toBe(3)
      expect(result.get(2)).toBe(1)
      expect(result.get(3)).toBe(1)
    })
  })

  describe('mostCommon', () => {
    it('should find most common elements', () => {
      const result = mostCommon([1, 2, 1, 3, 1])
      expect(result).toEqual([1])
    })
  })

  describe('leastCommon', () => {
    it('should find least common elements', () => {
      const result = leastCommon([1, 2, 1, 3, 1])
      expect(result).toEqual([2, 3])
    })
  })

  describe('summary', () => {
    it('should compute summary statistics', () => {
      const result = summary([1, 2, 1, 3, 1])
      expect(result.count).toBe(5)
      expect(result.unique).toBe(3)
      expect(result.mostCommon).toEqual([1])
      expect(result.leastCommon).toEqual([2, 3])
      expect(result.frequencies.get(1)).toBe(3)
    })
  })

  describe('describe', () => {
    it('should compute descriptive statistics', () => {
      const result = describe([1, 2, 3, 4, 5])
      expect(result.count).toBe(5)
      expect(result.mean).toBe(3)
      expect(result.min).toBe(1)
      expect(result.max).toBe(5)
      expect(result.median).toBe(3)
      expect(result.q25).toBe(2)
      expect(result.q75).toBe(4)
      expect(result.iqr).toBe(2)
    })
  })

  describe('rolling', () => {
    it('should compute rolling statistics', () => {
      const result = rolling([1, 2, 3, 4, 5], 3, 'mean')
      expect(result).toEqual([2, 3, 4])
    })
  })

  describe('diff', () => {
    it('should compute differences', () => {
      const result = diff([1, 3, 2, 5, 4])
      expect(result).toEqual([2, -1, 3, -1])
    })
  })

  describe('gradient', () => {
    it('should compute gradient', () => {
      const result = gradient([1, 3, 2, 5, 4])
      expect(result[0]).toBe(2)
      expect(result[1]).toBe(-0.5)
      expect(result[2]).toBe(0.5)
      expect(result[3]).toBe(1.5)
      expect(result[4]).toBe(-0.5)
    })
  })

  describe('cumsum', () => {
    it('should compute cumulative sum', () => {
      const result = cumsum([1, 2, 3, 4, 5])
      expect(result).toEqual([1, 3, 6, 10, 15])
    })
  })

  describe('cumprod', () => {
    it('should compute cumulative product', () => {
      const result = cumprod([1, 2, 3, 4, 5])
      expect(result).toEqual([1, 2, 6, 24, 120])
    })
  })

  describe('cummax', () => {
    it('should compute cumulative maximum', () => {
      const result = cummax([1, 3, 2, 5, 4])
      expect(result).toEqual([1, 3, 3, 5, 5])
    })
  })

  describe('cummin', () => {
    it('should compute cumulative minimum', () => {
      const result = cummin([5, 3, 2, 4, 1])
      expect(result).toEqual([5, 3, 2, 2, 1])
    })
  })

  describe('trapz', () => {
    it('should compute trapezoidal integration', () => {
      const y = [1, 2, 3, 4]
      const result = trapz(y)
      expect(result).toBe(7.5)
    })

    it('should use custom x values', () => {
      const y = [1, 2, 3, 4]
      const x = [0, 1, 2, 3]
      const result = trapz(y, x)
      expect(result).toBe(7.5)
    })
  })

  describe('simps', () => {
    it('should compute Simpson integration', () => {
      const y = [1, 2, 3, 4]
      const result = simps(y)
      expect(result).toBe(8)
    })

    it('should use custom x values', () => {
      const y = [1, 2, 3, 4]
      const x = [0, 1, 2, 3]
      const result = simps(y, x)
      expect(result).toBe(8)
    })
  })

  describe('interp', () => {
    it('should interpolate values', () => {
      const x = [0, 1, 2, 3]
      const xp = [0, 1, 2, 3]
      const fp = [10, 20, 30, 40]
      const result = interp([0.5, 1.5, 2.5], xp, fp)
      expect(result).toEqual([15, 25, 35])
    })

    it('should handle extrapolation', () => {
      const x = [0, 1, 2, 3]
      const xp = [0, 1, 2, 3]
      const fp = [10, 20, 30, 40]
      const result = interp([-1, 0, 2, 4], xp, fp)
      expect(result).toEqual([10, 10, 30, 40])
    })
  })
})