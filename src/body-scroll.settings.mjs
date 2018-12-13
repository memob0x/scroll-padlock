import { status } from './body-scroll.status.mjs';

export let settings = {
    important: true,
    corrections: []
};

const defaultCorrection = {
    selector: null,
    property: 'margin-right',
    inverted: false
};

const supportedProperties = [
    'margin-right',
    'margin-bottom',
    'padding-right',
    'padding-bottom',
    'right',
    'bottom'
];

// TODO: put in setOptions
const setCorrections = (collection = []) => {
    let corrections = [];

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
                    ...defaultCorrection,
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
                    supportedProperties.indexOf(entry.property) > -1)
            ) {
                corrections.push({
                    ...defaultCorrection,
                    ...entry
                });
            }
        }
    });

    return corrections;
};

export const setOptions = (options = {}) => {
    if (!status) {
        settings = {
            ...settings,
            ...options
        };
        settings.corrections = setCorrections(settings.corrections);
    }
};
