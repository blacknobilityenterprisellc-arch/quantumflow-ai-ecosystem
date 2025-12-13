// 🧠 AETHERIUS-ETERNAL QUANTUM TAILWIND CONFIGURATION
// Cutting-edge Tailwind CSS 4.1 optimization as of December 2025

import type { Config } from 'tailwindcss';

// 🚀 Quantum Design System
const quantumColors = {
  quantum: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  keystone: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },
  aetherius: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  }
};

// 🎯 Advanced Typography Scale
const typographyScale = {
  'quantum-xs': ['0.75rem', { lineHeight: '1rem' }],
  'quantum-sm': ['0.875rem', { lineHeight: '1.25rem' }],
  'quantum-base': ['1rem', { lineHeight: '1.5rem' }],
  'quantum-lg': ['1.125rem', { lineHeight: '1.75rem' }],
  'quantum-xl': ['1.25rem', { lineHeight: '1.75rem' }],
  'quantum-2xl': ['1.5rem', { lineHeight: '2rem' }],
  'quantum-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  'quantum-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  'quantum-5xl': ['3rem', { lineHeight: '1' }],
  'quantum-6xl': ['3.75rem', { lineHeight: '1' }],
  'quantum-7xl': ['4.5rem', { lineHeight: '1' }],
  'quantum-8xl': ['6rem', { lineHeight: '1' }],
  'quantum-9xl': ['8rem', { lineHeight: '1' }],
};

// 🚀 Animation System
const animations = {
  'quantum-pulse': 'quantumPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'quantum-bounce': 'quantumBounce 1s infinite',
  'quantum-spin': 'quantumSpin 20s linear infinite',
  'quantum-float': 'quantumFloat 3s ease-in-out infinite',
  'quantum-glow': 'quantumGlow 2s ease-in-out infinite',
  'quantum-shift': 'quantumShift 15s ease-in-out infinite',
  'quantum-wave': 'quantumWave 10s linear infinite',
  'quantum-ripple': 'quantumRipple 2s ease-out infinite',
};

