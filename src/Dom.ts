import { arrify } from "./Util.js";

interface CreateElementOptions<T> {
  id?: string;
  /**
   * Style class(es) for the element. No whitespace allowed.
   */
  classes?: string | string[];
  /**
   * Child nodes for the HTML element
   */
  content?: (Node | string) | (Node | string)[];
  onClick?: () => void;
  /**
   * Ignored for non-input elements.
   */
  onChange?: (event: Event) => void;
  /**
   * Ignored for non-form elements.
   */
  onSubmit?: (event: Event) => void;
  /**
   * Callback function that is called just after the HTML element is created.
   */
  onCreate?: (element: T) => void;
  attributes?: Record<string, string>;
}

/**
 * Creates an HTML elements with the given parameters.
 * @param tag Tag for the HTML element.
 * @param options Options to set additional properties for the HTML element.
 * @returns HTML element configured according to the given parameters.
 */
export function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: CreateElementOptions<HTMLElementTagNameMap[K]> = {},
): HTMLElementTagNameMap[K] {
  const element: HTMLElementTagNameMap[K] = document.createElement(tag);
  const {
    id,
    classes,
    content,
    onClick,
    onChange,
    onSubmit,
    onCreate,
    attributes,
  } = options;

  if (content) {
    arrify(content)
      .map((x) => (typeof x === "string" ? document.createTextNode(x) : x))
      .forEach((x) => element.appendChild(x));
  }
  if (id) {
    element.setAttribute("id", id);
  }
  if (classes) {
    element.classList.add(...arrify(classes));
  }
  if (onClick) {
    element.addEventListener("click", onClick);
  }
  if (
    onChange &&
    (element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement)
  ) {
    element.addEventListener("change", onChange);
  }
  if (onSubmit && element instanceof HTMLFormElement) {
    element.addEventListener("submit", onSubmit);
  }
  if (attributes) {
    Object.entries(attributes).forEach(([k, v]) => element.setAttribute(k, v));
  }

  if (onCreate) {
    onCreate(element);
  }

  return element;
}
