import upperFirst from 'lodash/upperFirst';

export const strOnlyChars = str => {
  if (typeof str === 'string') {
    return str.replace(/[\W_]+/g, ' ').trim();
  }
};

export const tease = desc => {
  let d = upperFirst(desc.replace(/[\W_]+/g, ' ').trim() + '.');

  if (desc.length > 250) {
    return d.slice(0, 250) + '...';
  }

  return d;
};
