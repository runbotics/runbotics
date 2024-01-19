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

        if (typeof object === 'object' && typeof object.$type === 'string') {

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


const localStorageCopy = {
    __init__: [ 'localStorageCopy' ],
    localStorageCopy: [ 'type', function(
        keyboard, eventBus,
        moddle, clipboard
    ) {

        // persist into local storage whenever
        // copy took place
        eventBus.on('copyPaste.elementsCopied', event => {
            const { tree } = event;

            // persist in local storage, encoded as json
            localStorage.setItem('bpmnClipboard', JSON.stringify(tree));
        });

        // intercept global paste keybindings and
        // inject reified pasted stack
        keyboard.addListener(2000, event => {
            // retrieve from local storage
            const serializedCopy = localStorage.getItem('bpmnClipboard');

            if (!serializedCopy) {
                return;
            }

            // parse tree, reinstantiating contained objects
            const parsedCopy = JSON.parse(serializedCopy, createReviver(moddle));

            // put into clipboard
            clipboard.set(parsedCopy);
        });
    } ]
};

export default localStorageCopy;
