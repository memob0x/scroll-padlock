import { html, body } from './client.mjs';

/**
 * Checks whether a given value is a valid number or not
 * @param {any} value The given value to be checked
 * @returns {Boolean} True if the given value is a number
 */
export const isNumber = value => typeof value === 'number' && !isNaN(value) && isFinite(value);

/**
 * Checks whether the given element is a main scrollable element (html or body)
 * @param {HTMLElement} element The given element to be checked
 * @returns {Boolean} True if element is a global frame element
 */
export const isGlobalScroller = element => element === html || element === body;
