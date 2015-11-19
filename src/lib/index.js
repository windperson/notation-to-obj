function IsNotNullNorUndefined(obj) {
    return typeof obj !== 'undefined' && null !== obj;
}
exports.IsNotNullNorUndefined = IsNotNullNorUndefined;
function IsNullOrUndefined(obj) {
    return typeof obj == 'undefined' || null == obj;
}
exports.IsNullOrUndefined = IsNullOrUndefined;
function GetObjectFromName(name, modulePath) {
    var ctor = null;
    if (IsNotNullNorUndefined(modulePath) && modulePath.length > 0) {
        ctor = require(modulePath);
    }
    try {
        return getObject(name, ctor);
    }
    catch (error) {
        throw new Error(("resolve module=" + modulePath + " name=" + name + " error, reason=") + error.toStirng());
    }
}
exports.GetObjectFromName = GetObjectFromName;
function getObject(stringNotation, ctor) {
    if (ctor === void 0) { ctor = null; }
    var arrayNotation = stringNotation.split('.');
    var propObj = null;
    if (IsNullOrUndefined(ctor)) {
        propObj = global[arrayNotation[0]];
    }
    else {
        var rootObj = ctor;
        if (arrayNotation.length <= 1) {
            return rootObj;
        }
        propObj = rootObj[arrayNotation[1]];
        arrayNotation.shift();
    }
    if (IsNotNullNorUndefined(propObj)) {
        for (var i = 1; i < arrayNotation.length; i++) {
            var nextProp = propObj[arrayNotation[i]];
            if (IsNotNullNorUndefined(nextProp)) {
                propObj = nextProp;
            }
            else {
                throw new Error("There's no " + arrayNotation[i] + " property!");
            }
        }
    }
    return propObj;
}
//# sourceMappingURL=index.js.map