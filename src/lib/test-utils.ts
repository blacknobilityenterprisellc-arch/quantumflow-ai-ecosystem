import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

// Mock functions for testing
const mockConsole = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockError = vi.spyOn(console, 'error').mockImplementation(() => {})
const mockWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

// Test utilities
export const createMockComponent = (props: any = {}) => {
  const MockComponent = ({ children, ...rest }: any) => (
    <div data-testid="mock-component" {...rest}>
      {children}
    </div>
  )
  return MockComponent
}

export const createMockHook = <T,>(initialValue: T) => {
  let value = initialValue
  const setValue = vi.fn((newValue: T) => {
    value = newValue
    return value
  })
  
  return [() => value, setValue] as [() => T, Mock]
}

export const createMockEvent = (type: string, properties: any = {}) => {
  const event = new Event(type, { bubbles: true, cancelable: true, ...properties })
  Object.assign(event, properties)
  return event
}

export const createMockElement = (tagName: string, attributes: any = {}) => {
  const element = document.createElement(tagName)
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value))
  })
  return element
}

export const createMockResponse = (data: any, status: number = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers(),
  })
}

export const createMockFetch = (responses: any[]) => {
  let callCount = 0
  return vi.fn(() => {
    const response = responses[callCount % responses.length]
    callCount++
    return createMockResponse(response)
  })
}

export const createMockWebSocket = () => {
  const ws = {
    send: vi.fn(),
    close: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    readyState: 1,
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
  }
  return ws
}

export const createMockLocalStorage = () => {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(key => delete store[key]) }),
    length: 0,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  }
}

export const createMockSessionStorage = () => {
  return createMockLocalStorage()
}

export const createMockIntersectionObserver = () => {
  const observers = new Set<any>()
  return {
    observe: vi.fn((element) => {
      observers.add(element)
    }),
    unobserve: vi.fn((element) => {
      observers.delete(element)
    }),
    disconnect: vi.fn(() => {
      observers.clear()
    }),
    observers,
  }
}

export const createMockResizeObserver = () => {
  const observers = new Set<any>()
  return {
    observe: vi.fn((element) => {
      observers.add(element)
    }),
    unobserve: vi.fn((element) => {
      observers.delete(element)
    }),
    disconnect: vi.fn(() => {
      observers.clear()
    }),
    observers,
  }
}

export const createMockMutationObserver = () => {
  const observers = new Set<any>()
  return {
    observe: vi.fn((element, options) => {
      observers.add({ element, options })
    }),
    disconnect: vi.fn(() => {
      observers.clear()
    }),
    takeRecords: vi.fn(() => []),
    observers,
  }
}

export const createMockMediaQuery = (matches: boolean = false) => {
  return {
    matches,
    media: '(max-width: 768px)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
}

export const createMockGeolocation = () => {
  return {
    getCurrentPosition: vi.fn((success, error) => {
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10,
        },
        timestamp: Date.now(),
      })
    }),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  }
}

export const createMockNotification = () => {
  return {
    requestPermission: vi.fn(() => Promise.resolve('granted')),
    permission: 'granted',
  }
}

export const createMockClipboard = () => {
  return {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve('')),
  }
}

export const createMockFileReader = () => {
  const reader = {
    readAsDataURL: vi.fn(),
    readAsText: vi.fn(),
    readAsArrayBuffer: vi.fn(),
    result: '',
    error: null,
    onload: null,
    onerror: null,
    onloadend: null,
    onloadstart: null,
    onprogress: null,
    onabort: null,
  }
  return reader
}

export const createMockCanvas = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    ctx.drawImage = vi.fn()
    ctx.getImageData = vi.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    }))
    ctx.putImageData = vi.fn()
    ctx.createImageData = vi.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    }))
    ctx.fillRect = vi.fn()
    ctx.strokeRect = vi.fn()
    ctx.clearRect = vi.fn()
    ctx.beginPath = vi.fn()
    ctx.closePath = vi.fn()
    ctx.moveTo = vi.fn()
    ctx.lineTo = vi.fn()
    ctx.arc = vi.fn()
    ctx.quadraticCurveTo = vi.fn()
    ctx.bezierCurveTo = vi.fn()
    ctx.transform = vi.fn()
    ctx.setTransform = vi.fn()
    ctx.resetTransform = vi.fn()
    ctx.save = vi.fn()
    ctx.restore = vi.fn()
    ctx.scale = vi.fn()
    ctx.rotate = vi.fn()
    ctx.translate = vi.fn()
    ctx.fillStyle = ''
    ctx.strokeStyle = ''
    ctx.lineWidth = 1
    ctx.lineCap = 'butt'
    ctx.lineJoin = 'miter'
    ctx.miterLimit = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowBlur = 0
    ctx.shadowColor = 'rgba(0, 0, 0, 0)'
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'start'
    ctx.textBaseline = 'alphabetic'
    ctx.direction = 'inherit'
  }
  
  return canvas
}

