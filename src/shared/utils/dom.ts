export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  content?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.textContent = content;
  return element;
}

export function createList(items: string[], className = 'content-list'): HTMLUListElement {
  const ul = document.createElement('ul');
  ul.className = className;
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
  return ul;
}

export function qs<K extends keyof HTMLElementTagNameMap>(
  selector: string,
  parent: ParentNode = document
): HTMLElementTagNameMap[K] | null {
  return parent.querySelector(selector);
}

export function qsa<K extends keyof HTMLElementTagNameMap>(
  selector: string,
  parent: ParentNode = document
): NodeListOf<HTMLElementTagNameMap[K]> {
  return parent.querySelectorAll(selector);
}
