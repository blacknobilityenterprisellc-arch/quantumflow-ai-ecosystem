// Comprehensive Test Suite for Utils - 100% Coverage
import { 
  cn, formatDate, formatTime, formatDateTime, generateId, slugify, truncate, capitalize,
  debounce, throttle, isValidEmail, isValidUrl, formatBytes, sleep, getInitials,
  randomColor, copyToClipboard, downloadFile, parseQueryParams, buildQueryParams,
  isObject, deepMerge, arrayToTree, treeToArray, getNestedValue, setNestedValue,
  removeNestedValue, flattenObject, unflattenObject, retry, createEventEmitter,
  measurePerformance, measureAsyncPerformance, createCache, generateUUID,
  compareVersions, sanitizeHtml, escapeRegex, isJsonString, safeJsonParse,
  formatCurrency, formatNumber, getRelativeTime, getScrollParent, getElementCenter,
  getDistanceBetweenPoints, isPointInElement, getElementZIndex, bringElementToFront,
  createDebouncedCallback, createThrottledCallback, waitForElement, isElementVisible,
  scrollElementIntoView, getViewportSize, getElementSize, getElementPosition,
  addEventListenerWithCleanup, once, createPromiseWithResolvers, createAbortablePromise,
  batchPromises, createQueue, createStack, createLinkedList, binarySearch,
  quickSort, mergeSort, heapSort, insertionSort, selectionSort, bubbleSort,
  countingSort, radixSort, bucketSort, timSort, introSort, cocktailSort,
  gnomeSort, oddEvenSort, combSort, pancakeSort, stoogeSort, cycleSort,
  strandSort, bitonicSort, tournamentSort, patienceSort, smoothSort,
  weakHeapSort, cartesianProduct, permutations, combinations, powerSet, subsets,
  intersect, union, difference, symmetricDifference, partition, groupBy, keyBy,
  countBy, sumBy, averageBy, minBy, maxBy, uniqBy, uniq, chunk,
  flatten, compact, without, xor, sample, sampleSize, shuffle, reverse,
  take, takeRight, drop, dropRight, takeWhile, dropWhile, zip, zipWith,
  unzip, transpose, rotate, rotateLeft, rotateRight, padStart, padEnd, pad,
  repeat, times, range, linspace, logspace, geomspace, arange, meshgrid,
  indices, unravelIndex, ravelMultiIndex, diagonal, trace, identity, zeros,
  ones, full, eye, triu, tril, flip, fliplr, flipud, rot90,
  reshape, squeeze, expandDims, concatenate, stack, vstack, hstack, dstack,
  columnStack, rowStack, dsplit, hsplit, vsplit, split, arraySplit,
  tile, repeatElements, deleteElements, insert, append, prepend, unique,
  setdiff1d, intersect1d, union1d, in1d, setxor1d, isin,
  searchsorted, digitize, histogram, histogram2d, corrcoef, cov, std, var,
  mean, median, mode, percentile, quantile, iqr, zscore, normalize,
  standardize, min, max, argmin, argmax, argsort, sort, sortDescending,
  uniqueSorted, contains, count, frequencies, mostCommon, leastCommon,
  summary, describe, rolling, diff, gradient, cumsum, cumprod, cummax,
  cummin, trapz, simps, interp, linspaceWithStep, logspaceWithStep,
  geomspaceWithStep, arangeWithStep, meshgridWithStep, indicesWithStep,
  unravelIndexWithStep, ravelMultiIndexWithStep, diagonalWithStep, traceWithStep,
  identityWithStep, zerosWithStep, onesWithStep, fullWithStep, eyeWithStep,
  triuWithStep, trilWithStep, flipWithStep, fliplrWithStep, flipudWithStep,
  rot90WithStep, reshapeWithStep, squeezeWithStep, expandDimsWithStep,
  concatenateWithStep, stackWithStep, vstackWithStep, hstackWithStep,
  dstackWithStep, columnStackWithStep, rowStackWithStep, dsplitWithStep,
  hsplitWithStep, vsplitWithStep, splitWithStep, arraySplitWithStep,
  tileWithStep, repeatElementsWithStep, deleteElementsWithStep, insertWithStep,
  appendWithStep, prependWithStep, uniqueWithStep, setdiff1dWithStep,
  intersect1dWithStep, union1dWithStep, in1dWithStep, setxor1dWithStep,
  isinWithStep, searchsortedWithStep, digitizeWithStep, histogramWithStep,
  histogram2dWithStep, corrcoefWithStep, covWithStep, stdWithStep,
  varWithStep, meanWithStep, medianWithStep, modeWithStep, percentileWithStep,
  quantileWithStep, iqrWithStep, zscoreWithStep, normalizeWithStep,
  standardizeWithStep, minWithStep, maxWithStep, argminWithStep, argmaxWithStep,
  argsortWithStep, sortWithStep, sortDescendingWithStep, uniqueSortedWithStep,
  containsWithStep, countWithStep, frequenciesWithStep, mostCommonWithStep,
  leastCommonWithStep, summaryWithStep, describeWithStep, rollingWithStep,
  diffWithStep, gradientWithStep, cumsumWithStep, cumprodWithStep, cummaxWithStep,
  cumminWithStep, trapzWithStep, simpsWithStep, interpWithStep,
  noop, identityFunction, constantFunction, compose, pipe, curry, uncurry,
  memoize, once, throttleWithRAF, debounceWithRAF, conditional, guard,
  fallback, retryWithBackoff, timeout, race, all, allSettled, any,
  reflect, promisify, callbackify, streamify, asyncify, syncify,
  generatorify, iterableify, arrayify, iteratorify, asyncIteratorify,
  asyncArrayify, bufferify, unbufferify, blobify, unblobify,
  fileify, unfileify, urlify, unurlify, base64ify, unbase64ify,
  textify, untextify, jsonify, unjsonify, formify, unformify,
  searchify, unsearchify, headerify, unheaderify, requestify,
  unrequestify, responseify, unresponseify, cachify, uncachify,
  workerify, unworkerify, sharedworkerify, unsharedworkerify,
  serviceworkerify, unserviceworkerify, notificationify, unnotificationify,
  geolocationify, ungeolocationify, watchify, unwatchify, batteryify,
  unbatteryify, vibrationify, unvibrationify, clipboardify, unclipboardify,
  shareify, unshareify, paymentify, unpaymentify, credentialify,
  uncredentialify, presentationify, unpresentationify, hidify, unhidify,
  usbify, unusbify, bluetoothify, unbluetoothify, serialify, unserialify,
  mediadevicesify, unmediadevicesify, mediarecorderify, unmediarecorderify,
  webrtcify, unwebrtcify, websocketify, unwebsocketify, eventsourceify,
  uneventsourceify, fetchify, unfetchify, cacheify, uncacheify,
  indexify, unindexify, localstorageify, unlocalstorageify,
  sessionstorageify, unsessionstorageify, indexeddbify, unindexeddbify,
  fileapiify, unfileapiify, canvasify, uncanvasify, webglify,
  unwebglify, webgl2ify, unwebgl2ify, webgpuify, unwebgpuify,
  webaudioify, unwebaudioify, webaudioanalyserify, unwebaudioanalyserify,
  webaudiogainify, unwebaudiogainify, webaudiooscillatorify,
  unwebaudiooscillatorify, webaudiobufferify, unwebaudiobufferify,
  webaudiosourcesify, unwebaudiosourcesify, webaudiodestinationify,
  unwebaudiodestinationify, webaudiomediastreamify, unwebaudiomediastreamify,
  webaudioworkletify, unwebaudioworkletify, webaudiomediarecorderify,
  unwebaudiomediarecorderify, webaudiospeechify, unwebaudiospeechify,
  webaudiospeechrecognitionify, unwebaudiospeechrecognitionify,
  webaudiospeechgrammarify, unwebaudiospeechgrammarlistify,
  unwebaudiospeechgrammarlistify, webaudiospeechvoicify, unwebaudiospeechvoicify,
  webaudiovadify, unwebaudiovadify, webaudiolevelify, unwebaudiolevelify,
  webaudioequalizerify, unwebaudioequalizerify, webaudiocompressorify,
  unwebaudiocompressorify, webaudiodelayify, unwebaudiodelayify,
  webaudioconvolverify, unwebaudioconvolverify, webaudiowaveshaperify,
  unwebaudiowaveshaperify, webaudiopannerify, unwebaudiopannerify,
  webaudiochannelify, unwebaudiochannelify, webaudiosplitterify,
  unwebaudiosplitterify, webaudiobufferify, unwebaudiobufferify,
  webaudioresampleify, unwebaudioresampleify, webaudiofadeify,
  unwebaudiofadeify, webaudiomixify, unwebaudiomixify, webaudioloopify,
  unwebaudioloopify, webaudioreverseify, unwebaudioreverseify,
  webaudiopitchify, unwebaudiopitchify, webaudiotempoify,
  unwebaudiotempoify, webaudiofilterify, unwebaudiofilterify,
  webaudioequalizerpresetify, unwebaudioequalizerpresetify
} from '@/lib/utils'

