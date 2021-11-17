const GRID_TOTAL = 24;
const CLIENT_WIDTH = typeof document !== 'undefined' ? document.body.clientWidth : 1920;

export const convertRelativeToAbsolute = (relative?: number) => {
  if (typeof relative === 'number') {
    const ratio = relative / GRID_TOTAL;
    const absolute = ratio * CLIENT_WIDTH;
    return absolute + 'px';
  }
};

export const convertAbsoluteToRelative = (absolute?: number) => {
  if (typeof absolute === 'number') {
    const ratio = absolute / CLIENT_WIDTH;
    const relative = Math.round(ratio * GRID_TOTAL);
    return relative;
  }
};
