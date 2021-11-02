function querySelectorAllAsList(selectorName) {
    let result = [];
    let nodeList = document.querySelectorAll(selectorName);
    for (let i = 0; i < nodeList.length; i++) {
        result.push(nodeList.item(i));
    }
    return result;
}
export { querySelectorAllAsList };
