let currentTimeout = null;
function notify(text, isAutoDisappear) {
    if (currentTimeout != null)
        clearTimeout(currentTimeout);
    showNotifyText(text);
    if (isAutoDisappear)
        currentTimeout = setTimeout(() => {
            removeNotifyText();
        });
}
function showNotifyText(text) {
    document.querySelector('#notify-text').innerHTML = text;
}
function removeNotifyText() {
    document.querySelector('#notify-text').innerHTML = "";
}
export { notify, removeNotifyText };