export const createMockAudioContext = () => {
  return {
    createOscillator: vi.fn(() => ({
      type: 'sine',
      frequency: { value: 440, setValueAtTime: vi.fn() },
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
    createGain: vi.fn(() => ({
      gain: { value: 1, setValueAtTime: vi.fn() },
      connect: vi.fn(),
      disconnect: vi.fn(),
    })),
    createAnalyser: vi.fn(() => ({
      frequencyBinCount: 2048,
      getByteFrequencyData: vi.fn(),
      getByteTimeDomainData: vi.fn(),
      getFloatFrequencyData: vi.fn(),
      getFloatTimeDomainData: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
    })),
    createBufferSource: vi.fn(() => ({
      buffer: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
    createBuffer: vi.fn(() => ({
      length: 1,
      duration: 1,
      sampleRate: 44100,
      getChannelData: vi.fn(() => new Float32Array(1)),
    })),
    decodeAudioData: vi.fn(() => Promise.resolve({
      length: 1,
      duration: 1,
      sampleRate: 44100,
      getChannelData: vi.fn(() => new Float32Array(1)),
    })),
    destination: {},
    sampleRate: 44100,
    state: 'running',
    close: vi.fn(() => Promise.resolve()),
    resume: vi.fn(() => Promise.resolve()),
    suspend: vi.fn(() => Promise.resolve()),
  }
}

export const createMockRTCPeerConnection = () => {
  return {
    createOffer: vi.fn(() => Promise.resolve({ type: 'offer', sdp: '' })),
    createAnswer: vi.fn(() => Promise.resolve({ type: 'answer', sdp: '' })),
    setLocalDescription: vi.fn(() => Promise.resolve()),
    setRemoteDescription: vi.fn(() => Promise.resolve()),
    addIceCandidate: vi.fn(() => Promise.resolve()),
    getStats: vi.fn(() => Promise.resolve(new Map())),
    close: vi.fn(),
    localDescription: null,
    remoteDescription: null,
    signalingState: 'stable',
    iceGatheringState: 'new',
    iceConnectionState: 'new',
    connectionState: 'new',
    onicecandidate: null,
    ontrack: null,
    onsignalingstatechange: null,
    onicegatheringstatechange: null,
    oniceconnectionstatechange: null,
    onconnectionstatechange: null,
  }
}

export const createMockMediaStream = () => {
  return {
    getTracks: vi.fn(() => [
      { kind: 'audio', id: 'audio-track', enabled: true, stop: vi.fn() },
      { kind: 'video', id: 'video-track', enabled: true, stop: vi.fn() },
    ]),
    getAudioTracks: vi.fn(() => [
      { kind: 'audio', id: 'audio-track', enabled: true, stop: vi.fn() },
    ]),
    getVideoTracks: vi.fn(() => [
      { kind: 'video', id: 'video-track', enabled: true, stop: vi.fn() },
    ]),
    addTrack: vi.fn(),
    removeTrack: vi.fn(),
    getSettings: vi.fn(() => ({})),
    applyConstraints: vi.fn(() => Promise.resolve()),
    clone: vi.fn(() => createMockMediaStream()),
    active: true,
    id: 'mock-stream',
    onaddtrack: null,
    onremovetrack: null,
  }
}

export const createMockMediaRecorder = () => {
  return {
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    requestData: vi.fn(),
    state: 'inactive',
    mimeType: 'video/webm',
    stream: createMockMediaStream(),
    ondataavailable: null,
    onerror: null,
    onpause: null,
    onresume: null,
    onstart: null,
    onstop: null,
  }
}

export const createMockServiceWorker = () => {
  return {
    register: vi.fn(() => Promise.resolve({
      installing: null,
      waiting: null,
      active: null,
      scope: '',
      update: vi.fn(() => Promise.resolve()),
      unregister: vi.fn(() => Promise.resolve(true)),
      getNotifications: vi.fn(() => Promise.resolve([])),
      showNotification: vi.fn(() => Promise.resolve()),
    })),
    ready: vi.fn(() => Promise.resolve({
      installing: null,
      waiting: null,
      active: null,
      scope: '',
      update: vi.fn(() => Promise.resolve()),
      unregister: vi.fn(() => Promise.resolve(true)),
      getNotifications: vi.fn(() => Promise.resolve([])),
      showNotification: vi.fn(() => Promise.resolve()),
    })),
    controller: null,
  }
}

export const createMockCache = () => {
  const cache = new Map<string, Response>()
  return {
    match: vi.fn((request) => {
      const key = typeof request === 'string' ? request : request.url
      return Promise.resolve(cache.get(key) || undefined)
    }),
    put: vi.fn((request, response) => {
      const key = typeof request === 'string' ? request : request.url
      cache.set(key, response)
      return Promise.resolve()
    }),
    delete: vi.fn((request) => {
      const key = typeof request === 'string' ? request : request.url
      return Promise.resolve(cache.delete(key))
    }),
    keys: vi.fn(() => Promise.resolve(Array.from(cache.keys()))),
    add: vi.fn((request, response) => {
      const key = typeof request === 'string' ? request : request.url
      cache.set(key, response)
      return Promise.resolve()
    }),
    addAll: vi.fn(() => Promise.resolve()),
    matchAll: vi.fn(() => Promise.resolve(Array.from(cache.values()))),
  }
}

export const createMockIndexedDB = () => {
  return {
    open: vi.fn(() => Promise.resolve({
      version: 1,
      name: 'mock-db',
      objectStoreNames: {
        length: 0,
        contains: vi.fn(() => false),
        item: vi.fn(() => null),
        namedItem: vi.fn(() => null),
        [Symbol.iterator]: function* () {},
      },
      createObjectStore: vi.fn(),
      deleteObjectStore: vi.fn(),
      transaction: vi.fn(() => ({
        objectStore: vi.fn(() => ({
          add: vi.fn(() => Promise.resolve()),
          get: vi.fn(() => Promise.resolve()),
          put: vi.fn(() => Promise.resolve()),
          delete: vi.fn(() => Promise.resolve()),
          clear: vi.fn(() => Promise.resolve()),
          count: vi.fn(() => Promise.resolve(0)),
          getAll: vi.fn(() => Promise.resolve([])),
          getAllKeys: vi.fn(() => Promise.resolve([])),
          openCursor: vi.fn(() => Promise.resolve()),
          index: vi.fn(() => ({})),
          createIndex: vi.fn(),
          deleteIndex: vi.fn(),
          indexNames: {
            length: 0,
            contains: vi.fn(() => false),
            item: vi.fn(() => null),
            namedItem: vi.fn(() => null),
            [Symbol.iterator]: function* () {},
          },
        })),
        abort: vi.fn(),
        commit: vi.fn(),
        objectStoreNames: {
          length: 0,
          contains: vi.fn(() => false),
          item: vi.fn(() => null),
          namedItem: vi.fn(() => null),
          [Symbol.iterator]: function* () {},
        },
        onabort: null,
        oncomplete: null,
        onerror: null,
      })),
      close: vi.fn(),
      onblocked: null,
      onclose: null,
      onerror: null,
      onupgradeneeded: null,
      onversionchange: null,
    })),
    deleteDatabase: vi.fn(() => Promise.resolve()),
    cmp: vi.fn(),
    databases: vi.fn(() => Promise.resolve([])),
  }
}

export const createMockWorker = () => {
  return {
    postMessage: vi.fn(),
    terminate: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onmessage: null,
    onerror: null,
    onmessageerror: null,
  }
}

export const createMockSharedWorker = () => {
  return {
    port: {
      postMessage: vi.fn(),
      start: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onmessage: null,
      onmessageerror: null,
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onconnect: null,
    onerror: null,
  }
}

export const createMockBlob = (content: string = '', type: string = 'text/plain') => {
  return new Blob([content], { type })
}

export const createMockFile = (content: string = '', name: string = 'test.txt', type: string = 'text/plain') => {
  return new File([content], name, { type })
}

export const createMockURL = () => {
  const urls = new Set<string>()
  return {
    createObjectURL: vi.fn((object) => {
      const url = `blob:${Math.random().toString(36).substring(2)}`
      urls.add(url)
      return url
    }),
    revokeObjectURL: vi.fn((url) => {
      urls.delete(url)
    }),
    urls,
  }
}

export const createMockPerformance = () => {
  return {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
    getEntries: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    clearResourceTimings: vi.fn(),
    getEntriesByResourceTimingType: vi.fn(() => []),
    setResourceTimingBufferSize: vi.fn(),
    toJSON: vi.fn(() => ({})),
  }
}

export const createMockAnimation = () => {
  return {
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
    finish: vi.fn(),
    reverse: vi.fn(),
    commitStyles: vi.fn(),
    persist: vi.fn(),
    updatePlaybackRate: vi.fn(),
    currentTime: 0,
    playbackRate: 1,
    startTime: 0,
    endTime: 0,
    duration: 0,
    playState: 'idle',
    pending: false,
    id: '',
    onfinish: null,
    oncancel: null,
    onremove: null,
    onchange: null,
  }
}

export const createMockRequestAnimationFrame = () => {
  const callbacks = new Set<number>()
  let id = 0
  
  return {
    requestAnimationFrame: vi.fn((callback) => {
      const callbackId = id++
      callbacks.add(callbackId)
      setTimeout(() => {
        if (callbacks.has(callbackId)) {
          callback(Date.now())
          callbacks.delete(callbackId)
        }
      }, 16)
      return callbackId
    }),
    cancelAnimationFrame: vi.fn((callbackId) => {
      callbacks.delete(callbackId)
    }),
    callbacks,
  }
}

export const createMockIdleCallback = () => {
  const callbacks = new Set<number>()
  let id = 0
  
  return {
    requestIdleCallback: vi.fn((callback) => {
      const callbackId = id++
      callbacks.add(callbackId)
      setTimeout(() => {
        if (callbacks.has(callbackId)) {
          callback({ didTimeout: false, timeRemaining: () => 50 })
          callbacks.delete(callbackId)
        }
      }, 0)
      return callbackId
    }),
    cancelIdleCallback: vi.fn((callbackId) => {
      callbacks.delete(callbackId)
    }),
    callbacks,
  }
}

export const createMockHistory = () => {
  const history = []
  return {
    pushState: vi.fn((state, title, url) => {
      history.push({ state, title, url })
    }),
    replaceState: vi.fn((state, title, url) => {
      history[history.length - 1] = { state, title, url }
    }),
    go: vi.fn((delta) => {
      // Mock navigation
    }),
    back: vi.fn(() => {
      // Mock navigation back
    }),
    forward: vi.fn(() => {
      // Mock navigation forward
    }),
    length: history.length,
    state: null,
    scrollRestoration: 'auto',
  }
}

export const createMockLocation = () => {
  return {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  }
}

export const createMockNavigator = () => {
  return {
    userAgent: 'Mozilla/5.0 (Test Environment)',
    language: 'en-US',
    languages: ['en-US', 'en'],
    platform: 'Test',
    cookieEnabled: true,
    onLine: true,
    hardwareConcurrency: 4,
    maxTouchPoints: 0,
    vendor: 'Test Vendor',
    vendorSub: '',
    product: 'Test Product',
    productSub: '',
    appCodeName: 'Mozilla',
    appName: 'Test Browser',
    appVersion: '1.0',
    geolocation: createMockGeolocation(),
    mediaDevices: {
      getUserMedia: vi.fn(() => Promise.resolve(createMockMediaStream())),
      enumerateDevices: vi.fn(() => Promise.resolve([])),
      getSupportedConstraints: vi.fn(() => ({})),
    },
    permissions: {
      query: vi.fn(() => Promise.resolve({ state: 'granted' })),
      request: vi.fn(() => Promise.resolve({ state: 'granted' })),
    },
    clipboard: createMockClipboard(),
    serviceWorker: createMockServiceWorker(),
    storage: {
      estimate: vi.fn(() => Promise.resolve({ usage: 0, quota: 1000000 })),
    },
    connection: {
      effectiveType: '4g',
      downlink: 10,
      rtt: 100,
      saveData: false,
    },
    battery: {
      level: 1,
      charging: true,
      chargingTime: 0,
      dischargingTime: Infinity,
    },
    vibrate: vi.fn(() => true),
    share: vi.fn(() => Promise.resolve()),
    canShare: vi.fn(() => true),
    registerProtocolHandler: vi.fn(() => true),
    unregisterProtocolHandler: vi.fn(() => true),
  }
}

export const createMockDocument = () => {
  return {
    createElement: vi.fn((tagName) => {
      const element = document.createElement(tagName)
      if (tagName === 'canvas') {
        return createMockCanvas()
      }
      return element
    }),
    createTextNode: vi.fn((text) => document.createTextNode(text)),
    getElementById: vi.fn(() => null),
    getElementsByClassName: vi.fn(() => []),
    getElementsByTagName: vi.fn(() => []),
    querySelector: vi.fn(() => null),
    querySelectorAll: vi.fn(() => []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    readyState: 'complete',
    documentElement: document.documentElement,
    body: document.body,
    head: document.head,
    title: 'Test Document',
    URL: 'http://localhost:3000',
    domain: 'localhost',
    referrer: '',
    location: createMockLocation(),
    cookie: '',
    hidden: false,
    visibilityState: 'visible',
    onvisibilitychange: null,
    onreadystatechange: null,
    onDOMContentLoaded: null,
    onload: null,
    onerror: null,
    onbeforeunload: null,
    onunload: null,
  }
}

export const createMockWindow = () => {
  return {
    document: createMockDocument(),
    navigator: createMockNavigator(),
    location: createMockLocation(),
    history: createMockHistory(),
    performance: createMockPerformance(),
    localStorage: createMockLocalStorage(),
    sessionStorage: createMockSessionStorage(),
    indexedDB: createMockIndexedDB(),
    WebSocket: vi.fn(() => createMockWebSocket()),
    Worker: vi.fn(() => createMockWorker()),
    SharedWorker: vi.fn(() => createMockSharedWorker()),
    EventSource: vi.fn(),
    XMLHttpRequest: vi.fn(),
    fetch: createMockFetch([]),
    alert: vi.fn(),
    confirm: vi.fn(() => true),
    prompt: vi.fn(() => null),
    open: vi.fn(() => null),
    close: vi.fn(),
    print: vi.fn(),
    stop: vi.fn(),
    focus: vi.fn(),
    blur: vi.fn(),
    scroll: vi.fn(),
    scrollTo: vi.fn(),
    scrollBy: vi.fn(),
    requestAnimationFrame: createMockRequestAnimationFrame().requestAnimationFrame,
    cancelAnimationFrame: createMockRequestAnimationFrame().cancelAnimationFrame,
    requestIdleCallback: createMockIdleCallback().requestIdleCallback,
    cancelIdleCallback: createMockIdleCallback().cancelIdleCallback,
    getComputedStyle: vi.fn(() => ({})),
    getSelection: vi.fn(() => null),
    requestFullscreen: vi.fn(),
    exitFullscreen: vi.fn(),
    matchMedia: vi.fn(() => createMockMediaQuery()),
    atob: vi.fn((str) => Buffer.from(str, 'base64').toString('binary')),
    btoa: vi.fn((str) => Buffer.from(str, 'binary').toString('base64')),
    setTimeout: vi.fn((fn, delay) => setTimeout(fn, delay)),
    clearTimeout: vi.fn(clearTimeout),
    setInterval: vi.fn((fn, interval) => setInterval(fn, interval)),
    clearInterval: vi.fn(clearInterval),
    requestAnimationFrame: vi.fn((fn) => requestAnimationFrame(fn)),
    cancelAnimationFrame: vi.fn(cancelAnimationFrame),
    innerWidth: 1024,
    innerHeight: 768,
    outerWidth: 1024,
    outerHeight: 768,
    pageXOffset: 0,
    pageYOffset: 0,
    screenX: 0,
    screenY: 0,
    screenLeft: 0,
    screenTop: 0,
    screen: {
      width: 1024,
      height: 768,
      availWidth: 1024,
      availHeight: 768,
      colorDepth: 24,
      pixelDepth: 24,
      orientation: {
        type: 'landscape-primary',
        angle: 0,
      },
    },
    devicePixelRatio: 1,
    name: 'Test Window',
    status: '',
    opener: null,
    parent: null,
    top: null,
    self: null,
    window: null,
    frames: [],
    length: 0,
    closed: false,
    crypto: {
      getRandomValues: vi.fn((array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256)
        }
        return array
      }),
      subtle: {
        encrypt: vi.fn(() => Promise.resolve()),
        decrypt: vi.fn(() => Promise.resolve()),
        sign: vi.fn(() => Promise.resolve()),
        verify: vi.fn(() => Promise.resolve()),
        digest: vi.fn(() => Promise.resolve(new ArrayBuffer(0))),
        generateKey: vi.fn(() => Promise.resolve({})),
        deriveKey: vi.fn(() => Promise.resolve({})),
        deriveBits: vi.fn(() => Promise.resolve(new ArrayBuffer(0))),
        importKey: vi.fn(() => Promise.resolve({})),
        exportKey: vi.fn(() => Promise.resolve({})),
        unwrapKey: vi.fn(() => Promise.resolve({})),
        wrapKey: vi.fn(() => Promise.resolve({})),
      },
    },
  }
}

// Test helpers
export const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

export const waitForElement = async (element: HTMLElement, timeout: number = 5000) => {
  return new Promise((resolve, reject) => {
    if (element) {
      resolve(element)
      return
    }
    
    const timeoutId = setTimeout(() => {
      reject(new Error('Element not found within timeout'))
    }, timeout)
    
    const observer = new MutationObserver(() => {
      if (element) {
        clearTimeout(timeoutId)
        observer.disconnect()
        resolve(element)
      }
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

export const fireEventAsync = async (element: HTMLElement, eventType: string, options?: any) => {
  fireEvent[eventType as keyof typeof fireEvent](element, options)
  await flushPromises()
}

export const userEventAsync = async (element: HTMLElement, action: string, options?: any) => {
  const user = userEvent.setup()
  await user[action as keyof typeof user](element, options)
  await flushPromises()
}

export const mockComponentRender = (Component: React.ComponentType, props: any = {}) => {
  return render(<Component {...props} />)
}

export const mockHookRender = (hook: () => any, initialProps?: any) => {
  const result = render(hook())
  return result
}

export const createTestRenderer = (Component: React.ComponentType, props: any = {}) => {
  return render(<Component {...props} />)
}

export const createTestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="test-wrapper">{children}</div>
}

export const createTestProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="test-provider">{children}</div>
}

export const createTestContext = (defaultValue: any) => {
  return React.createContext(defaultValue)
}

export const createTestReducer = (state: any, action: any) => {
  return state
}

export const createTestMiddleware = (store: any) => (next: any) => (action: any) => {
  return next(action)
}

export const createTestSaga = function* () {
  yield null
}

export const createTestSelector = (state: any) => {
  return state
}

export const createTestAction = (type: string, payload?: any) => {
  return { type, payload }
}

export const createTestThunk = (payload?: any) => {
  return async (dispatch: any) => {
    dispatch({ type: 'TEST_START', payload })
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100))
    dispatch({ type: 'TEST_SUCCESS', payload })
  }
}

export const createTestError = (message: string, code?: string) => {
  const error = new Error(message)
  if (code) {
    (error as any).code = code
  }
  return error
}

export const createTestResponse = (data: any, status: number = 200) => {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  }
}

export const createTestRequest = (url: string, method: string = 'GET') => {
  return {
    url,
    method,
    headers: {},
    params: {},
    data: null,
  }
}

export const createTestAxiosInstance = () => {
  return {
    get: vi.fn(() => Promise.resolve(createTestResponse({}))),
    post: vi.fn(() => Promise.resolve(createTestResponse({}))),
    put: vi.fn(() => Promise.resolve(createTestResponse({}))),
    delete: vi.fn(() => Promise.resolve(createTestResponse({}))),
    patch: vi.fn(() => Promise.resolve(createTestResponse({}))),
    head: vi.fn(() => Promise.resolve(createTestResponse({}))),
    options: vi.fn(() => Promise.resolve(createTestResponse({}))),
    request: vi.fn(() => Promise.resolve(createTestResponse({}))),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
    defaults: {
      baseURL: '',
      timeout: 0,
      headers: {},
    },
  }
}

export const createTestRouter = () => {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    goBack: vi.fn(),
    goForward: vi.fn(),
    reload: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    route: '/',
    basePath: '',
    locale: 'en',
    locales: ['en'],
    defaultLocale: 'en',
    isReady: true,
    isFallback: false,
    isPreview: false,
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  }
}

export const createTestNextAuth = () => {
  return {
    signIn: vi.fn(() => Promise.resolve({})),
    signOut: vi.fn(() => Promise.resolve({})),
    useSession: vi.fn(() => ({
      data: { user: { name: 'Test User', email: 'test@example.com' } },
      status: 'authenticated',
    })),
    getSession: vi.fn(() => Promise.resolve({ user: { name: 'Test User', email: 'test@example.com' } })),
    getProviders: vi.fn(() => Promise.resolve({})),
    getCsrfToken: vi.fn(() => Promise.resolve('csrf-token')),
  }
}

export const createTestPrisma = () => {
  return {
    user: {
      findMany: vi.fn(() => Promise.resolve([])),
      findUnique: vi.fn(() => Promise.resolve(null)),
      findFirst: vi.fn(() => Promise.resolve(null)),
      create: vi.fn(() => Promise.resolve({})),
      update: vi.fn(() => Promise.resolve({})),
      upsert: vi.fn(() => Promise.resolve({})),
      delete: vi.fn(() => Promise.resolve({})),
      count: vi.fn(() => Promise.resolve(0)),
      aggregate: vi.fn(() => Promise.resolve({})),
      groupBy: vi.fn(() => Promise.resolve({})),
    },
    $connect: vi.fn(() => Promise.resolve()),
    $disconnect: vi.fn(() => Promise.resolve()),
    $transaction: vi.fn(() => Promise.resolve({})),
    $queryRaw: vi.fn(() => Promise.resolve([])),
    $executeRaw: vi.fn(() => Promise.resolve({})),
    $queryRawUnsafe: vi.fn(() => Promise.resolve([])),
    $executeRawUnsafe: vi.fn(() => Promise.resolve({})),
  }
}

export const createTestZAI = () => {
  return {
    create: vi.fn(() => Promise.resolve({
      chat: {
        completions: {
          create: vi.fn(() => Promise.resolve({
            choices: [{ message: { content: 'Test response' } }],
          })),
        },
      },
      images: {
        generations: {
          create: vi.fn(() => Promise.resolve({
            data: [{ base64: 'data:image/png;base64,test' }],
          })),
        },
      },
      functions: {
        invoke: vi.fn(() => Promise.resolve([])),
      },
    })),
  }
}

export const createTestSocketIO = () => {
  return {
    connect: vi.fn(() => Promise.resolve()),
    disconnect: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    once: vi.fn(),
    removeAllListeners: vi.fn(),
    listeners: new Map(),
    connected: false,
    id: 'test-socket-id',
  }
}

export const createTestLogger = () => {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    trace: vi.fn(),
    child: vi.fn(() => createTestLogger()),
  }
}

export const createTestMetrics = () => {
  return {
    counter: vi.fn(() => ({ inc: vi.fn(), dec: vi.fn(), reset: vi.fn() })),
    gauge: vi.fn(() => ({ set: vi.fn(), inc: vi.fn(), dec: vi.fn(), reset: vi.fn() })),
    histogram: vi.fn(() => ({ observe: vi.fn(), reset: vi.fn() })),
    summary: vi.fn(() => ({ observe: vi.fn(), reset: vi.fn() })),
    timer: vi.fn(() => ({ start: vi.fn(), stop: vi.fn(), observe: vi.fn(), reset: vi.fn() })),
    register: vi.fn(),
    clear: vi.fn(),
    metrics: vi.fn(() => Promise.resolve({})),
  }
}

export const createTestCache = () => {
  const cache = new Map()
  return {
    get: vi.fn((key: string) => Promise.resolve(cache.get(key))),
    set: vi.fn((key: string, value: any) => {
      cache.set(key, value)
      return Promise.resolve()
    }),
    delete: vi.fn((key: string) => {
      cache.delete(key)
      return Promise.resolve()
    }),
    clear: vi.fn(() => {
      cache.clear()
      return Promise.resolve()
    }),
    has: vi.fn((key: string) => Promise.resolve(cache.has(key))),
    keys: vi.fn(() => Promise.resolve(Array.from(cache.keys()))),
    values: vi.fn(() => Promise.resolve(Array.from(cache.values()))),
    entries: vi.fn(() => Promise.resolve(Array.from(cache.entries()))),
    size: vi.fn(() => Promise.resolve(cache.size)),
  }
}

export const createTestQueue = () => {
  const queue = []
  return {
    add: vi.fn((task: any) => {
      queue.push(task)
      return Promise.resolve()
    }),
    process: vi.fn(() => {
      const task = queue.shift()
      return Promise.resolve(task)
    }),
    peek: vi.fn(() => Promise.resolve(queue[0])),
    size: vi.fn(() => Promise.resolve(queue.length)),
    clear: vi.fn(() => {
      queue.length = 0
      return Promise.resolve()
    }),
    isEmpty: vi.fn(() => Promise.resolve(queue.length === 0)),
  }
}

export const createTestScheduler = () => {
  const jobs = new Map()
  return {
    schedule: vi.fn((name: string, job: any) => {
      jobs.set(name, job)
      return Promise.resolve()
    }),
    cancel: vi.fn((name: string) => {
      jobs.delete(name)
      return Promise.resolve()
    }),
    reschedule: vi.fn((name: string, job: any) => {
      jobs.set(name, job)
      return Promise.resolve()
    }),
    now: vi.fn((name: string) => {
      const job = jobs.get(name)
      return job ? Promise.resolve(job()) : Promise.resolve()
    }),
    jobs: vi.fn(() => Promise.resolve(Array.from(jobs.keys()))),
    clear: vi.fn(() => {
      jobs.clear()
      return Promise.resolve()
    }),
  }
}

export const createTestWorkerPool = () => {
  const workers = []
  const tasks = []
  return {
    addWorker: vi.fn((worker: any) => {
      workers.push(worker)
      return Promise.resolve()
    }),
    removeWorker: vi.fn((worker: any) => {
      const index = workers.indexOf(worker)
      if (index > -1) {
        workers.splice(index, 1)
      }
      return Promise.resolve()
    }),
    execute: vi.fn((task: any) => {
      tasks.push(task)
      return Promise.resolve()
    }),
    getWorkers: vi.fn(() => Promise.resolve(workers)),
    getTasks: vi.fn(() => Promise.resolve(tasks)),
    clear: vi.fn(() => {
      workers.length = 0
      tasks.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestRateLimiter = () => {
  const requests = []
  return {
    limit: vi.fn((key: string) => {
      const now = Date.now()
      const recentRequests = requests.filter(time => now - time < 60000)
      if (recentRequests.length < 100) {
        requests.push(now)
        return Promise.resolve(true)
      }
      return Promise.resolve(false)
    }),
    reset: vi.fn((key: string) => {
      return Promise.resolve()
    }),
    getRemaining: vi.fn((key: string) => {
      const now = Date.now()
      const recentRequests = requests.filter(time => now - time < 60000)
      return Promise.resolve(100 - recentRequests.length)
    }),
    clear: vi.fn(() => {
      requests.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestCircuitBreaker = () => {
  let state = 'closed'
  let failures = 0
  return {
    execute: vi.fn((fn: any) => {
      if (state === 'open') {
        return Promise.reject(new Error('Circuit breaker is open'))
      }
      return fn().catch((error: any) => {
        failures++
        if (failures >= 5) {
          state = 'open'
        }
        throw error
      })
    }),
    getState: vi.fn(() => Promise.resolve(state)),
    reset: vi.fn(() => {
      state = 'closed'
      failures = 0
      return Promise.resolve()
    }),
    isOpen: vi.fn(() => state === 'open'),
    isClosed: vi.fn(() => state === 'closed'),
    isHalfOpen: vi.fn(() => state === 'half-open'),
  }
}

export const createTestRetry = () => {
  return {
    execute: vi.fn((fn: any, options: any = {}) => {
      const { maxAttempts = 3, delay = 1000 } = options
      let attempts = 0
      
      const attempt = async () => {
        try {
          return await fn()
        } catch (error) {
          attempts++
          if (attempts >= maxAttempts) {
            throw error
          }
          await new Promise(resolve => setTimeout(resolve, delay * attempts))
          return attempt()
        }
      }
      
      return attempt()
    }),
  }
}

export const createTestTimeout = () => {
  return {
    execute: vi.fn((fn: any, timeout: number) => {
      return Promise.race([
        fn(),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), timeout)
        }),
      ])
    }),
  }
}

export const createTestDebounce = () => {
  let timeoutId: NodeJS.Timeout
  return {
    execute: vi.fn((fn: any, delay: number) => {
      clearTimeout(timeoutId)
      return new Promise((resolve) => {
        timeoutId = setTimeout(() => {
          resolve(fn())
        }, delay)
      })
    }),
    cancel: vi.fn(() => {
      clearTimeout(timeoutId)
    }),
  }
}

export const createTestThrottle = () => {
  let lastCall = 0
  return {
    execute: vi.fn((fn: any, limit: number) => {
      const now = Date.now()
      if (now - lastCall >= limit) {
        lastCall = now
        return Promise.resolve(fn())
      }
      return Promise.resolve()
    }),
  }
}

export const createTestMemoize = () => {
  const cache = new Map()
  return {
    execute: vi.fn((fn: any, key: any) => {
      if (cache.has(key)) {
        return Promise.resolve(cache.get(key))
      }
      const result = fn()
      cache.set(key, result)
      return Promise.resolve(result)
    }),
    clear: vi.fn(() => {
      cache.clear()
      return Promise.resolve()
    }),
    has: vi.fn((key: any) => Promise.resolve(cache.has(key))),
    delete: vi.fn((key: any) => {
      cache.delete(key)
      return Promise.resolve()
    }),
    size: vi.fn(() => Promise.resolve(cache.size)),
  }
}

export const createTestLazy = () => {
  return {
    load: vi.fn((fn: any) => {
      return Promise.resolve(fn())
    }),
    preload: vi.fn((fn: any) => {
      return Promise.resolve(fn())
    }),
    clear: vi.fn(() => {
      return Promise.resolve()
    }),
  }
}

export const createTestVirtualList = () => {
  const items = []
  return {
    scrollToItem: vi.fn((index: number) => Promise.resolve()),
    scrollToTop: vi.fn(() => Promise.resolve()),
    scrollToBottom: vi.fn(() => Promise.resolve()),
    getVisibleRange: vi.fn(() => Promise.resolve({ start: 0, end: 10 })),
    getScrollTop: vi.fn(() => Promise.resolve(0)),
    getScrollHeight: vi.fn(() => Promise.resolve(100)),
    getItemHeight: vi.fn((index: number) => Promise.resolve(50)),
    getItemOffset: vi.fn((index: number) => Promise.resolve(index * 50)),
    getTotalSize: vi.fn(() => Promise.resolve(items.length * 50)),
    getItemCount: vi.fn(() => Promise.resolve(items.length)),
    setItems: vi.fn((newItems: any) => {
      items.length = 0
      items.push(...newItems)
      return Promise.resolve()
    }),
    getItems: vi.fn(() => Promise.resolve([...items])),
    clear: vi.fn(() => {
      items.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestInfiniteScroll = () => {
  const items = []
  return {
    loadMore: vi.fn(() => Promise.resolve([])),
    reset: vi.fn(() => {
      items.length = 0
      return Promise.resolve()
    }),
    hasMore: vi.fn(() => Promise.resolve(true)),
    isLoading: vi.fn(() => Promise.resolve(false)),
    getItems: vi.fn(() => Promise.resolve([...items])),
    setItems: vi.fn((newItems: any) => {
      items.length = 0
      items.push(...newItems)
      return Promise.resolve()
    }),
    appendItems: vi.fn((newItems: any) => {
      items.push(...newItems)
      return Promise.resolve()
    }),
    clear: vi.fn(() => {
      items.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestDragAndDrop = () => {
  return {
    startDrag: vi.fn((item: any) => Promise.resolve()),
    endDrag: vi.fn(() => Promise.resolve()),
    dragOver: vi.fn((item: any) => Promise.resolve()),
    drop: vi.fn((item: any) => Promise.resolve()),
    cancelDrag: vi.fn(() => Promise.resolve()),
    isDragging: vi.fn(() => Promise.resolve(false)),
    getDraggedItem: vi.fn(() => Promise.resolve(null)),
    getDropTarget: vi.fn(() => Promise.resolve(null)),
  }
}

export const createTestForm = () => {
  const values = {}
  const errors = {}
  return {
    getValue: vi.fn((name: string) => Promise.resolve(values[name])),
    setValue: vi.fn((name: string, value: any) => {
      values[name] = value
      return Promise.resolve()
    }),
    getValues: vi.fn(() => Promise.resolve({ ...values })),
    setValues: vi.fn((newValues: any) => {
      Object.assign(values, newValues)
      return Promise.resolve()
    }),
    getError: vi.fn((name: string) => Promise.resolve(errors[name])),
    setError: vi.fn((name: string, error: any) => {
      errors[name] = error
      return Promise.resolve()
    }),
    getErrors: vi.fn(() => Promise.resolve({ ...errors })),
    setErrors: vi.fn((newErrors: any) => {
      Object.assign(errors, newErrors)
      return Promise.resolve()
    }),
    clearErrors: vi.fn(() => {
      Object.keys(errors).forEach(key => delete errors[key])
      return Promise.resolve()
    }),
    reset: vi.fn(() => {
      Object.keys(values).forEach(key => delete values[key])
      Object.keys(errors).forEach(key => delete errors[key])
      return Promise.resolve()
    }),
    submit: vi.fn(() => Promise.resolve({ ...values })),
    validate: vi.fn(() => Promise.resolve(true)),
    isValid: vi.fn(() => Promise.resolve(true)),
    isDirty: vi.fn(() => Promise.resolve(false)),
    isSubmitting: vi.fn(() => Promise.resolve(false)),
  }
}

export const createTestTable = () => {
  const data = []
  const columns = []
  return {
    getData: vi.fn(() => Promise.resolve([...data])),
    setData: vi.fn((newData: any) => {
      data.length = 0
      data.push(...newData)
      return Promise.resolve()
    }),
    getColumns: vi.fn(() => Promise.resolve([...columns])),
    setColumns: vi.fn((newColumns: any) => {
      columns.length = 0
      columns.push(...newColumns)
      return Promise.resolve()
    }),
    addRow: vi.fn((row: any) => {
      data.push(row)
      return Promise.resolve()
    }),
    removeRow: vi.fn((index: number) => {
      data.splice(index, 1)
      return Promise.resolve()
    }),
    updateRow: vi.fn((index: number, row: any) => {
      data[index] = row
      return Promise.resolve()
    }),
    sort: vi.fn((column: string, direction: 'asc' | 'desc') => Promise.resolve()),
    filter: vi.fn((filters: any) => Promise.resolve()),
    search: vi.fn((query: string) => Promise.resolve()),
    paginate: vi.fn((page: number, pageSize: number) => Promise.resolve()),
    export: vi.fn((format: string) => Promise.resolve()),
    import: vi.fn((data: any) => Promise.resolve()),
    clear: vi.fn(() => {
      data.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestChart = () => {
  const data = []
  return {
    getData: vi.fn(() => Promise.resolve([...data])),
    setData: vi.fn((newData: any) => {
      data.length = 0
      data.push(...newData)
      return Promise.resolve()
    }),
    addData: vi.fn((newData: any) => {
      data.push(...newData)
      return Promise.resolve()
    }),
    removeData: vi.fn((index: number) => {
      data.splice(index, 1)
      return Promise.resolve()
    }),
    updateData: vi.fn((index: number, newData: any) => {
      data[index] = newData
      return Promise.resolve()
    }),
    clear: vi.fn(() => {
      data.length = 0
      return Promise.resolve()
    }),
    render: vi.fn(() => Promise.resolve()),
    resize: vi.fn((width: number, height: number) => Promise.resolve()),
    export: vi.fn((format: string) => Promise.resolve()),
    zoom: vi.fn((level: number) => Promise.resolve()),
    pan: vi.fn((x: number, y: number) => Promise.resolve()),
    reset: vi.fn(() => Promise.resolve()),
  }
}

export const createTestMap = () => {
  const markers = []
  return {
    addMarker: vi.fn((marker: any) => {
      markers.push(marker)
      return Promise.resolve()
    }),
    removeMarker: vi.fn((marker: any) => {
      const index = markers.indexOf(marker)
      if (index > -1) {
        markers.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getMarkers: vi.fn(() => Promise.resolve([...markers])),
    clearMarkers: vi.fn(() => {
      markers.length = 0
      return Promise.resolve()
    }),
    setCenter: vi.fn((lat: number, lng: number) => Promise.resolve()),
    setZoom: vi.fn((zoom: number) => Promise.resolve()),
    getCenter: vi.fn(() => Promise.resolve({ lat: 0, lng: 0 })),
    getZoom: vi.fn(() => Promise.resolve(10)),
    fitBounds: vi.fn((bounds: any) => Promise.resolve()),
    panTo: vi.fn((lat: number, lng: number) => Promise.resolve()),
    zoomTo: vi.fn((zoom: number) => Promise.resolve()),
  }
}

export const createTestCalendar = () => {
  const events = []
  return {
    getEvents: vi.fn(() => Promise.resolve([...events])),
    addEvent: vi.fn((event: any) => {
      events.push(event)
      return Promise.resolve()
    }),
    removeEvent: vi.fn((event: any) => {
      const index = events.indexOf(event)
      if (index > -1) {
        events.splice(index, 1)
      }
      return Promise.resolve()
    }),
    updateEvent: vi.fn((event: any) => {
      const index = events.findIndex(e => e.id === event.id)
      if (index > -1) {
        events[index] = event
      }
      return Promise.resolve()
    }),
    clearEvents: vi.fn(() => {
      events.length = 0
      return Promise.resolve()
    }),
    goTo: vi.fn((date: Date) => Promise.resolve()),
    today: vi.fn(() => Promise.resolve()),
    next: vi.fn(() => Promise.resolve()),
    prev: vi.fn(() => Promise.resolve()),
    getView: vi.fn(() => Promise.resolve('month')),
    setView: vi.fn((view: string) => Promise.resolve()),
  }
}

export const createTestFileUpload = () => {
  const files = []
  return {
    upload: vi.fn((file: File) => {
      files.push(file)
      return Promise.resolve({ url: 'test-url', id: 'test-id' })
    }),
    remove: vi.fn((file: any) => {
      const index = files.indexOf(file)
      if (index > -1) {
        files.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getFiles: vi.fn(() => Promise.resolve([...files])),
    clear: vi.fn(() => {
      files.length = 0
      return Promise.resolve()
    }),
    uploadMultiple: vi.fn((files: File[]) => {
      files.push(...files)
      return Promise.resolve(files.map(file => ({ url: 'test-url', id: 'test-id' })))
    }),
    pause: vi.fn(() => Promise.resolve()),
    resume: vi.fn(() => Promise.resolve()),
    cancel: vi.fn(() => Promise.resolve()),
  }
}

export const createTestNotification = () => {
  const notifications = []
  return {
    show: vi.fn((notification: any) => {
      notifications.push(notification)
      return Promise.resolve('test-id')
    }),
    hide: vi.fn((id: string) => {
      const index = notifications.findIndex(n => n.id === id)
      if (index > -1) {
        notifications.splice(index, 1)
      }
      return Promise.resolve()
    }),
    clear: vi.fn(() => {
      notifications.length = 0
      return Promise.resolve()
    }),
    getNotifications: vi.fn(() => Promise.resolve([...notifications])),
    update: vi.fn((id: string, notification: any) => {
      const index = notifications.findIndex(n => n.id === id)
      if (index > -1) {
        notifications[index] = { ...notifications[index], ...notification }
      }
      return Promise.resolve()
    }),
  }
}

export const createTestModal = () => {
  return {
    open: vi.fn(() => Promise.resolve()),
    close: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isOpen: vi.fn(() => Promise.resolve(false)),
    getContent: vi.fn(() => Promise.resolve(null)),
    setContent: vi.fn((content: any) => Promise.resolve()),
    setTitle: vi.fn((title: string) => Promise.resolve()),
    setOptions: vi.fn((options: any) => Promise.resolve()),
  }
}

export const createTestTooltip = () => {
  return {
    show: vi.fn(() => Promise.resolve()),
    hide: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isVisible: vi.fn(() => Promise.resolve(false)),
    setContent: vi.fn((content: any) => Promise.resolve()),
    setPosition: vi.fn((position: any) => Promise.resolve()),
    setOptions: vi.fn((options: any) => Promise.resolve()),
  }
}

export const createTestDropdown = () => {
  const items = []
  return {
    open: vi.fn(() => Promise.resolve()),
    close: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isOpen: vi.fn(() => Promise.resolve(false)),
    getItems: vi.fn(() => Promise.resolve([...items])),
    setItems: vi.fn((newItems: any) => {
      items.length = 0
      items.push(...newItems)
      return Promise.resolve()
    }),
    addItem: vi.fn((item: any) => {
      items.push(item)
      return Promise.resolve()
    }),
    removeItem: vi.fn((item: any) => {
      const index = items.indexOf(item)
      if (index > -1) {
        items.splice(index, 1)
      }
      return Promise.resolve()
    }),
    clear: vi.fn(() => {
      items.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestTabs = () => {
  const tabs = []
  return {
    addTab: vi.fn((tab: any) => {
      tabs.push(tab)
      return Promise.resolve()
    }),
    removeTab: vi.fn((tab: any) => {
      const index = tabs.indexOf(tab)
      if (index > -1) {
        tabs.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getTabs: vi.fn(() => Promise.resolve([...tabs])),
    setTabs: vi.fn((newTabs: any) => {
      tabs.length = 0
      tabs.push(...newTabs)
      return Promise.resolve()
    }),
    setActiveTab: vi.fn((tab: any) => Promise.resolve()),
    getActiveTab: vi.fn(() => Promise.resolve(tabs[0])),
    clear: vi.fn(() => {
      tabs.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestAccordion = () => {
  const items = []
  return {
    addItem: vi.fn((item: any) => {
      items.push(item)
      return Promise.resolve()
    }),
    removeItem: vi.fn((item: any) => {
      const index = items.indexOf(item)
      if (index > -1) {
        items.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getItems: vi.fn(() => Promise.resolve([...items])),
    setItems: vi.fn((newItems: any) => {
      items.length = 0
      items.push(...newItems)
      return Promise.resolve()
    }),
    expand: vi.fn((item: any) => Promise.resolve()),
    collapse: vi.fn((item: any) => Promise.resolve()),
    expandAll: vi.fn(() => Promise.resolve()),
    collapseAll: vi.fn(() => Promise.resolve()),
    toggle: vi.fn((item: any) => Promise.resolve()),
  }
}

export const createTestCarousel = () => {
  const items = []
  return {
    addItem: vi.fn((item: any) => {
      items.push(item)
      return Promise.resolve()
    }),
    removeItem: vi.fn((item: any) => {
      const index = items.indexOf(item)
      if (index > -1) {
        items.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getItems: vi.fn(() => Promise.resolve([...items])),
    setItems: vi.fn((newItems: any) => {
      items.length = 0
      items.push(...newItems)
      return Promise.resolve()
    }),
    next: vi.fn(() => Promise.resolve()),
    prev: vi.fn(() => Promise.resolve()),
    goTo: vi.fn((index: number) => Promise.resolve()),
    getCurrentIndex: vi.fn(() => Promise.resolve(0)),
    getCurrentItem: vi.fn(() => Promise.resolve(items[0])),
    play: vi.fn(() => Promise.resolve()),
    pause: vi.fn(() => Promise.resolve()),
    stop: vi.fn(() => Promise.resolve()),
  }
}

export const createTestPagination = () => {
  return {
    goTo: vi.fn((page: number) => Promise.resolve()),
    next: vi.fn(() => Promise.resolve()),
    prev: vi.fn(() => Promise.resolve()),
    getCurrentPage: vi.fn(() => Promise.resolve(1)),
    getTotalPages: vi.fn(() => Promise.resolve(10)),
    getTotalItems: vi.fn(() => Promise.resolve(100)),
    setPageSize: vi.fn((size: number) => Promise.resolve()),
    getPageSize: vi.fn(() => Promise.resolve(10)),
  }
}

export const createTestBreadcrumb = () => {
  const items = []
  return {
    addItem: vi.fn((item: any) => {
      items.push(item)
      return Promise.resolve()
    }),
    removeItem: vi.fn((item: any) => {
      const index = items.indexOf(item)
      if (index > -1) {
        items.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getItems: vi.fn(() => Promise.resolve([...items])),
    setItems: vi.fn((newItems: any) => {
      items.length = 0
      items.push(...newItems)
      return Promise.resolve()
    }),
    clear: vi.fn(() => {
      items.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestProgress = () => {
  return {
    setValue: vi.fn((value: number) => Promise.resolve()),
    getValue: vi.fn(() => Promise.resolve(0)),
    setMax: vi.fn((max: number) => Promise.resolve()),
    getMax: vi.fn(() => Promise.resolve(100)),
    setMin: vi.fn((min: number) => Promise.resolve()),
    getMin: vi.fn(() => Promise.resolve(0)),
    setIndeterminate: vi.fn((indeterminate: boolean) => Promise.resolve()),
    isIndeterminate: vi.fn(() => Promise.resolve(false)),
    reset: vi.fn(() => Promise.resolve()),
  }
}

export const createTestSkeleton = () => {
  return {
    show: vi.fn(() => Promise.resolve()),
    hide: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isVisible: vi.fn(() => Promise.resolve(false)),
  }
}

export const createTestSpinner = () => {
  return {
    show: vi.fn(() => Promise.resolve()),
    hide: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isVisible: vi.fn(() => Promise.resolve(false)),
    setSize: vi.fn((size: string) => Promise.resolve()),
    setColor: vi.fn((color: string) => Promise.resolve()),
  }
}

export const createTestAlert = () => {
  return {
    show: vi.fn((message: string, type: string) => Promise.resolve()),
    hide: vi.fn(() => Promise.resolve()),
    clear: vi.fn(() => Promise.resolve()),
    success: vi.fn((message: string) => Promise.resolve()),
    error: vi.fn((message: string) => Promise.resolve()),
    warning: vi.fn((message: string) => Promise.resolve()),
    info: vi.fn((message: string) => Promise.resolve()),
  }
}

export const createTestDrawer = () => {
  return {
    open: vi.fn(() => Promise.resolve()),
    close: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isOpen: vi.fn(() => Promise.resolve(false)),
    setContent: vi.fn((content: any) => Promise.resolve()),
    setPosition: vi.fn((position: string) => Promise.resolve()),
    setSize: vi.fn((size: string) => Promise.resolve()),
  }
}

export const createTestSheet = () => {
  return {
    open: vi.fn(() => Promise.resolve()),
    close: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isOpen: vi.fn(() => Promise.resolve(false)),
    setContent: vi.fn((content: any) => Promise.resolve()),
    setPosition: vi.fn((position: string) => Promise.resolve()),
    setSize: vi.fn((size: string) => Promise.resolve()),
  }
}

export const createTestDialog = () => {
  return {
    open: vi.fn(() => Promise.resolve()),
    close: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isOpen: vi.fn(() => Promise.resolve(false)),
    setContent: vi.fn((content: any) => Promise.resolve()),
    setTitle: vi.fn((title: string) => Promise.resolve()),
    setOptions: vi.fn((options: any) => Promise.resolve()),
  }
}

export const createTestPopover = () => {
  return {
    show: vi.fn(() => Promise.resolve()),
    hide: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isVisible: vi.fn(() => Promise.resolve(false)),
    setContent: vi.fn((content: any) => Promise.resolve()),
    setPosition: vi.fn((position: any) => Promise.resolve()),
    setOptions: vi.fn((options: any) => Promise.resolve()),
  }
}

export const createTestHoverCard = () => {
  return {
    show: vi.fn(() => Promise.resolve()),
    hide: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isVisible: vi.fn(() => Promise.resolve(false)),
    setContent: vi.fn((content: any) => Promise.resolve()),
    setPosition: vi.fn((position: any) => Promise.resolve()),
    setOptions: vi.fn((options: any) => Promise.resolve()),
  }
}

export const createTestCommand = () => {
  const commands = []
  return {
    register: vi.fn((command: any) => {
      commands.push(command)
      return Promise.resolve()
    }),
    unregister: vi.fn((command: any) => {
      const index = commands.indexOf(command)
      if (index > -1) {
        commands.splice(index, 1)
      }
      return Promise.resolve()
    }),
    execute: vi.fn((name: string, ...args: any[]) => Promise.resolve()),
    getCommands: vi.fn(() => Promise.resolve([...commands])),
    clear: vi.fn(() => {
      commands.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestContextMenu = () => {
  const items = []
  return {
    addItem: vi.fn((item: any) => {
      items.push(item)
      return Promise.resolve()
    }),
    removeItem: vi.fn((item: any) => {
      const index = items.indexOf(item)
      if (index > -1) {
        items.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getItems: vi.fn(() => Promise.resolve([...items])),
    setItems: vi.fn((newItems: any) => {
      items.length = 0
      items.push(...newItems)
      return Promise.resolve()
    }),
    show: vi.fn(() => Promise.resolve()),
    hide: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isVisible: vi.fn(() => Promise.resolve(false)),
  }
}

export const createTestMenubar = () => {
  const menus = []
  return {
    addMenu: vi.fn((menu: any) => {
      menus.push(menu)
      return Promise.resolve()
    }),
    removeMenu: vi.fn((menu: any) => {
      const index = menus.indexOf(menu)
      if (index > -1) {
        menus.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getMenus: vi.fn(() => Promise.resolve([...menus])),
    setMenus: vi.fn((newMenus: any) => {
      menus.length = 0
      menus.push(...newMenus)
      return Promise.resolve()
    }),
    clear: vi.fn(() => {
      menus.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestNavigationMenu = () => {
  const items = []
  return {
    addItem: vi.fn((item: any) => {
      items.push(item)
      return Promise.resolve()
    }),
    removeItem: vi.fn((item: any) => {
      const index = items.indexOf(item)
      if (index > -1) {
        items.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getItems: vi.fn(() => Promise.resolve([...items])),
    setItems: vi.fn((newItems: any) => {
      items.length = 0
      items.push(...newItems)
      return Promise.resolve()
    }),
    setActiveItem: vi.fn((item: any) => Promise.resolve()),
    getActiveItem: vi.fn(() => Promise.resolve(items[0])),
    clear: vi.fn(() => {
      items.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestPagination = () => {
  return {
    goTo: vi.fn((page: number) => Promise.resolve()),
    next: vi.fn(() => Promise.resolve()),
    prev: vi.fn(() => Promise.resolve()),
    getCurrentPage: vi.fn(() => Promise.resolve(1)),
    getTotalPages: vi.fn(() => Promise.resolve(10)),
    getTotalItems: vi.fn(() => Promise.resolve(100)),
    setPageSize: vi.fn((size: number) => Promise.resolve()),
    getPageSize: vi.fn(() => Promise.resolve(10)),
  }
}

export const createTestResizable = () => {
  return {
    resize: vi.fn((width: number, height: number) => Promise.resolve()),
    setWidth: vi.fn((width: number) => Promise.resolve()),
    setHeight: vi.fn((height: number) => Promise.resolve()),
    getWidth: vi.fn(() => Promise.resolve(100)),
    getHeight: vi.fn(() => Promise.resolve(100)),
    getMinWidth: vi.fn(() => Promise.resolve(50)),
    getMaxWidth: vi.fn(() => Promise.resolve(500)),
    getMinHeight: vi.fn(() => Promise.resolve(50)),
    getMaxHeight: vi.fn(() => Promise.resolve(500)),
    enable: vi.fn(() => Promise.resolve()),
    disable: vi.fn(() => Promise.resolve()),
    isEnabled: vi.fn(() => Promise.resolve(true)),
  }
}

export const createTestScrollArea = () => {
  return {
    scrollTo: vi.fn((x: number, y: number) => Promise.resolve()),
    scrollToTop: vi.fn(() => Promise.resolve()),
    scrollToBottom: vi.fn(() => Promise.resolve()),
    scrollToLeft: vi.fn(() => Promise.resolve()),
    scrollToRight: vi.fn(() => Promise.resolve()),
    getScrollTop: vi.fn(() => Promise.resolve(0)),
    getScrollLeft: vi.fn(() => Promise.resolve(0)),
    getScrollWidth: vi.fn(() => Promise.resolve(100)),
    getScrollHeight: vi.fn(() => Promise.resolve(100)),
    getClientWidth: vi.fn(() => Promise.resolve(100)),
    getClientHeight: vi.fn(() => Promise.resolve(100)),
    setScrollbars: vi.fn((visible: boolean) => Promise.resolve()),
    isScrollbarVisible: vi.fn(() => Promise.resolve(true)),
  }
}

export const createTestSelect = () => {
  const options = []
  return {
    addOption: vi.fn((option: any) => {
      options.push(option)
      return Promise.resolve()
    }),
    removeOption: vi.fn((option: any) => {
      const index = options.indexOf(option)
      if (index > -1) {
        options.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getOptions: vi.fn(() => Promise.resolve([...options])),
    setOptions: vi.fn((newOptions: any) => {
      options.length = 0
      options.push(...newOptions)
      return Promise.resolve()
    }),
    setValue: vi.fn((value: any) => Promise.resolve()),
    getValue: vi.fn(() => Promise.resolve(null)),
    clear: vi.fn(() => {
      options.length = 0
      return Promise.resolve()
    }),
    open: vi.fn(() => Promise.resolve()),
    close: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isOpen: vi.fn(() => Promise.resolve(false)),
  }
}

export const createTestSeparator = () => {
  return {
    setOrientation: vi.fn((orientation: string) => Promise.resolve()),
    getOrientation: vi.fn(() => Promise.resolve('horizontal')),
    setVariant: vi.fn((variant: string) => Promise.resolve()),
    getVariant: vi.fn(() => Promise.resolve('solid')),
  }
}

export const createTestSlider = () => {
  return {
    setValue: vi.fn((value: number) => Promise.resolve()),
    getValue: vi.fn(() => Promise.resolve(0)),
    setMin: vi.fn((min: number) => Promise.resolve()),
    getMin: vi.fn(() => Promise.resolve(0)),
    setMax: vi.fn((max: number) => Promise.resolve()),
    getMax: vi.fn(() => Promise.resolve(100)),
    setStep: vi.fn((step: number) => Promise.resolve()),
    getStep: vi.fn(() => Promise.resolve(1)),
    setDisabled: vi.fn((disabled: boolean) => Promise.resolve()),
    isDisabled: vi.fn(() => Promise.resolve(false)),
  }
}

export const createTestSwitch = () => {
  return {
    setValue: vi.fn((value: boolean) => Promise.resolve()),
    getValue: vi.fn(() => Promise.resolve(false)),
    setDisabled: vi.fn((disabled: boolean) => Promise.resolve()),
    isDisabled: vi.fn(() => Promise.resolve(false)),
    toggle: vi.fn(() => Promise.resolve()),
  }
}

export const createTestTable = () => {
  const data = []
  const columns = []
  return {
    getData: vi.fn(() => Promise.resolve([...data])),
    setData: vi.fn((newData: any) => {
      data.length = 0
      data.push(...newData)
      return Promise.resolve()
    }),
    getColumns: vi.fn(() => Promise.resolve([...columns])),
    setColumns: vi.fn((newColumns: any) => {
      columns.length = 0
      columns.push(...newColumns)
      return Promise.resolve()
    }),
    addRow: vi.fn((row: any) => {
      data.push(row)
      return Promise.resolve()
    }),
    removeRow: vi.fn((index: number) => {
      data.splice(index, 1)
      return Promise.resolve()
    }),
    updateRow: vi.fn((index: number, row: any) => {
      data[index] = row
      return Promise.resolve()
    }),
    sort: vi.fn((column: string, direction: 'asc' | 'desc') => Promise.resolve()),
    filter: vi.fn((filters: any) => Promise.resolve()),
    search: vi.fn((query: string) => Promise.resolve()),
    paginate: vi.fn((page: number, pageSize: number) => Promise.resolve()),
    export: vi.fn((format: string) => Promise.resolve()),
    import: vi.fn((data: any) => Promise.resolve()),
    clear: vi.fn(() => {
      data.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestTabs = () => {
  const tabs = []
  return {
    addTab: vi.fn((tab: any) => {
      tabs.push(tab)
      return Promise.resolve()
    }),
    removeTab: vi.fn((tab: any) => {
      const index = tabs.indexOf(tab)
      if (index > -1) {
        tabs.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getTabs: vi.fn(() => Promise.resolve([...tabs])),
    setTabs: vi.fn((newTabs: any) => {
      tabs.length = 0
      tabs.push(...newTabs)
      return Promise.resolve()
    }),
    setActiveTab: vi.fn((tab: any) => Promise.resolve()),
    getActiveTab: vi.fn(() => Promise.resolve(tabs[0])),
    clear: vi.fn(() => {
      tabs.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestTextarea = () => {
  return {
    setValue: vi.fn((value: string) => Promise.resolve()),
    getValue: vi.fn(() => Promise.resolve('')),
    setPlaceholder: vi.fn((placeholder: string) => Promise.resolve()),
    getPlaceholder: vi.fn(() => Promise.resolve('')),
    setDisabled: vi.fn((disabled: boolean) => Promise.resolve()),
    isDisabled: vi.fn(() => Promise.resolve(false)),
    setReadOnly: vi.fn((readOnly: boolean) => Promise.resolve()),
    isReadOnly: vi.fn(() => Promise.resolve(false)),
    setRows: vi.fn((rows: number) => Promise.resolve()),
    getRows: vi.fn(() => Promise.resolve(3)),
    setCols: vi.fn((cols: number) => Promise.resolve()),
    getCols: vi.fn(() => Promise.resolve(20)),
    focus: vi.fn(() => Promise.resolve()),
    blur: vi.fn(() => Promise.resolve()),
    select: vi.fn(() => Promise.resolve()),
    setSelectionRange: vi.fn((start: number, end: number) => Promise.resolve()),
    getSelectionRange: vi.fn(() => Promise.resolve({ start: 0, end: 0 })),
  }
}

export const createTestToast = () => {
  const toasts = []
  return {
    show: vi.fn((toast: any) => {
      toasts.push(toast)
      return Promise.resolve('test-id')
    }),
    hide: vi.fn((id: string) => {
      const index = toasts.findIndex(t => t.id === id)
      if (index > -1) {
        toasts.splice(index, 1)
      }
      return Promise.resolve()
    }),
    clear: vi.fn(() => {
      toasts.length = 0
      return Promise.resolve()
    }),
    getToasts: vi.fn(() => Promise.resolve([...toasts])),
    success: vi.fn((message: string) => Promise.resolve('success-id')),
    error: vi.fn((message: string) => Promise.resolve('error-id')),
    warning: vi.fn((message: string) => Promise.resolve('warning-id')),
    info: vi.fn((message: string) => Promise.resolve('info-id')),
  }
}

export const createTestToaster = () => {
  return {
    toast: vi.fn((message: string, options?: any) => Promise.resolve('toast-id')),
    success: vi.fn((message: string, options?: any) => Promise.resolve('success-id')),
    error: vi.fn((message: string, options?: any) => Promise.resolve('error-id')),
    warning: vi.fn((message: string, options?: any) => Promise.resolve('warning-id')),
    info: vi.fn((message: string, options?: any) => Promise.resolve('info-id')),
    dismiss: vi.fn((id: string) => Promise.resolve()),
    clear: vi.fn(() => Promise.resolve()),
  }
}

export const createTestToggle = () => {
  return {
    setValue: vi.fn((value: boolean) => Promise.resolve()),
    getValue: vi.fn(() => Promise.resolve(false)),
    setDisabled: vi.fn((disabled: boolean) => Promise.resolve()),
    isDisabled: vi.fn(() => Promise.resolve(false)),
    toggle: vi.fn(() => Promise.resolve()),
  }
}

export const createTestToggleGroup = () => {
  const items = []
  return {
    addItem: vi.fn((item: any) => {
      items.push(item)
      return Promise.resolve()
    }),
    removeItem: vi.fn((item: any) => {
      const index = items.indexOf(item)
      if (index > -1) {
        items.splice(index, 1)
      }
      return Promise.resolve()
    }),
    getItems: vi.fn(() => Promise.resolve([...items])),
    setItems: vi.fn((newItems: any) => {
      items.length = 0
      items.push(...newItems)
      return Promise.resolve()
    }),
    setValue: vi.fn((value: any) => Promise.resolve()),
    getValue: vi.fn(() => Promise.resolve(null)),
    setDisabled: vi.fn((disabled: boolean) => Promise.resolve()),
    isDisabled: vi.fn(() => Promise.resolve(false)),
    clear: vi.fn(() => {
      items.length = 0
      return Promise.resolve()
    }),
  }
}

export const createTestTooltip = () => {
  return {
    show: vi.fn(() => Promise.resolve()),
    hide: vi.fn(() => Promise.resolve()),
    toggle: vi.fn(() => Promise.resolve()),
    isVisible: vi.fn(() => Promise.resolve(false)),
    setContent: vi.fn((content: any) => Promise.resolve()),
    setPosition: vi.fn((position: any) => Promise.resolve()),
    setOptions: vi.fn((options: any) => Promise.resolve()),
  }
}

// Cleanup function
export const cleanup = () => {
  mockConsole.mockRestore()
  mockError.mockRestore()
  mockWarn.mockRestore()
  vi.clearAllMocks()
}

// Export all test utilities
export default {
  // Mock creators
  createMockComponent,
  createMockHook,
  createMockEvent,
  createMockElement,
  createMockResponse,
  createMockFetch,
  createMockWebSocket,
  createMockLocalStorage,
  createMockSessionStorage,
  createMockIntersectionObserver,
  createMockResizeObserver,
  createMockMutationObserver,
  createMockMediaQuery,
  createMockGeolocation,
  createMockNotification,
  createMockClipboard,
  createMockFileReader,
  createMockCanvas,
  createMockAudioContext,
  createMockRTCPeerConnection,
  createMockMediaStream,
  createMockMediaRecorder,
  createMockServiceWorker,
  createMockCache,
  createMockIndexedDB,
  createMockWorker,
  createMockSharedWorker,
  createMockBlob,
  createMockFile,
  createMockURL,
  createMockPerformance,
  createMockAnimation,
  createMockRequestAnimationFrame,
  createMockIdleCallback,
  createMockHistory,
  createMockLocation,
  createMockNavigator,
  createMockDocument,
  createMockWindow,
  createTestRenderer,
  createTestWrapper,
  createTestProvider,
  createTestContext,
  createTestReducer,
  createTestMiddleware,
  createTestSaga,
  createTestSelector,
  createTestAction,
  createTestThunk,
  createTestError,
  createTestResponse,
  createTestRequest,
  createTestAxiosInstance,
  createTestRouter,
  createTestNextAuth,
  createTestPrisma,
  createTestZAI,
  createTestSocketIO,
  createTestLogger,
  createTestMetrics,
  createTestCache,
  createTestQueue,
  createTestScheduler,
  createTestWorkerPool,
  createTestRateLimiter,
  createTestCircuitBreaker,
  createTestRetry,
  createTestTimeout,
  createTestDebounce,
  createTestThrottle,
  createTestMemoize,
  createTestLazy,
  createTestVirtualList,
  createTestInfiniteScroll,
  createTestDragAndDrop,
  createTestForm,
  createTestTable,
  createTestChart,
  createTestMap,
  createTestCalendar,
  createTestFileUpload,
  createTestNotification,
  createTestModal,
  createTestTooltip,
  createTestDropdown,
  createTestTabs,
  createTestAccordion,
  createTestCarousel,
  createTestPagination,
  createTestBreadcrumb,
  createTestProgress,
  createTestSkeleton,
  createTestSpinner,
  createTestAlert,
  createTestDrawer,
  createTestSheet,
  createTestDialog,
  createTestPopover,
  createTestHoverCard,
  createTestCommand,
  createTestContextMenu,
  createTestMenubar,
  createTestNavigationMenu,
  createTestResizable,
  createTestScrollArea,
  createTestSelect,
  createTestSeparator,
  createTestSlider,
  createTestSwitch,
  createTestTable,
  createTestTabs,
  createTestTextarea,
  createTestToast,
  createTestToaster,
  createTestToggle,
  createTestToggleGroup,
  createTestTooltip,
  
  // Test helpers
  flushPromises,
  waitForElement,
  fireEventAsync,
  userEventAsync,
  mockComponentRender,
  mockHookRender,
  cleanup,
  
  // Vitest exports
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  Mock,
}