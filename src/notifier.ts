let currentTimeout: number | null = null;

function notify(text: string, isAutoDisappear: boolean): void {
  if (currentTimeout != null) clearTimeout(currentTimeout);
  showNotifyText(text)
  if (isAutoDisappear)
    currentTimeout = setTimeout(() => {
      removeNotifyText()
    })
}

function showNotifyText(text: string): void {
  document.querySelector('#notify-text')!.innerHTML = text
}

function removeNotifyText(): void {
  document.querySelector('#notify-text')!.innerHTML = ""
}

export { notify, removeNotifyText }