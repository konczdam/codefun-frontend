import { isEmpty, isNumber, isNaN } from 'lodash';

export function replaceLineBreakWithBreak(text) {
  return text?.replaceAll(/\n/g, '<br />');
}

export function isBlank(value) {
  // eslint-disable-next-line no-mixed-operators
  return isEmpty(value) && !isNumber(value) || isNaN(value);
}
