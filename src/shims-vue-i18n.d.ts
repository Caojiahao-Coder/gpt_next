/**
 * 让vue-i18n支持typescript
 */
declare module 'vue-i18n' {
  import VueI18n from "vue-i18n";
  export default VueI18n

  export {
    useI18n,
    createI18n,
    Locale
  }
}
