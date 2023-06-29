import { createI18n } from 'vue-i18n'
import type { Locale } from 'vue-i18n'
import en from '../locales/en'
import zhCN from '../locales/zh-CN'

type MessageSchema = typeof en

/**
 * 创建i18N多语言对象
 */
const i18n = createI18n<[MessageSchema], 'en' | 'zhCN'>({
  legacy: false,
  locale: window.localStorage.getItem('lang') ?? 'en',
  messages: {
    en,
    zhCN,
  },
})

/**
 * 设置当前语言
 * @param lang 当前语言
 * @returns
 */
export function setI18nLanguage(lang: Locale) {
  window.localStorage.setItem('lang', lang)
  i18n.global.locale.value = lang as any
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export { i18n }
