export let scrollbarGapSelectors = [];
const defaults = {
    selector: null,
    property: 'margin-right'
};
export const registerScrollbarGapSelectors = (collection = []) => {
    const collectionType = typeof collection;
    if (collectionType === 'string' || (!Array.isArray(collection) && collectionType === 'object')) {
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
                    (entry.property === 'margin-right' || entry.property === 'margin-bottom' || entry.property === 'padding-right' || entry.property === 'padding-bottom'))
            ) {
                scrollbarGapSelectors.push({
                    ...defaults,
                    ...entry
                });
            }
        }
    });
};
