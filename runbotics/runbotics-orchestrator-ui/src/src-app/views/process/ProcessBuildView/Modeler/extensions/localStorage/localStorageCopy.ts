/**
 * A factory function that returns a reviver to be
 * used with JSON#parse to reinstantiate moddle instances.
 *
 * @param  {Moddle} moddle
 *
 * @return {Function}
 */
function createReviver(moddle) {

    const elCache = {};

    /**
     * The actual reviewer that creates model instances
     * for elements with a $type attribute.
     *
     * Elements with ids will be re-used, if already
     * created.
     *
     * @param  {String} key
     * @param  {Object} object
     *
     * @return {Object} actual element
     */
    return function (key, object) {

        if (
            object !== null &&
            object !== undefined &&
            typeof object === 'object' &&
            typeof object.$type === 'string'
        ) {

            const objectId = object.id;

            if (objectId && elCache[objectId]) {
                return elCache[objectId];
            }

            const type = object.$type;
            const attrs = { ...object };

            delete attrs.$type;
            const newEl = moddle.create(type, attrs);

            if (objectId) {
                elCache[objectId] = newEl;
            }

            return newEl;
        }

        return object;
    };
};

function localStorageCopy(
    keyboard, eventBus,
    moddle, clipboard
) {
    // persist into local storage whenever
    // copy took place
    eventBus.on('copyPaste.elementsCopied', event => {
        const { tree } = event;

        // persist in local storage, encoded as json
        localStorage.setItem('bpmn_clipboard', JSON.stringify(tree));
    });

    // intercept global paste keybindings and
    // inject reified pasted stack
    keyboard.addListener(2000, _ => {
        // retrieve from local storage
        const serializedCopy = localStorage.getItem('bpmn_clipboard');

        if (!serializedCopy) {
            return;
        }

        // parse tree, reinstantiating contained objects
        const parsedCopy = JSON.parse(serializedCopy, createReviver(moddle));

        // put into clipboard
        clipboard.set(parsedCopy);
    });
}

localStorageCopy.$inject = ['keyboard', 'eventBus', 'moddle', 'clipboard'];

export default localStorageCopy;
