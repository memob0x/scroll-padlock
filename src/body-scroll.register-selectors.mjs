export let scrollbarGapSelectors = [];

const defaults = {
    selector: null,
    property: 'margin-right'
};

const supportedProperty = [
    'margin-right',
    'margin-bottom',
    'padding-right',
    'padding-bottom',
    'right',
    'bottom'
];

export const registerScrollbarGapSelectors = (collection = []) => {
    scrollbarGapSelectors = [];

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
                scrollbarGapSelectors.push({
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
                scrollbarGapSelectors.push({
                    ...defaults,
                    ...entry
                });
            }
        }
    });
};
