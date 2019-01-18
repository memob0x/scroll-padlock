// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
(function(arr) {
    // TODO: babel should do this?
    arr.forEach(function(item) {
        if (item.hasOwnProperty('append')) {
            return;
        }
        Object.defineProperty(item, 'append', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function append() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function(argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(
                        isNode
                            ? argItem
                            : document.createTextNode(String(argItem))
                    );
                });

                this.appendChild(docFrag);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

const logEl = document.querySelector('#console');
export const log = (...message) => {
    console.log(...message);

    if (!logEl.hasChildNodes()) {
        const ol = document.createElement('ol');
        logEl.append(ol);
    }

    const list = logEl.querySelector('ol');
    const li = document.createElement('li');
    li.innerHTML = message;
    list.append(li);

    logEl.scrollTop = list.offsetHeight;
};
