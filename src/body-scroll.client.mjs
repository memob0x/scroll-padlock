export const html = document.documentElement;
export const body = document.body || document.getElementsByTagName('body')[0];
export const head = document.head || document.getElementsByTagName('head')[0];

const stylesIncubator = document.createElement('style');
stylesIncubator.type = 'text/css';
export const styler = stylesIncubator;
