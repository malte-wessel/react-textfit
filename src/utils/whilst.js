function noop() {}

function restParam(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
        const length = Math.max(arguments.length - startIndex, 0);
        const rest = Array(length);
        for (let index = 0; index < length; index++) {
            rest[index] = arguments[index + startIndex];
        }
        switch (startIndex) {
            case 0: return func.call(this, rest);
            case 1: return func.call(this, arguments[0], rest);
        }
    };
}

export default function whilst(test, iterator, callback = noop) {
    if (test()) {
        var next = restParam(function(err, args) {
            if (err) {
                callback(err);
            } else if (test.apply(this, args)) {
                iterator(next);
            } else {
                callback(null);
            }
        });
        iterator(next);
    } else {
        callback(null);
    }
};
