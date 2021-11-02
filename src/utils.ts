function querySelectorAllAsList<Type extends Element>(
  selectorName: string
): Type[] {
  let result: Type[] = [];
  let nodeList = document.querySelectorAll<Type>(selectorName);
  for (let i = 0; i < nodeList.length; i++) {
    result.push(nodeList.item(i));
  }
  return result;
}

export { querySelectorAllAsList };
