export function IsNotNullNorUndefined(obj: any): boolean {
    "use strict";
    return typeof obj !== "undefined" && null !== obj;
}

export function IsNullOrUndefined(obj: any): boolean {
    "use strict";
    return typeof obj === "undefined" || null == obj;
}

export function GetObjectFromName(name: string, modulePath?: string): any {
    "use strict";
    var ctor = null;
    if (IsNotNullNorUndefined(modulePath) && modulePath.length > 0) {
        ctor = require(modulePath);
    }
    try {
        return getObject(name, ctor);
    } catch (error) {
        throw new Error(`resolve module=${modulePath} name=${name} error, reason=` + error.toStirng());
    }
}

function getObject(stringNotation: string, ctor: any = null): any {
    "use strict";
    let arrayNotation = stringNotation.split(".");
    let propObj = null;
    if (IsNullOrUndefined(ctor)) {
        propObj = global[arrayNotation[0]];
    } else {
        let rootObj = ctor;
        if (arrayNotation.length <= 1) {
            return rootObj;
        }
        propObj = rootObj[arrayNotation[1]];
        arrayNotation.shift();
    }

    if (IsNotNullNorUndefined(propObj)) {
        for (let i = 1; i < arrayNotation.length; i++) {
            let nextProp = propObj[arrayNotation[i]];
            if (IsNotNullNorUndefined(nextProp)) {
                propObj = nextProp;
            } else {
                throw new Error(`There's no ${arrayNotation[i]} property!`);
            }
        }
    }
    return propObj;
}