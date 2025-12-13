import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'

// Configure testing library
configure({ testIdAttribute: 'data-testid' })

// Essential mocks for Next.js
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
    push: jest.fn(),
    pop: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  })),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Global mocks
global.WebSocket = jest.fn(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}))

global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

global.matchMedia = jest.fn(() => ({
  matches: false,
  media: '(max-width:768px)',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))

// Local storage mocks
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Fetch mock
global.fetch = jest.fn()

// Console mock
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Process mock
global.process = {
  env: {
    NODE_ENV: 'test',
  },
} as any

// Document mock
global.document = {
  createElement: jest.fn(),
  getElementById: jest.fn(),
  getElementsByClassName: jest.fn(),
  getElementsByTagName: jest.fn(),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}

// Window mock
global.window = {
  location: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  },
  navigator: {
    userAgent: 'Mozilla/5.0 (Test Environment)',
    language: 'en-US',
    languages: ['en-US', 'en'],
    platform: 'Test',
    cookieEnabled: true,
    onLine: true,
    hardwareConcurrency: 4,
    maxTouchPoints: 0,
    vendor: 'Test Vendor',
    product: 'Test Product',
    appCodeName: 'Mozilla',
    appName: 'Test Browser',
    appVersion: '1.0',
  },
  localStorage: localStorageMock,
  sessionStorage: sessionStorageMock,
  history: {
    pushState: jest.fn(),
    replaceState: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    length: 0,
    state: null,
    scrollRestoration: 'auto',
  },
  location: global.location,
  document: global.document,
  performance: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
    getEntries: jest.fn(() => []),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
    clearResourceTimings: jest.fn(),
    getEntriesByResourceTimingType: jest.fn(() => []),
    setResourceTimingBufferSize: jest.fn(),
    toJSON: jest.fn(() => ({})),
  },
  },
}

// Cleanup function
afterEach(() => {
  jest.clearAllMocks()
})

export default {
  configure,
  afterEach,
}