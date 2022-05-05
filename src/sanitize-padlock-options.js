import {
  STR_CAMEL_CSS_CLASS_NAME, STR_WORD_STRING, STR_WORD_UNDEFINED,
} from './constants';

const INT_OPTIONS_TYPE_KEY_UNKNOWN = 0;
const INT_OPTIONS_TYPE_KEY_UNDEFINED = 1;
const INT_OPTIONS_TYPE_KEY_OBJECT = 3;
const INT_OPTIONS_TYPE_KEY_STRING = 4;

const { isArray } = Array;

const getOptionsTypeKey = (options) => {
  const type = typeof options;

  if (type === STR_WORD_UNDEFINED) {
    return INT_OPTIONS_TYPE_KEY_UNDEFINED;
  }

  if (type === STR_WORD_STRING) {
    return INT_OPTIONS_TYPE_KEY_STRING;
  }

  if (isArray(options)) {
    return INT_OPTIONS_TYPE_KEY_UNKNOWN;
  }

  if (type === 'object') {
    return INT_OPTIONS_TYPE_KEY_OBJECT;
  }

  return INT_OPTIONS_TYPE_KEY_UNKNOWN;
};

const sanitizePadlockOptions = (options) => {
  //
  const optionsTypeKey = getOptionsTypeKey(options);

  // No class name, nothing to do, but throwing an exception
  if (optionsTypeKey === INT_OPTIONS_TYPE_KEY_UNKNOWN) {
    throw new TypeError(`Invalid "options" argument (${options}) provided to ScrollPadlock constructor`);
  }

  //
  const optionsObject = !!options && optionsTypeKey === INT_OPTIONS_TYPE_KEY_OBJECT
    ? options
    : {};

  //
  const cssClassName = optionsTypeKey === INT_OPTIONS_TYPE_KEY_STRING
    ? options
    : optionsObject[STR_CAMEL_CSS_CLASS_NAME];

  const type = typeof cssClassName;

  //
  const isCssClassNameTruthyString = !!cssClassName && type === STR_WORD_STRING;

  // No class name, nothing to do, but throwing an exception
  if (
    // if is defined (because undefined is allowed)...
    type !== STR_WORD_UNDEFINED

    // ...and is an invalid argument
    && !isCssClassNameTruthyString
  ) {
    throw new TypeError('Invalid CSS class name provided to constructor');
  }

  //
  optionsObject[STR_CAMEL_CSS_CLASS_NAME] = cssClassName;

  //
  return optionsObject;
};

export default sanitizePadlockOptions;
