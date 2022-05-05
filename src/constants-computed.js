import {
  STR_CHAR_HYPHEN,
  STR_WORD_CAP_HEIGHT,
  STR_WORD_CAP_LEFT,
  STR_WORD_CAP_TOP,
  STR_WORD_CAP_WIDTH,
  STR_WORD_CLIENT,
  STR_WORD_INNER,
  STR_WORD_OUTER,
  STR_WORD_SCROLL,
} from './constants';

export const STR_WORD_TOP = STR_WORD_CAP_TOP.toLowerCase();
export const STR_WORD_LEFT = STR_WORD_CAP_LEFT.toLowerCase();
export const STR_WORD_WIDTH = STR_WORD_CAP_WIDTH.toLowerCase();
export const STR_WORD_HEIGHT = STR_WORD_CAP_HEIGHT.toLowerCase();

export const STR_KEBAB_SCROLL_PADLOCK = `${STR_WORD_SCROLL + STR_CHAR_HYPHEN}padlock`;
export const STR_KEBAB_DATA_SCROLL_PADLOCK = `data${STR_CHAR_HYPHEN}${STR_KEBAB_SCROLL_PADLOCK}`;

const STR_WORD_SCROLLBAR = `${STR_WORD_SCROLL}bar`;

export const STR_CAMEL_CLIENT_WIDTH = STR_WORD_CLIENT + STR_WORD_CAP_WIDTH;
export const STR_CAMEL_CLIENT_HEIGHT = STR_WORD_CLIENT + STR_WORD_CAP_HEIGHT;
export const STR_CAMEL_OUTER_WIDTH = STR_WORD_OUTER + STR_WORD_CAP_WIDTH;
export const STR_CAMEL_OUTER_HEIGHT = STR_WORD_OUTER + STR_WORD_CAP_HEIGHT;
export const STR_CAMEL_INNER_WIDTH = STR_WORD_INNER + STR_WORD_CAP_WIDTH;
export const STR_CAMEL_INNER_HEIGHT = STR_WORD_INNER + STR_WORD_CAP_HEIGHT;
export const STR_CAMEL_SCROLL_WIDTH = STR_WORD_SCROLL + STR_WORD_CAP_WIDTH;
export const STR_CAMEL_SCROLL_HEIGHT = STR_WORD_SCROLL + STR_WORD_CAP_HEIGHT;
export const STR_CAMEL_SCROLLBAR_WIDTH = STR_WORD_SCROLLBAR + STR_WORD_CAP_WIDTH;
export const STR_CAMEL_SCROLLBAR_HEIGHT = STR_WORD_SCROLLBAR + STR_WORD_CAP_HEIGHT;

const cssVarPrefix = STR_CHAR_HYPHEN + STR_CHAR_HYPHEN;

export const STR_KEBAB_DOUBLE_HYPHEN_PREFIX_POSITION_TOP = cssVarPrefix
  + STR_KEBAB_SCROLL_PADLOCK
  + STR_CHAR_HYPHEN
  + STR_WORD_SCROLL
  + STR_CHAR_HYPHEN
  + STR_WORD_TOP;

export const STR_KEBAB_DOUBLE_HYPHEN_PREFIX_POSITION_LEFT = cssVarPrefix
  + STR_KEBAB_SCROLL_PADLOCK
  + STR_CHAR_HYPHEN
  + STR_WORD_SCROLL
  + STR_CHAR_HYPHEN
  + STR_WORD_LEFT;

export const STR_KEBAB_DOUBLE_HYPHEN_PREFIX_SCROLLBAR_WIDTH = cssVarPrefix
  + STR_KEBAB_SCROLL_PADLOCK
  + STR_CHAR_HYPHEN
  + STR_WORD_SCROLLBAR
  + STR_CHAR_HYPHEN
  + STR_WORD_WIDTH;

export const STR_KEBAB_DOUBLE_HYPHEN_PREFIX_SCROLLBAR_HEIGHT = cssVarPrefix
  + STR_KEBAB_SCROLL_PADLOCK
  + STR_CHAR_HYPHEN
  + STR_WORD_SCROLLBAR
  + STR_CHAR_HYPHEN
  + STR_WORD_HEIGHT;

export const STR_KEBAB_DOUBLE_HYPHEN_PREFIX_OUTER_WIDTH = cssVarPrefix
  + STR_KEBAB_SCROLL_PADLOCK
  + STR_CHAR_HYPHEN
  + STR_WORD_OUTER
  + STR_CHAR_HYPHEN
  + STR_WORD_WIDTH;

export const STR_KEBAB_DOUBLE_HYPHEN_PREFIX_OUTER_HEIGHT = cssVarPrefix
  + STR_KEBAB_SCROLL_PADLOCK
  + STR_CHAR_HYPHEN
  + STR_WORD_OUTER
  + STR_CHAR_HYPHEN
  + STR_WORD_HEIGHT;

export const STR_KEBAB_DOUBLE_HYPHEN_PREFIX_INNER_WIDTH = cssVarPrefix
  + STR_KEBAB_SCROLL_PADLOCK
  + STR_CHAR_HYPHEN
  + STR_WORD_INNER
  + STR_CHAR_HYPHEN
  + STR_WORD_WIDTH;

export const STR_KEBAB_DOUBLE_HYPHEN_PREFIX_INNER_HEIGHT = cssVarPrefix
  + STR_KEBAB_SCROLL_PADLOCK
  + STR_CHAR_HYPHEN
  + STR_WORD_INNER
  + STR_CHAR_HYPHEN
  + STR_WORD_HEIGHT;

export const STR_KEBAB_DOUBLE_HYPHEN_PREFIX_SCROLL_WIDTH = cssVarPrefix
  + STR_KEBAB_SCROLL_PADLOCK
  + STR_CHAR_HYPHEN
  + STR_WORD_SCROLL
  + STR_CHAR_HYPHEN
  + STR_WORD_WIDTH;

export const STR_KEBAB_DOUBLE_HYPHEN_PREFIX_SCROLL_HEIGHT = cssVarPrefix
  + STR_KEBAB_SCROLL_PADLOCK
  + STR_CHAR_HYPHEN
  + STR_WORD_SCROLL
  + STR_CHAR_HYPHEN
  + STR_WORD_HEIGHT;
