import { DATA_ATTR_NAME } from '../src/style.mjs';

export const doc = document;

export const { head, body, documentElement } = doc;

export const createElement = tagName => doc.createElement(tagName);

export const createDiv = () => createElement('div');

export const getCSSVariableValue = (element, variableName) => window.getComputedStyle(element).getPropertyValue(variableName).trim();

export const dispatchCustomEvent = (element, eventName) => element.dispatchEvent(new CustomEvent(eventName));

export const isPadlockElement = element => element.matches(`[${DATA_ATTR_NAME}]`);
