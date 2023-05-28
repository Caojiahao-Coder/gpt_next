// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  shortcuts: {
    'border-base': 'border-gray-200 dark:border-dark-200',
    'border-dark-only': 'border-transparent dark:border-dark-100',
    'bg-base': 'bg-white dark:bg-#050505',
    'bg-body': 'bg-#f1f1f1 dark:bg-#121212',
    'color-base': 'text-#333 dark:text-gray-300',
    'color-fade': 'text-gray-900:50 dark:text-gray-300:50',
    'shadow': 'shadow dark:shadow-#333',
    'icon-button': 'op50 hover:op100 my-auto transition-all',
    'border': 'b-1 b-solid b-rd-1 border-base',
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  theme: {
    colors: {
      primary: 'var(--theme-color)',
      dark: {
        100: '#222',
        200: '#333',
        300: '#444',
        400: '#555',
        500: '#666',
        600: '#777',
        700: '#888',
        800: '#999',
        900: '#aaa',
      },
    },
  },
})
