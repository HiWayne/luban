const convertWidth = (width?: string | number) => {
  if (typeof width === 'string') {
    if (isNaN(Number(width))) {
      return width;
    } else {
      return width + 'px';
    }
  } else if (typeof width === 'number') {
    return width + 'px';
  } else {
    return width;
  }
};

export default convertWidth;
