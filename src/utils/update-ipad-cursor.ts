import { updateCursor } from 'ipad-cursor'

const ipadCursortPlugin = {
  install: (app: any) => {
    const handleDOMChange = () => {
      updateCursor()
    }

    handleDOMChange()

    app.mixin({
      updated() {
        handleDOMChange()
      },
    })
  },
}

export {
  ipadCursortPlugin,
}
