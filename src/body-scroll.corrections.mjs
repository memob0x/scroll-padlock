import { state } from './body-scroll.state.mjs';

let corrections = [];

const defaults = {
    selector: null,
    property: 'margin-right',
    inverted: false
};

const supportedProperty = [
    'margin-right',
    'margin-bottom',
    'padding-right',
    'padding-bottom',
    'right',
    'bottom'
];

export const setCorrections = (collection = []) => {
    corrections = [];

    const collectionType = typeof collection;
    if (
        collectionType === 'string' ||
        (!Array.isArray(collection) && collectionType === 'object')
    ) {
        collection = [collection];
    }

    collection.forEach(entry => {
        if (entry) {
            const entryType = typeof entry;

            if (entryType === 'string') {
                corrections.push({
                    ...defaults,
                    ...{
                        selector: entry
                    }
                });
            }

            if (
                !Array.isArray(entry) &&
                entryType === 'object' &&
                entry.selector &&
                (!entry.property ||
                    supportedProperty.indexOf(entry.property) > -1)
            ) {
                corrections.push({
                    ...defaults,
                    ...entry
                });
            }
        }
    });
};

export const getCorrections = (inverted = false) => {
    let css = '';

    if (corrections.length) {
        corrections.forEach(entry => {
            const gap =
                state.scrollbars[
                    entry.property.indexOf('right') > -1 ? 'y' : 'x'
                ];

            if (gap > 0) {
                let factor = 1;

                if (inverted) {
                    factor = entry.inverted ? -1 : 0;
                }

                css += `
                ${entry.selector} {
                    ${entry.property}: ${gap * factor}px!important;
                }`;
            }
        });
    }

    return css;
};
