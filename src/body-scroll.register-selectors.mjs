export let scrollbarCompensations = [];
export const registerSelectors = (collection = []) =>
    (scrollbarCompensations = collection.filter(
        x => x.property === 'margin-right' || x.property === 'margin-bottom' || x.property === 'padding-right' || x.property === 'padding-bottom'
    ));