// 🎨 Advanced Gradients
const gradients = {
  'quantum-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 50%, #ec4899 100%)',
  'keystone-gradient': 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
  'aetherius-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  'cosmic-gradient': 'radial-gradient(circle at 20% 50%, #0ea5e9 0%, #7c3aed 50%, #ec4899 100%)',
  'neural-gradient': 'linear-gradient(45deg, #0ea5e9 25%, #7c3aed 25%, #7c3aed 50%, #ec4899 50%, #ec4899 75%, #facc15 75%)',
  'quantum-mesh': 'radial-gradient(circle at 80% 50%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 20% 80%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 80%, #ec4899 0%, transparent 50%), radial-gradient(circle at 20% 20%, #facc15 0%, transparent 50%)',
};

// 🧠 Advanced Shadows
const shadows = {
  'quantum-sm': '0 1px 2px 0 rgba(14, 165, 233, 0.05)',
  'quantum': '0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -2px rgba(14, 165, 233, 0.1)',
  'quantum-md': '0 10px 15px -3px rgba(14, 165, 233, 0.1), 0 4px 6px -4px rgba(14, 165, 233, 0.1)',
  'quantum-lg': '0 20px 25px -5px rgba(14, 165, 233, 0.1), 0 8px 10px -6px rgba(14, 165, 233, 0.1)',
  'quantum-xl': '0 25px 50px -12px rgba(14, 165, 233, 0.25)',
  'quantum-2xl': '0 50px 100px -20px rgba(14, 165, 233, 0.25)',
  'quantum-inner': 'inset 0 2px 4px 0 rgba(14, 165, 233, 0.05)',
  'quantum-glow': '0 0 20px rgba(14, 165, 233, 0.3)',
  'keystone-sm': '0 1px 2px 0 rgba(234, 179, 8, 0.05)',
  'keystone': '0 4px 6px -1px rgba(234, 179, 8, 0.1), 0 2px 4px -2px rgba(234, 179, 8, 0.1)',
  'keystone-md': '0 10px 15px -3px rgba(234, 179, 8, 0.1), 0 4px 6px -4px rgba(234, 179, 8, 0.1)',
  'keystone-lg': '0 20px 25px -5px rgba(234, 179, 8, 0.1), 0 8px 10px -6px rgba(234, 179, 8, 0.1)',
  'keystone-xl': '0 25px 50px -12px rgba(234, 179, 8, 0.25)',
  'keystone-2xl': '0 50px 100px -20px rgba(234, 179, 8, 0.25)',
  'keystone-inner': 'inset 0 2px 4px 0 rgba(234, 179, 8, 0.05)',
  'keystone-glow': '0 0 20px rgba(234, 179, 8, 0.3)',
};

// 🚀 Advanced Spacing Scale
const spacing = {
  'quantum-xs': '0.25rem',
  'quantum-sm': '0.5rem',
  'quantum-md': '1rem',
  'quantum-lg': '1.5rem',
  'quantum-xl': '2rem',
  'quantum-2xl': '3rem',
  'quantum-3xl': '4rem',
  'quantum-4xl': '6rem',
  'quantum-5xl': '8rem',
  'quantum-6xl': '10rem',
  'quantum-7xl': '12rem',
  'quantum-8xl': '16rem',
  'quantum-9xl': '20rem',
};

// 🎯 Advanced Border Radius
const borderRadius = {
  'quantum-sm': '0.125rem',
  'quantum': '0.25rem',
  'quantum-md': '0.375rem',
  'quantum-lg': '0.5rem',
  'quantum-xl': '0.75rem',
  'quantum-2xl': '1rem',
  'quantum-3xl': '1.5rem',
  'quantum-4xl': '2rem',
  'quantum-full': '9999px',
};

// 🧠 Configuration Object
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // 🚀 Advanced Theme Configuration
  theme: {
    extend: {
      colors: {
        ...quantumColors,
        transparent: 'transparent',
        current: 'currentColor',
      },
      
      fontFamily: {
        'quantum': ['Inter', 'system-ui', 'sans-serif'],
        'keystone': ['JetBrains Mono', 'monospace'],
        'aetherius': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      
      fontSize: typographyScale,
      
      animation: animations,
      
      backgroundImage: {
        ...gradients,
        'quantum-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%230ea5e9\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'keystone-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23eab308\" fill-opacity=\"0.1\"%3E%3Crect x=\"20\" y=\"20\" width=\"20\" height=\"20\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      
      boxShadow: shadows,
      
      spacing: spacing,
      
      borderRadius: borderRadius,
      
      // 🚀 Advanced Effects
      backdropBlur: {
        'quantum': '12px',
        'keystone': '8px',
      },
      
      // 🎯 Advanced Transitions
      transitionProperty: {
        'quantum': 'all',
        'quantum-colors': 'color, background-color, border-color',
        'quantum-opacity': 'opacity',
        'quantum-shadow': 'box-shadow',
        'quantum-transform': 'transform',
      },
      
      transitionDuration: {
        'quantum-fast': '150ms',
        'quantum-normal': '300ms',
        'quantum-slow': '500ms',
        'quantum-slower': '700ms',
      },
      
      transitionTimingFunction: {
        'quantum-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'quantum-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'quantum-ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'quantum-ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'quantum-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'quantum-elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      
      // 🧠 Advanced Grid System
      gridTemplateColumns: {
        'quantum-13': 'repeat(13, minmax(0, 1fr))',
        'quantum-16': 'repeat(16, minmax(0, 1fr))',
        'quantum-24': 'repeat(24, minmax(0, 1fr))',
      },
      
      // 🎯 Advanced Aspect Ratios
      aspectRatio: {
        'quantum-golden': '1.618',
        'quantum-silver': '2.414',
        'quantum-platinum': '1.414',
        'quantum-copper': '4.236',
      },
      
      // 🚀 Advanced Z-Index Scale
      zIndex: {
        'quantum-behind': '-1',
        'quantum-default': '0',
        'quantum-dropdown': '10',
        'quantum-sticky': '20',
        'quantum-modal': '30',
        'quantum-popover': '40',
        'quantum-tooltip': '50',
        'quantum-toast': '60',
        'quantum-notification': '70',
        'quantum-maximum': '9999',
      },
    },
  },
  
  // 🎨 Advanced Plugins
  plugins: [
    // 🚀 Container Queries
    require('@tailwindcss/container-queries'),
    
    // 🎯 Typography Plugin
    require('@tailwindcss/typography'),
    
    // 🧠 Custom Plugin for Quantum Effects
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.quantum-glow': {
          boxShadow: `0 0 20px ${theme('colors.quantum.500')}`,
          transition: 'all 0.3s ease',
        },
        '.quantum-glow:hover': {
          boxShadow: `0 0 30px ${theme('colors.quantum.600')}`,
        },
        '.keystone-glow': {
          boxShadow: `0 0 20px ${theme('colors.keystone.500')}`,
          transition: 'all 0.3s ease',
        },
        '.keystone-glow:hover': {
          boxShadow: `0 0 30px ${theme('colors.keystone.600')}`,
        },
        '.quantum-text-gradient': {
          background: theme('backgroundImage.quantum-gradient'),
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.keystone-text-gradient': {
          background: theme('backgroundImage.keystone-gradient'),
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.quantum-blur': {
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        },
        '.quantum-glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.quantum-neon': {
          textShadow: `0 0 10px ${theme('colors.quantum.500')}, 0 0 20px ${theme('colors.quantum.600')}, 0 0 30px ${theme('colors.quantum.700')}`,
        },
        '.keystone-neon': {
          textShadow: `0 0 10px ${theme('colors.keystone.500')}, 0 0 20px ${theme('colors.keystone.600')}, 0 0 30px ${theme('colors.keystone.700')}`,
        },
      };
      
      addUtilities(newUtilities);
    },
    
    // 🚀 Custom Plugin for Animation Keyframes
    function({ addBase }) {
      addBase({
        '@keyframes quantumPulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        '@keyframes quantumBounce': {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        '@keyframes quantumSpin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        '@keyframes quantumFloat': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        '@keyframes quantumGlow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.6)' },
        },
        '@keyframes quantumShift': {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(10px)' },
        },
        '@keyframes quantumWave': {
          '0%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(10px) translateY(-10px)' },
          '50%': { transform: 'translateX(0px) translateY(-20px)' },
          '75%': { transform: 'translateX(-10px) translateY(-10px)' },
          '100%': { transform: 'translateX(0px) translateY(0px)' },
        },
        '@keyframes quantumRipple': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      });
    },
  ],
  
  // 🎯 Advanced Presets
  presets: [
    // 🚀 Quantum Preset
    {
      name: 'quantum',
      theme: {
        extend: {
          colors: quantumColors,
          animation: animations,
          backgroundImage: gradients,
          boxShadow: shadows,
        },
      },
    },
  ],
  
  // 🧠 Advanced Configuration
  darkMode: 'class',
  prefix: '',
  important: false,
  
  // 🚀 Performance Optimizations
  corePlugins: {
    preflight: true,
    container: true,
    space: true,
    divide: true,
    aspectRatio: true,
    animation: true,
    background: true,
    backgroundImage: true,
    borderOpacity: true,
    borders: true,
    boxShadow: true,
    boxSizing: true,
    clear: true,
    cursor: true,
    display: true,
    fill: true,
    flex: true,
    fontFamily: true,
    fontSize: true,
    fontWeight: true,
    gap: true,
    gradientColorStops: true,
    gridAutoColumns: true,
    gridAutoFlow: true,
    gridAutoRows: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnStart: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowStart: true,
    gridTemplateColumns: true,
    gridTemplateRows: true,
    height: true,
    inset: true,
    justifyContent: true,
    justifyItems: true,
    justifySelf: true,
    letterSpacing: true,
    lineHeight: true,
    listStylePosition: true,
    listStyleType: true,
    margin: true,
    maxHeight: true,
    maxWidth: true,
    minHeight: true,
    minWidth: true,
    objectFit: true,
    objectPosition: true,
    opacity: true,
    order: true,
    outline: true,
    overflow: true,
    padding: true,
    placeContent: true,
    placeItems: true,
    placeSelf: true,
    placeholderColor: true,
    placeholderOpacity: true,
    position: true,
    replace: true,
    ringColor: true,
    ringOffsetColor: true,
    ringOffsetWidth: true,
    ringOpacity: true,
    ringWidth: true,
    rotate: true,
    scale: true,
    skew: true,
    space: true,
    stroke: true,
    strokeWidth: true,
    textAlign: true,
    textColor: true,
    textDecoration: true,
    textOpacity: true,
    textTransform: true,
    transform: true,
    translate: true,
    transitionDelay: true,
    transitionDuration: true,
    transitionProperty: true,
    transitionTimingFunction: true,
    userSelect: true,
    verticalAlign: true,
    visibility: true,
    whitespace: true,
    width: true,
    wordBreak: true,
    zIndex: true,
  },
};

export default config;