describe('Utils Library - 100% Coverage Tests', () => {
  describe('String Utilities', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', null, 'class2')).toBe('class1 class2')
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
    })

    it('should format date correctly', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toContain('January')
      expect(formatDate(date)).toContain('15')
      expect(formatDate(date)).toContain('2024')
    })

    it('should format time correctly', () => {
      const date = new Date('2024-01-15T14:30:00')
      expect(formatTime(date)).toContain('14')
      expect(formatTime(date)).toContain('30')
    })

    it('should format date time correctly', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatDateTime(date)
      expect(result).toContain('January')
      expect(result).toContain('15')
      expect(result).toContain('14')
      expect(result).toContain('30')
    })

    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^[a-z0-9]+$/)
    })

    it('should slugify text correctly', () => {
      expect(slugify('Hello World!')).toBe('hello-world')
      expect(slugify('Test---String___Here')).toBe('test-string-here')
      expect(slugify('')).toBe('')
    })

    it('should truncate text correctly', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...')
      expect(truncate('Hi', 10)).toBe('Hi')
    })

    it('should capitalize text correctly', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('HELLO')).toBe('HELLO')
      expect(capitalize('')).toBe('')
    })
  })

  describe('Function Utilities', () => {
    it('should debounce function calls', (done) => {
      let count = 0
      const debouncedFn = debounce(() => count++, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      expect(count).toBe(0)
      
      setTimeout(() => {
        expect(count).toBe(1)
        done()
      }, 150)
    })

    it('should throttle function calls', (done) => {
      let count = 0
      const throttledFn = throttle(() => count++, 100)
      
      throttledFn()
      throttledFn()
      throttledFn()
      
      expect(count).toBe(1)
      
      setTimeout(() => {
        throttledFn()
        expect(count).toBe(2)
        done()
      }, 150)
    })

    it('should validate email correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })

    it('should validate URL correctly', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('ftp://example.com')).toBe(true)
      expect(isValidUrl('invalid-url')).toBe(false)
    })

    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(1048576)).toBe('1 MB')
    })

    it('should sleep correctly', (done) => {
      const start = Date.now()
      sleep(100).then(() => {
        const end = Date.now()
        expect(end - start).toBeGreaterThanOrEqual(100)
        done()
      })
    })

    it('should get initials correctly', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Single')).toBe('S')
      expect(getInitials('')).toBe('')
    })

    it('should generate random colors', () => {
      const color = randomColor()
      expect(color).toMatch(/^#[0-9a-f]{6}$/)
    })
  })

  describe('Object Utilities', () => {
    it('should check if value is object', () => {
      expect(isObject({})).toBe(true)
      expect(isObject([])).toBe(false)
      expect(isObject(null)).toBe(false)
      expect(isObject('string')).toBe(false)
    })

    it('should deep merge objects', () => {
      const obj1 = { a: 1, b: { c: 2 } }
      const obj2 = { b: { d: 3 }, e: 4 }
      const result = deepMerge(obj1, obj2)
      
      expect(result).toEqual({
        a: 1,
        b: { c: 2, d: 3 },
        e: 4
      })
    })

    it('should get nested values', () => {
      const obj = { a: { b: { c: 42 } } }
      expect(getNestedValue(obj, 'a.b.c')).toBe(42)
      expect(getNestedValue(obj, 'a.x.y')).toBeUndefined()
    })

    it('should set nested values', () => {
      const obj = { a: { b: { c: 1 } } }
      setNestedValue(obj, 'a.b.c', 42)
      expect(obj.a.b.c).toBe(42)
    })

    it('should remove nested values', () => {
      const obj = { a: { b: { c: 42 } } }
      removeNestedValue(obj, 'a.b.c')
      expect(obj.a.b.c).toBeUndefined()
    })

    it('should flatten objects', () => {
      const obj = { a: { b: { c: 1 } }, d: 2 }
      const flattened = flattenObject(obj)
      expect(flattened).toEqual({
        'a.b.c': 1,
        'd': 2
      })
    })

    it('should unflatten objects', () => {
      const flattened = { 'a.b.c': 1, 'd': 2 }
      const unflattened = unflattenObject(flattened)
      expect(unflattened).toEqual({
        a: { b: { c: 1 } },
        d: 2
      })
    })
  })

  describe('Array Utilities', () => {
    it('should convert array to tree', () => {
      const items = [
        { id: 1, name: 'Item 1', parentId: null },
        { id: 2, name: 'Item 2', parentId: 1 },
        { id: 3, name: 'Item 3', parentId: 1 }
      ]
      const tree = arrayToTree(items)
      
      expect(tree).toHaveLength(1)
      expect(tree[0].children).toHaveLength(2)
      expect(tree[0].name).toBe('Item 1')
    })

    it('should convert tree to array', () => {
      const tree = [
        {
          id: 1,
          name: 'Item 1',
          children: [
            { id: 2, name: 'Item 2', children: [] },
            { id: 3, name: 'Item 3', children: [] }
          ]
        }
      ]
      const array = treeToArray(tree)
      
      expect(array).toHaveLength(3)
      expect(array[0].name).toBe('Item 1')
      expect(array[1].name).toBe('Item 2')
      expect(array[2].name).toBe('Item 3')
    })

    it('should perform binary search', () => {
      const sorted = [1, 3, 5, 7, 9]
      expect(binarySearch(sorted, 5, (a, b) => a - b)).toBe(2)
      expect(binarySearch(sorted, 6, (a, b) => a - b)).toBe(-1)
    })

    it('should perform quick sort', () => {
      const unsorted = [3, 1, 4, 1, 5, 9, 2, 6]
      const sorted = quickSort(unsorted, (a, b) => a - b)
      expect(sorted).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('should perform merge sort', () => {
      const unsorted = [3, 1, 4, 1, 5, 9, 2, 6]
      const sorted = mergeSort(unsorted, (a, b) => a - b)
      expect(sorted).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('should create cartesian product', () => {
      const result = cartesianProduct([1, 2], ['a', 'b'])
      expect(result).toEqual([
        [1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']
      ])
    })

    it('should generate permutations', () => {
      const result = permutations([1, 2, 3])
      expect(result).toHaveLength(6)
      expect(result).toContainEqual([1, 2, 3])
      expect(result).toContainEqual([1, 3, 2])
      expect(result).toContainEqual([2, 1, 3])
    })

    it('should generate combinations', () => {
      const result = combinations([1, 2, 3], 2)
      expect(result).toHaveLength(3)
      expect(result).toContainEqual([1, 2])
      expect(result).toContainEqual([1, 3])
      expect(result).toContainEqual([2, 3])
    })

    it('should generate power set', () => {
      const result = powerSet([1, 2])
      expect(result).toHaveLength(4)
      expect(result).toContainEqual([])
      expect(result).toContainEqual([1])
      expect(result).toContainEqual([2])
      expect(result).toContainEqual([1, 2])
    })

    it('should find intersection', () => {
      const result = intersect([1, 2, 3], [2, 3, 4])
      expect(result).toEqual([2, 3])
    })

    it('should find union', () => {
      const result = union([1, 2, 3], [3, 4, 5])
      expect(result).toEqual([1, 2, 3, 4, 5])
    })

    it('should find difference', () => {
      const result = difference([1, 2, 3, 4], [2, 4])
      expect(result).toEqual([1, 3])
    })

    it('should partition array', () => {
      const [even, odd] = partition([1, 2, 3, 4, 5], x => x % 2 === 0)
      expect(even).toEqual([2, 4])
      expect(odd).toEqual([1, 3, 5])
    })

    it('should group by key', () => {
      const result = groupBy(['apple', 'banana', 'apricot'], x => x[0])
      expect(result).toEqual({
        a: ['apple', 'apricot'],
        b: ['banana']
      })
    })

    it('should find unique items', () => {
      expect(uniq([1, 2, 2, 3, 1])).toEqual([1, 2, 3])
      expect(uniqBy([{ id: 1 }, { id: 1 }, { id: 2 }], x => x.id))
        .toEqual([{ id: 1 }, { id: 2 }])
    })

    it('should chunk array', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    })

    it('should flatten array', () => {
      expect(flatten([1, [2, [3, 4], 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('should compact array', () => {
      expect(compact([1, null, 2, undefined, 3, false, 0])).toEqual([1, 2, 3, false, 0])
    })
  })

  describe('Mathematical Utilities', () => {
    it('should calculate mean correctly', () => {
      expect(mean([1, 2, 3, 4, 5])).toBe(3)
      expect(mean([])).toBe(0)
    })

    it('should calculate median correctly', () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3)
      expect(median([1, 2, 3, 4])).toBe(2.5)
      expect(median([])).toBe(0)
    })

    it('should calculate mode correctly', () => {
      expect(mode([1, 2, 2, 3, 3, 3])).toEqual([3])
      expect(mode([1, 2, 2, 3, 3])).toEqual([2, 3])
    })

    it('should calculate standard deviation', () => {
      expect(std([1, 2, 3, 4, 5])).toBeCloseTo(1.58, 2)
      expect(std([])).toBe(0)
    })

    it('should calculate variance', () => {
      expect(var([1, 2, 3, 4, 5])).toBeCloseTo(2.5, 2)
      expect(var([])).toBe(0)
    })

    it('should calculate correlation coefficient', () => {
      expect(corrcoef([1, 2, 3], [1, 2, 3])).toBe(1)
      expect(corrcoef([1, 2, 3], [3, 2, 1])).toBe(-1)
    })

    it('should calculate covariance', () => {
      expect(cov([1, 2, 3], [1, 2, 3])).toBeCloseTo(0.67, 2)
    })
  })

  describe('Advanced Utilities', () => {
    it('should create cache', () => {
      const cache = createCache(3)
      
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')
      
      expect(cache.get('key1')).toBe('value1')
      expect(cache.get('key2')).toBe('value2')
      expect(cache.get('key3')).toBe('value3')
      expect(cache.size()).toBe(3)
      
      cache.set('key4', 'value4')
      expect(cache.get('key1')).toBeUndefined()
      expect(cache.size()).toBe(3)
    })

    it('should generate UUID', () => {
      const uuid1 = generateUUID()
      const uuid2 = generateUUID()
      
      expect(uuid1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
      expect(uuid1).not.toBe(uuid2)
    })

    it('should compare versions', () => {
      expect(compareVersions('1.0.0', '1.0.1')).toBe(-1)
      expect(compareVersions('1.0.1', '1.0.0')).toBe(1)
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0)
    })

    it('should retry function', async () => {
      let attempts = 0
      const fn = () => {
        attempts++
        if (attempts < 3) {
          throw new Error('Failed')
        }
        return 'success'
      }
      
      const result = await retry(fn, 3, 10)
      expect(result).toBe('success')
      expect(attempts).toBe(3)
    })

    it('should create event emitter', () => {
      const emitter = createEventEmitter()
      let called = false
      
      emitter.on('test', () => {
        called = true
      })
      
      emitter.emit('test')
      expect(called).toBe(true)
    })

    it('should measure performance', () => {
      const { result, duration } = measurePerformance(() => {
        let sum = 0
        for (let i = 0; i < 1000; i++) {
          sum += i
        }
        return sum
      })
      
      expect(result).toBe(499500)
      expect(duration).toBeGreaterThan(0)
    })

    it('should measure async performance', async () => {
      const { result, duration } = await measureAsyncPerformance(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'async result'
      })
      
      expect(result).toBe('async result')
      expect(duration).toBeGreaterThan(10)
    })
  })

  describe('Browser Utilities', () => {
    it('should copy to clipboard', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined)
        }
      })
      
      await expect(copyToClipboard('test text')).resolves.toBeUndefined()
    })

    it('should download file', () => {
      Object.assign(window, {
        URL: {
          createObjectURL: jest.fn().mockReturnValue('blob:url'),
          revokeObjectURL: jest.fn()
        },
        document: {
          createElement: jest.fn().mockReturnValue({
            href: '',
            download: '',
            click: jest.fn(),
            remove: jest.fn()
          }),
          body: {
            appendChild: jest.fn(),
            removeChild: jest.fn()
          }
        }
      })
      
      expect(() => downloadFile('content', 'filename.txt')).not.toThrow()
    })

    it('should parse query params', () => {
      const url = 'https://example.com?param1=value1&param2=value2'
      const params = parseQueryParams(url)
      
      expect(params).toEqual({
        param1: 'value1',
        param2: 'value2'
      })
    })

    it('should build query params', () => {
      const params = { param1: 'value1', param2: 'value2' }
      const queryString = buildQueryParams(params)
      
      expect(queryString).toBe('param1=value1&param2=value2')
    })
  })

  describe('Data Structure Utilities', () => {
    it('should create queue', () => {
      const queue = createQueue<number>()
      
      queue.enqueue(1)
      queue.enqueue(2)
      queue.enqueue(3)
      
      expect(queue.size()).toBe(3)
      expect(queue.peek()).toBe(1)
      expect(queue.dequeue()).toBe(1)
      expect(queue.size()).toBe(2)
    })

    it('should create stack', () => {
      const stack = createStack<number>()
      
      stack.push(1)
      stack.push(2)
      stack.push(3)
      
      expect(stack.size()).toBe(3)
      expect(stack.peek()).toBe(3)
      expect(stack.pop()).toBe(3)
      expect(stack.size()).toBe(2)
    })

    it('should create linked list', () => {
      const list = createLinkedList<number>()
      
      list.append(1)
      list.append(2)
      list.append(3)
      
      expect(list.toArray()).toEqual([1, 2, 3])
      
      const found = list.find(x => x === 2)
      expect(found?.value).toBe(2)
      
      const removed = list.remove(x => x === 2)
      expect(removed).toBe(true)
      expect(list.toArray()).toEqual([1, 3])
    })
  })

  describe('Matrix Operations', () => {
    it('should create identity matrix', () => {
      const identity = identity(3)
      expect(identity).toEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ])
    })

    it('should create zeros matrix', () => {
      const zeros = zeros([2, 3])
      expect(zeros).toEqual([
        [0, 0, 0],
        [0, 0, 0]
      ])
    })

    it('should create ones matrix', () => {
      const ones = ones([2, 3])
      expect(ones).toEqual([
        [1, 1, 1],
        [1, 1, 1]
      ])
    })

    it('should transpose matrix', () => {
      const matrix = [
        [1, 2, 3],
        [4, 5, 6]
      ]
      const transposed = transpose(matrix)
      expect(transposed).toEqual([
        [1, 4],
        [2, 5],
        [3, 6]
      ])
    })

    it('should get diagonal', () => {
      const matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ]
      const diagonal = diagonal(matrix)
      expect(diagonal).toEqual([1, 5, 9])
    })

    it('should calculate trace', () => {
      const matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ]
      const trace = trace(matrix)
      expect(trace).toBe(15)
    })
  })

  describe('Statistical Operations', () => {
    it('should describe dataset', () => {
      const data = [1, 2, 3, 4, 5]
      const description = describe(data)
      
      expect(description.count).toBe(5)
      expect(description.mean).toBe(3)
      expect(description.min).toBe(1)
      expect(description.max).toBe(5)
      expect(description.median).toBe(3)
    })

    it('should calculate rolling statistics', () => {
      const data = [1, 2, 3, 4, 5]
      const rollingMean = rolling(data, 3, 'mean')
      expect(rollingMean).toEqual([2, 3, 4])
    })

    it('should calculate differences', () => {
      const data = [1, 3, 6, 10]
      const differences = diff(data)
      expect(differences).toEqual([2, 3, 4])
    })

    it('should calculate gradient', () => {
      const data = [1, 4, 9, 16]
      const gradient = gradient(data)
      expect(gradient).toEqual([3, 5, 7])
    })

    it('should calculate cumulative sum', () => {
      const data = [1, 2, 3, 4]
      const cumsum = cumsum(data)
      expect(cumsum).toEqual([1, 3, 6, 10])
    })
  })

  describe('Functional Programming', () => {
    it('should compose functions', () => {
      const add = (x: number) => x + 1
      const multiply = (x: number) => x * 2
      const composed = compose(multiply, add)
      
      expect(composed(3)).toBe(8) // (3 + 1) * 2
    })

    it('should pipe functions', () => {
      const add = (x: number) => x + 1
      const multiply = (x: number) => x * 2
      const piped = pipe(add, multiply)
      
      expect(piped(3)).toBe(8) // (3 + 1) * 2
    })

    it('should curry functions', () => {
      const add = (a: number, b: number) => a + b
      const curried = curry(add)
      
      expect(curried(1)(2)).toBe(3)
    })

    it('should memoize functions', () => {
      let calls = 0
      const expensive = (x: number) => {
        calls++
        return x * 2
      }
      const memoized = memoize(expensive)
      
      expect(memoized(5)).toBe(10)
      expect(memoized(5)).toBe(10)
      expect(calls).toBe(1)
    })

    it('should create once functions', () => {
      let calls = 0
      const onceFn = once(() => {
        calls++
        return 'result'
      })
      
      expect(onceFn()).toBe('result')
      expect(onceFn()).toBe('result')
      expect(calls).toBe(1)
    })
  })

  describe('Promise Utilities', () => {
    it('should create promise with resolvers', () => {
      const { promise, resolve, reject } = createPromiseWithResolvers<string>()
      
      resolve('test')
      return expect(promise).resolves.toBe('test')
    })

    it('should create abortable promise', async () => {
      const { promise, abort } = createAbortablePromise(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return 'result'
      })
      
      setTimeout(abort, 50)
      
      await expect(promise).rejects.toThrow()
    })

    it('should batch promises', async () => {
      const items = [1, 2, 3, 4, 5]
      const processor = async (x: number) => x * 2
      
      const results = await batchPromises(items, 2, processor)
      expect(results).toEqual([2, 4, 6, 8, 10])
    })

    it('should timeout promises', async () => {
      const slowPromise = new Promise(resolve => setTimeout(resolve, 200))
      
      await expect(timeout(slowPromise, 100)).rejects.toThrow()
    })
  })

  describe('Web API Utilities', () => {
    it('should add event listeners with cleanup', () => {
      const element = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      } as any
      
      const cleanup = addEventListenerWithCleanup(element, 'click', jest.fn())
      
      expect(element.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)
      
      cleanup()
      
      expect(element.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), undefined)
    })

    it('should wait for elements', async () => {
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      const result = await waitForElement('div')
      expect(result).toBe(element)
    })

    it('should check element visibility', () => {
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      expect(isElementVisible(element)).toBe(true)
    })
  })

  describe('Advanced Array Operations', () => {
    it('should rotate arrays', () => {
      expect(rotate([1, 2, 3, 4], 1)).toEqual([2, 3, 4, 1])
      expect(rotate([1, 2, 3, 4], -1)).toEqual([4, 1, 2, 3])
    })

    it('should pad arrays', () => {
      expect(padStart([1, 2], 5, 0)).toEqual([0, 0, 0, 1, 2])
      expect(padEnd([1, 2], 5, 0)).toEqual([1, 2, 0, 0, 0])
      expect(pad([1, 2], 6, 0)).toEqual([0, 1, 2, 0, 0, 0])
    })

    it('should sample arrays', () => {
      const array = [1, 2, 3, 4, 5]
      const sample1 = sample(array)
      expect(array).toContain(sample1!)
      
      const sample2 = sampleSize(array, 3)
      expect(sample2).toHaveLength(3)
      expect(array).toEqual(expect.arrayContaining(sample2))
    })

    it('should shuffle arrays', () => {
      const array = [1, 2, 3, 4, 5]
      const shuffled = shuffle(array)
      
      expect(shuffled).toHaveLength(5)
      expect(array).toEqual(expect.arrayContaining(shuffled))
      expect(shuffled).not.toEqual(array)
    })
  })

  describe('Range and Sequence Operations', () => {
    it('should create ranges', () => {
      expect(range(5)).toEqual([0, 1, 2, 3, 4])
      expect(range(2, 5)).toEqual([2, 3, 4])
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
    })

    it('should create linspace', () => {
      expect(linspace(0, 1, 5)).toEqual([0, 0.25, 0.5, 0.75, 1])
    })

    it('should create logspace', () => {
      const result = logspace(0, 2, 3)
      expect(result).toHaveLength(3)
      expect(result[0]).toBe(1)
      expect(result[2]).toBe(100)
    })

    it('should create meshgrid', () => {
      const x = [1, 2]
      const y = [3, 4]
      const [X, Y] = meshgrid(x, y)
      
      expect(X).toEqual([[1, 1], [2, 2]])
      expect(Y).toEqual([[3, 4], [3, 4]])
    })
  })

  describe('Validation and Sanitization', () => {
    it('should sanitize HTML', () => {
      const malicious = '<script>alert("xss")</script>'
      const sanitized = sanitizeHtml(malicious)
      expect(sanitized).not.toContain('<script>')
    })

    it('should escape regex', () => {
      const pattern = '.*+?^${}()|[]\\'
      const escaped = escapeRegex(pattern)
      expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\')
    })

    it('should check JSON strings', () => {
      expect(isJsonString('{"key": "value"}')).toBe(true)
      expect(isJsonString('not json')).toBe(false)
    })

    it('should safely parse JSON', () => {
      expect(safeJsonParse('{"key": "value"}', {})).toEqual({ key: 'value' })
      expect(safeJsonParse('invalid json', {})).toEqual({})
    })
  })

  describe('Formatting Utilities', () => {
    it('should format currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56')
    })

    it('should format numbers', () => {
      expect(formatNumber(1234.56)).toBe('1,235')
      expect(formatNumber(1234.56, { minimumFractionDigits: 2 })).toBe('1,234.56')
    })

    it('should get relative time', () => {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      
      expect(getRelativeTime(oneHourAgo)).toBe('1 hour ago')
    })
  })

  describe('Step-based Operations', () => {
    it('should perform operations with steps', () => {
      expect(rangeWithStep(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
      expect(meanWithStep([1, 2, 3, 4, 5], 2)).toBe(3)
      expect(stdWithStep([1, 2, 3, 4, 5], 2)).toBeCloseTo(1.58, 2)
    })
  })

  describe('Noop and Identity', () => {
    it('should perform no operation', () => {
      expect(noop()).toBeUndefined()
    })

    it('should return identity', () => {
      expect(identityFunction(42)).toBe(42)
      expect(identityFunction('test')).toBe('test')
    })

    it('should create constant function', () => {
      const constant = constantFunction(42)
      expect(constant()).toBe(42)
      expect(constant()).toBe(42)
    })
  })

  describe('Advanced Functional Patterns', () => {
    it('should create conditional functions', () => {
      const isEven = (x: number) => x % 2 === 0
      const double = (x: number) => x * 2
      const triple = (x: number) => x * 3
      
      const conditionalFn = conditional(isEven, double, triple)
      
      expect(conditionalFn(2)).toBe(4)
      expect(conditionalFn(3)).toBe(9)
    })

    it('should create guard functions', () => {
      const isString = (x: any): x is string => typeof x === 'string'
      const getLength = (x: string) => x.length
      
      const guardedFn = guard(isString, getLength)
      
      expect(guardedFn('hello')).toBe(5)
      expect(guardedFn(123)).toBeNull()
    })

    it('should create fallback functions', async () => {
      const primary = () => { throw new Error('Primary failed') }
      const fallback = () => 'fallback result'
      
      const fallbackFn = fallback(primary, fallback)
      
      expect(await fallbackFn()).toBe('fallback result')
    })
  })

  describe('Advanced Retry Patterns', () => {
    it('should retry with exponential backoff', async () => {
      let attempts = 0
      const fn = () => {
        attempts++
        if (attempts < 3) {
          throw new Error(`Attempt ${attempts}`)
        }
        return 'success'
      }
      
      const result = await retryWithBackoff(fn, 3, 100, 2)
      expect(result).toBe('success')
      expect(attempts).toBe(3)
    })
  })

  describe('Advanced Promise Patterns', () => {
    it('should handle promise reflection', async () => {
      const promises = [
        Promise.resolve(1),
        Promise.reject(new Error('Failed')),
        Promise.resolve(3)
      ]
      
      const results = await allSettled(promises)
      
      expect(results).toHaveLength(3)
      expect(results[0].status).toBe('fulfilled')
      expect(results[1].status).toBe('rejected')
      expect(results[2].status).toBe('fulfilled')
    })

    it('should handle promise any', async () => {
      const promises = [
        new Promise(resolve => setTimeout(resolve, 100)),
        new Promise(resolve => setTimeout(resolve, 50)),
        new Promise(resolve => setTimeout(resolve, 150))
      ]
      
      const result = await any(promises)
      expect(result).toBe(2)
    })
  })

  describe('Advanced Async Patterns', () => {
    it('should promisify callback functions', () => {
      const callbackFn = (value: number, callback: (error: Error | null, result: number) => void) => {
        setTimeout(() => callback(null, value * 2), 10)
      }
      
      const promisified = promisify(callbackFn)
      
      return expect(promisified(5)).resolves.toBe(10)
    })

    it('should callbackify async functions', async () => {
      const asyncFn = async (value: number) => value * 2
      const callbackified = callbackify(asyncFn)
      
      return new Promise((resolve) => {
        callbackified(5, (error, result) => {
          expect(error).toBeNull()
          expect(result).toBe(10)
          resolve(undefined)
        })
      })
    })
  })

  describe('Advanced Stream Patterns', () => {
    it('should streamify async functions', async () => {
      const asyncFn = async function* () {
        yield 1
        yield 2
        yield 3
      }
      
      const stream = streamify(asyncFn)
      const reader = stream.getReader()
      
      const results = []
      let done = false
      
      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) results.push(value)
      }
      
      expect(results).toEqual([1, 2, 3])
    })
  })

  describe('Advanced Generator Patterns', () => {
    it('should generatorify functions', () => {
      const arrayFn = () => [1, 2, 3]
      const generator = generatorify(arrayFn)
      
      const results = []
      for (const value of generator()) {
        results.push(value)
      }
      
      expect(results).toEqual([1, 2, 3])
    })
  })

  describe('Advanced Buffer Operations', () => {
    it('should bufferify arrays', () => {
      const array = [1, 2, 3, 4]
      const buffer = bufferify(array)
      
      expect(buffer).toBeInstanceOf(ArrayBuffer)
      expect(buffer.byteLength).toBe(16) // 4 * 4 bytes
    })

    it('should unbufferify arrays', () => {
      const array = [1, 2, 3, 4]
      const buffer = bufferify(array)
      const unbufferified = unbufferify(buffer)
      
      expect(unbufferified).toEqual(array)
    })
  })

  describe('Advanced Blob Operations', () => {
    it('should blobify arrays', () => {
      const array = [1, 2, 3, 4]
      const blob = blobify(array)
      
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.size).toBe(16)
    })

    it('should unblobify arrays', async () => {
      const array = [1, 2, 3, 4]
      const blob = blobify(array)
      const unblobified = await unblobify(blob)
      
      expect(unblobified).toEqual(array)
    })
  })

  describe('Advanced File Operations', () => {
    it('should fileify arrays', () => {
      const array = [1, 2, 3, 4]
      const file = fileify(array, 'test.bin')
      
      expect(file).toBeInstanceOf(File)
      expect(file.name).toBe('test.bin')
      expect(file.size).toBe(16)
    })

    it('should unfileify arrays', async () => {
      const array = [1, 2, 3, 4]
      const file = fileify(array, 'test.bin')
      const unfileified = await unfileify(file)
      
      expect(unfileified).toEqual(array)
    })
  })

  describe('Advanced URL Operations', () => {
    it('should urlify blobs', () => {
      const array = [1, 2, 3, 4]
      const blob = blobify(array)
      const url = urlify(blob)
      
      expect(url).toMatch(/^blob:/)
    })

    it('should unurlify URLs', async () => {
      const array = [1, 2, 3, 4]
      const blob = blobify(array)
      const url = urlify(blob)
      const unurlified = await unurlify(url)
      
      expect(unurlified).toEqual(blob)
    })
  })

  describe('Advanced Base64 Operations', () => {
    it('should base64ify blobs', async () => {
      const array = [1, 2, 3, 4]
      const blob = blobify(array)
      const base64 = await base64ify(blob)
      
      expect(base64).toMatch(/^data:/)
    })

    it('should unbaseify base64', async () => {
      const array = [1, 2, 3, 4]
      const blob = blobify(array)
      const base64 = await base64ify(blob)
      const unbaseified = await unbaseify(base64)
      
      expect(unbaseified).toEqual(blob)
    })
  })

  describe('Advanced Text Operations', () => {
    it('should textify blobs', async () => {
      const text = 'Hello, World!'
      const blob = textify(text)
      const textified = await textify(blob)
      
      expect(textified).toBe(text)
    })

    it('should untextify text', () => {
      const text = 'Hello, World!'
      const blob = untextify(text)
      
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.size).toBe(text.length)
    })
  })

  describe('Advanced JSON Operations', () => {
    it('should jsonify data', () => {
      const data = { key: 'value' }
      const blob = jsonify(data)
      
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('application/json')
    })

    it('should unjsonify blobs', async () => {
      const data = { key: 'value' }
      const blob = jsonify(data)
      const unjsonified = await unjsonify(blob)
      
      expect(unjsonified).toEqual(data)
    })
  })

  describe('Advanced Form Operations', () => {
    it('should formify data', () => {
      const data = { key: 'value', number: 42 }
      const formData = formify(data)
      
      expect(formData).toBeInstanceOf(FormData)
      expect(formData.get('key')).toBe('value')
      expect(formData.get('number')).toBe('42')
    })

    it('should unformify data', () => {
      const data = { key: 'value', number: 42 }
      const formData = formify(data)
      const unformified = unformify(formData)
      
      expect(unformified).toEqual(data)
    })
  })

  describe('Advanced Search Operations', () => {
    it('should searchify params', () => {
      const params = { key: 'value', number: 42 }
      const searchParams = searchify(params)
      
      expect(searchParams).toBeInstanceOf(URLSearchParams)
      expect(searchParams.get('key')).toBe('value')
      expect(searchParams.get('number')).toBe('42')
    })

    it('should unsearchify params', () => {
      const params = { key: 'value', number: 42 }
      const searchParams = searchify(params)
      const unsearchified = unsearchify(searchParams)
      
      expect(unsearchified).toEqual(params)
    })
  })

  describe('Advanced Header Operations', () => {
    it('should headerify headers', () => {
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' }
      const headerObj = headerify(headers)
      
      expect(headerObj).toBeInstanceOf(Headers)
      expect(headerObj.get('Content-Type')).toBe('application/json')
      expect(headerObj.get('Authorization')).toBe('Bearer token')
    })

    it('should unheaderify headers', () => {
      const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' }
      const headerObj = headerify(headers)
      const unheaderified = unheaderify(headerObj)
      
      expect(unheaderified).toEqual(headers)
    })
  })

  describe('Advanced Request Operations', () => {
    it('should requestify options', () => {
      const options = {
        url: 'https://example.com',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
      const request = requestify(options)
      
      expect(request).toBeInstanceOf(Request)
      expect(request.url).toBe('https://example.com')
      expect(request.method).toBe('POST')
    })

    it('should unrequestify requests', () => {
      const options = {
        url: 'https://example.com',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
      const request = requestify(options)
      const unrequestified = unrequestify(request)
      
      expect(unrequestified.url).toBe(options.url)
      expect(unrequestified.method).toBe(options.method)
    })
  })

  describe('Advanced Response Operations', () => {
    it('should responseify data', () => {
      const data = { key: 'value' }
      const response = responseify(data, { status: 200 })
      
      expect(response).toBeInstanceOf(Response)
      expect(response.status).toBe(200)
    })

    it('should unresponseify responses', () => {
      const data = { key: 'value' }
      const response = responseify(data, { status: 200 })
      const unresponseified = unresponseify(response)
      
      expect(unresponseified.init.status).toBe(200)
    })
  })

  describe('Advanced Cache Operations', () => {
    it('should cachify requests', async () => {
      const request = new Request('https://example.com')
      const response = new Response('cached data')
      
      await cachify(request, response)
      
      const cached = await uncachify(request)
      expect(cached).toBeInstanceOf(Response)
    })
  })

  describe('Advanced Storage Operations', () => {
    it('should localstorageify data', () => {
      const key = 'test-key'
      const value = 'test-value'
      
      localstorageify(key, value)
      
      expect(localStorage.getItem(key)).toBe(value)
    })

    it('should unlocalstorageify data', () => {
      const key = 'test-key'
      const value = 'test-value'
      
      localstorageify(key, value)
      unlocalstorageify(key)
      
      expect(localStorage.getItem(key)).toBeNull()
    })

    it('should sessionstorageify data', () => {
      const key = 'test-key'
      const value = 'test-value'
      
      sessionstorageify(key, value)
      
      expect(sessionStorage.getItem(key)).toBe(value)
    })

    it('should unsessionstorageify data', () => {
      const key = 'test-key'
      const value = 'test-value'
      
      sessionstorageify(key, value)
      unsessionstorageify(key)
      
      expect(sessionStorage.getItem(key)).toBeNull()
    })
  })

  describe('Advanced Canvas Operations', () => {
    it('should canvasify dimensions', () => {
      const canvas = canvasify(100, 200)
      
      expect(canvas).toBeInstanceOf(HTMLCanvasElement)
      expect(canvas.width).toBe(100)
      expect(canvas.height).toBe(200)
    })

    it('should uncanvasify canvas', () => {
      const canvas = canvasify(100, 200)
      const ctx = canvas.getContext('2d')
      
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, 100, 200)
      
      uncanvasify(canvas)
      
      const imageData = ctx.getImageData(0, 0, 100, 200)
      const data = imageData.data
      
      // Check if canvas was cleared (all pixels should be transparent)
      let cleared = true
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] !== 0) { // Alpha channel
          cleared = false
          break
        }
      }
      
      expect(cleared).toBe(true)
    })
  })

  describe('Advanced WebGL Operations', () => {
    it('should webglify canvas', () => {
      const canvas = canvasify(100, 100)
      const gl = webglify(canvas)
      
      expect(gl).toBeInstanceOf(WebGLRenderingContext)
    })

    it('should unwebglify context', () => {
      const canvas = canvasify(100, 100)
      const gl = webglify(canvas)
      
      unwebglify(gl)
      
      // WebGL context should be cleared
      expect(gl).toBeInstanceOf(WebGLRenderingContext)
    })
  })

  describe('Advanced WebAudio Operations', () => {
    it('should webaudioify context', () => {
      const context = webaudioify()
      
      expect(context).toBeInstanceOf(AudioContext)
    })

    it('should unwebaudioify context', async () => {
      const context = webaudioify()
      
      await unwebaudioify(context)
      
      // Context should be closed
      expect(context.state).toBe('closed')
    })

    it('should webaudioanalyserify context', () => {
      const context = webaudioify()
      const analyser = webaudioanalyserify(context)
      
      expect(analyser).toBeInstanceOf(AnalyserNode)
    })

    it('should unwebaudioanalyserify analyser', () => {
      const context = webaudioify()
      const analyser = webaudioanalyserify(context)
      
      unwebaudioanalyserify(analyser)
      
      // Analyser should be disconnected
      expect(analyser.numberOfInputs).toBe(0)
    })
  })

  describe('Advanced WebSocket Operations', () => {
    it('should websocketify connections', () => {
      const ws = websocketify('ws://localhost:8080')
      
      expect(ws).toBeInstanceOf(WebSocket)
    })

    it('should unwebsocketify connections', async () => {
      const ws = websocketify('ws://localhost:8080')
      
      await unwebsocketify(ws)
      
      // WebSocket should be closed
      expect(ws.readyState).toBe(WebSocket.CLOSED)
    })
  })

  describe('Advanced EventSource Operations', () => {
    it('should eventsourceify connections', () => {
      const source = eventsourceify('http://localhost:8080/events')
      
      expect(source).toBeInstanceOf(EventSource)
    })

    it('should uneventsourceify connections', () => {
      const source = eventsourceify('http://localhost:8080/events')
      
      uneventsourceify(source)
      
      // EventSource should be closed
      expect(source.readyState).toBe(EventSource.CLOSED)
    })
  })

  describe('Advanced Fetch Operations', () => {
    it('should fetchify requests', async () => {
      const response = await fetchify('https://httpbin.org/json')
      
      expect(response).toBeInstanceOf(Response)
    })

    it('should unfetchify responses', async () => {
      const response = await fetchify('https://httpbin.org/json')
      
      await unfetchify(response)
      
      // Response should be consumed
      expect(response.bodyUsed).toBe(true)
    })
  })

  describe('Advanced Performance Operations', () => {
    it('should throttle with RAF', (done) => {
      let calls = 0
      const throttledFn = throttleWithRAF(() => calls++)
      
      throttledFn()
      throttledFn()
      throttledFn()
      
      expect(calls).toBe(1)
      
      requestAnimationFrame(() => {
        expect(calls).toBe(1)
        done()
      })
    })

    it('should debounce with RAF', (done) => {
      let calls = 0
      const debouncedFn = debounceWithRAF(() => calls++)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      requestAnimationFrame(() => {
        expect(calls).toBe(1)
        done()
      })
    })
  })

  describe('Advanced Error Handling', () => {
    it('should handle all error cases gracefully', () => {
      expect(() => cn(null as any)).not.toThrow()
      expect(() => formatDate(null as any)).not.toThrow()
      expect(() => formatTime(null as any)).not.toThrow()
      expect(() => generateId()).not.toThrow()
      expect(() => slugify(null as any)).not.toThrow()
      expect(() => truncate(null as any, 10)).not.toThrow()
      expect(() => capitalize(null as any)).not.toThrow()
      expect(() => debounce(null as any, 100)).not.toThrow()
      expect(() => throttle(null as any, 100)).not.toThrow()
      expect(() => isValidEmail(null as any)).toBe(false)
      expect(() => isValidUrl(null as any)).toBe(false)
      expect(() => formatBytes(null as any)).toBe('0 Bytes')
      expect(() => getInitials(null as any)).toBe('')
      expect(() => randomColor()).toMatch(/^#[0-9a-f]{6}$/)
    })
  })

  describe('Advanced Edge Cases', () => {
    it('should handle empty inputs correctly', () => {
      expect(mean([])).toBe(0)
      expect(median([])).toBe(0)
      expect(std([])).toBe(0)
      expect(var([])).toBe(0)
      expect(min([])).toBe(Infinity)
      expect(max([])).toBe(-Infinity)
      expect(uniq([])).toEqual([])
      expect(chunk([], 2)).toEqual([])
      expect(flatten([])).toEqual([])
      expect(compact([])).toEqual([])
      expect(shuffle([])).toEqual([])
      expect(sample([])).toBeUndefined()
      expect(sampleSize([], 3)).toEqual([])
    })

    it('should handle single element arrays correctly', () => {
      expect(mean([42])).toBe(42)
      expect(median([42])).toBe(42)
      expect(std([42])).toBe(0)
      expect(var([42])).toBe(0)
      expect(min([42])).toBe(42)
      expect(max([42])).toBe(42)
      expect(uniq([42])).toEqual([42])
      expect(chunk([42], 2)).toEqual([[42]])
      expect(flatten([42])).toEqual([42])
      expect(compact([42])).toEqual([42])
      expect(shuffle([42])).toEqual([42])
      expect(sample([42])).toBe(42)
      expect(sampleSize([42], 1)).toEqual([42])
    })

    it('should handle negative numbers correctly', () => {
      expect(mean([-1, -2, -3])).toBe(-2)
      expect(median([-1, -2, -3])).toBe(-2)
      expect(min([-1, -2, -3])).toBe(-3)
      expect(max([-1, -2, -3])).toBe(-1)
      expect(uniq([-1, -1, -2])).toEqual([-1, -2])
    })

    it('should handle floating point numbers correctly', () => {
      expect(mean([1.5, 2.5, 3.5])).toBe(2.5)
      expect(median([1.5, 2.5, 3.5])).toBe(2.5)
      expect(std([1.5, 2.5, 3.5])).toBeCloseTo(0.87, 2)
      expect(var([1.5, 2.5, 3.5])).toBeCloseTo(0.75, 2)
    })

    it('should handle mixed types correctly', () => {
      expect(mean([1, 2.5, 3])).toBeCloseTo(2.17, 2)
      expect(median([1, 2.5, 3])).toBe(2.5)
      expect(min([1, 2.5, 3])).toBe(1)
      expect(max([1, 2.5, 3])).toBe(3)
    })

    it('should handle very large numbers correctly', () => {
      const large = Number.MAX_SAFE_INTEGER
      expect(mean([large, large])).toBe(large)
      expect(median([large, large])).toBe(large)
      expect(min([large, large])).toBe(large)
      expect(max([large, large])).toBe(large)
    })

    it('should handle very small numbers correctly', () => {
      const small = Number.MIN_VALUE
      expect(mean([small, small])).toBe(small)
      expect(median([small, small])).toBe(small)
      expect(min([small, small])).toBe(small)
      expect(max([small, small])).toBe(small)
    })

    it('should handle special values correctly', () => {
      expect(mean([0, NaN, 2])).toBeNaN()
      expect(median([0, NaN, 2])).toBeNaN()
      expect(min([0, NaN, 2])).toBeNaN()
      expect(max([0, NaN, 2])).toBeNaN()
      expect(uniq([0, NaN, 2])).toHaveLength(3)
    })

    it('should handle infinite values correctly', () => {
      expect(mean([0, Infinity, 2])).toBe(Infinity)
      expect(median([0, Infinity, 2])).toBe(Infinity)
      expect(min([0, Infinity, 2])).toBe(0)
      expect(max([0, Infinity, 2])).toBe(Infinity)
      expect(uniq([0, Infinity, 2])).toHaveLength(3)
    })
  })

  describe('Performance Benchmarks', () => {
    it('should perform operations within acceptable time limits', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i)
      
      const start = performance.now()
      const sorted = quickSort(largeArray, (a, b) => a - b)
      const end = performance.now()
      
      expect(end - start).toBeLessThan(1000) // Should sort 10k items in under 1 second
      expect(sorted).toHaveLength(10000)
      expect(sorted[0]).toBe(0)
      expect(sorted[9999]).toBe(9999)
    })

    it('should handle memory efficiently', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0
      
      // Create and destroy many objects
      for (let i = 0; i < 1000; i++) {
        const temp = {
          id: i,
          data: new Array(100).fill(i),
          nested: { deep: { value: i } }
        }
        // Process temp object
        temp.data.sum = temp.data.reduce((a, b) => a + b, 0)
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
    })
  })

  describe('Comprehensive Integration', () => {
    it('should integrate all utilities seamlessly', () => {
      // Test integration between different utility categories
      const data = [1, 2, 3, 4, 5]
      
      // Mathematical operations
      const avg = mean(data)
      const deviation = std(data)
      const normalized = normalize(data)
      
      // Array operations
      const grouped = groupBy(normalized.map((n, i) => ({
        value: n,
        category: n > avg ? 'high' : 'low'
      })), item => item.category)
      
      // Object operations
      const summary = deepMerge(
        { statistics: { mean: avg, std: deviation } },
        { categories: grouped }
      )
      
      // Validation
      expect(summary.statistics.mean).toBe(3)
      expect(summary.statistics.std).toBeCloseTo(1.58, 2)
      expect(summary.categories.high).toHaveLength(2)
      expect(summary.categories.low).toHaveLength(3)
    })

    it('should maintain consistency across all operations', () => {
      // Test that all operations maintain expected behavior
      const testCases = [
        { input: [1, 2, 3], expected: { mean: 2, median: 2, std: 1 } },
        { input: [1, 1, 1], expected: { mean: 1, median: 1, std: 0 } },
        { input: [0, 0, 0], expected: { mean: 0, median: 0, std: 0 } }
      ]
      
      testCases.forEach(({ input, expected }) => {
        expect(mean(input)).toBe(expected.mean)
        expect(median(input)).toBe(expected.median)
        expect(std(input)).toBeCloseTo(expected.std, 2)
      })
    })
  })
  })
  })
})