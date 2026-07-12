import { ref } from 'vue'

interface ConfirmOptions {
  title?: string
  message?: string
  icon?: string
  iconBg?: string
  iconColor?: string
  confirmText?: string
  cancelText?: string
  confirmBg?: string
  danger?: boolean
}

const visible = ref(false)
const options = ref<ConfirmOptions>({})
let resolvePromise: ((value: boolean) => void) | null = null

export function useConfirm() {
  function confirm(opts: ConfirmOptions): Promise<boolean> {
    options.value = { ...opts }
    visible.value = true
    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function onConfirm() {
    visible.value = false
    resolvePromise?.(true)
    resolvePromise = null
  }

  function onCancel() {
    visible.value = false
    resolvePromise?.(false)
    resolvePromise = null
  }

  return { visible, options, confirm, onConfirm, onCancel }
}
