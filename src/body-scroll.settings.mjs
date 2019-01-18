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

const setCorrections = (collection = []) => {
    let corrections = [];
    const collectionType = typeof collection;

    // prettier-ignore
    if ( collectionType === 'string' || ( !Array.isArray(collection) && collectionType === 'object' ) ) {
        collection = [collection];
    }

    collection.forEach(entry => {
        if (entry) {
            const entryType = typeof entry;

            if (entryType === 'string') {
                // prettier-ignore
                corrections.push({ ...defaultCorrection, ...{ selector: entry } });
            }

            // prettier-ignore
            if (
                !Array.isArray(entry) && entryType === 'object' &&
                entry.selector &&
                entry.selector !== 'body' &&
                entry.selector !== 'html' && (
                    !entry.property || supportedProperties.indexOf(entry.property) > -1
                )
            ) {
                corrections.push({ ...defaultCorrection, ...entry });
            }
        }
    });

    return corrections;
};

export const setSettings = (options = {}) => {
    settings = {
        ...settings,
        ...options
    };

    settings.corrections = setCorrections(settings.corrections);
};
