export const createIdAttrInDev = (dev: boolean, id: number) =>
  dev ? ` id="luban_${id}"` : '';

export const getElementByLuBanId = (id: number) =>
  typeof window !== undefined
    ? document.querySelector(`luban_${id}`) || null
    : () => new Error('in nodejs');

const lubanIdReg = /^\s*luban_(\d+)\s*$/;

export const getLuBanIdFromElement = (
  element: HTMLElement | null,
): number | null => {
  if (element) {
    const id = element.getAttribute('id');
    const match = lubanIdReg.exec(id || '');
    if (match) {
      return Number(match[1]);
    } else {
      return getLuBanIdFromElement(element.parentElement);
    }
  } else {
    return null;
  }
};
