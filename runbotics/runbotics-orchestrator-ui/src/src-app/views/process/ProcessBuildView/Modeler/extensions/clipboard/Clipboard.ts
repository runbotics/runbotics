export default function Clipboard() { }

Clipboard.prototype.get = function () {
    return ClipboardStorage.get();
};

Clipboard.prototype.set = function (data) {
    ClipboardStorage.set(data);
};

Clipboard.prototype.clear = function () {
    const { data } = this;

    delete this.data;

    return data;
};

Clipboard.prototype.isEmpty = function () {
    return !ClipboardStorage.get();
};

class ClipboardStorage {
    static data: any;

    static set = (data) => {
        ClipboardStorage.data = data;
    };

    static get = () => ClipboardStorage.data;

    static delete = () => {
        delete ClipboardStorage.data;
    };
}
