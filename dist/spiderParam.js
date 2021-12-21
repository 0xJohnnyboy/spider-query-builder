"use strict";
/*
 * Copyright (c) 2021 Théo Lambert
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpiderDateOperator = exports.SpiderRangeOperator = exports.SpiderSortValue = exports.SpiderOperator = exports.SpiderPageSizeParam = exports.SpiderPageIdxParam = exports.SpiderSortParam = exports.SpiderRangeParam = exports.SpiderDateParam = exports.SpiderSearchParam = exports.SpiderExistsParam = exports.SpiderParam = void 0;
/**
 * SpiderParam Abstract Class
 * You should extend this for your custom purposes.
 * The SpiderQueryBuilder expects SpiderParamInterface[] as a parameter, though.
 * This means you can create your own abstract implementation.
 */
class SpiderParam {
    /**
     * SpiderParam base constructor
     * @param property string
     * @param operator SpiderOperator | SpiderRangeOperator | SpiderDateOperator
     * @param value any
     * @protected
     */
    constructor(property, operator, value) {
        this._property = property;
        this._operator = operator;
        this._value = value;
    }
    get query() {
        return this._query;
    }
    set query(value) {
        this._query = value;
    }
    get operator() {
        return this._operator;
    }
}
exports.SpiderParam = SpiderParam;
class SpiderExistsParam extends SpiderParam {
    /**
     * @param property string
     * @param value boolean
     */
    constructor(property, value) {
        super(property, SpiderOperator.exists, value);
        this.query = `${this.operator}[${property}]=${value.toString()}`;
    }
}
exports.SpiderExistsParam = SpiderExistsParam;
class SpiderSearchParam extends SpiderParam {
    /**
     * @param property string
     * @param value string
     */
    constructor(property, value) {
        super(property, SpiderOperator.equals, value);
        if (!Array.isArray(value)) {
            this.query = `${property}${this.operator}${value}`;
        }
        else {
            this.query = '';
            value.forEach((v, i) => {
                this.query += i !== (value.length - 1) ? `${property}[]${this.operator}${value[i]}&` : `${property}[]${this.operator}${value[i]}`;
            });
        }
    }
}
exports.SpiderSearchParam = SpiderSearchParam;
class SpiderDateParam extends SpiderParam {
    /**
     * The date will be formatted in YYYY-MM-DD format, implement a new SpiderParam if you need another formatting.
     * @param property string
     * @param operator SpiderDateOperator
     * @param value Date
     */
    constructor(property, operator, value) {
        super(property, operator, value);
        this.query = `${property}[${operator}]=${value.toISOString().slice(0, 10)}`; // date formatting like YYYY-MM-DD
    }
}
exports.SpiderDateParam = SpiderDateParam;
class SpiderRangeParam extends SpiderParam {
    /**
     * The secondValue parameter is required for the 'between' operator
     * @param property string
     * @param operator SpiderRangeOperator
     * @param value number
     * @param secondValue number // optional
     */
    constructor(property, operator, value, secondValue) {
        super(property, operator, value);
        this.query = !!secondValue && operator === SpiderRangeOperator.between ?
            `${property}[${operator}]=${value.toString()}..${secondValue.toString()}`
            : `${property}[${operator}]=${value.toString()}`;
    }
}
exports.SpiderRangeParam = SpiderRangeParam;
class SpiderSortParam extends SpiderParam {
    /**
     * @param property string
     * @param value SpiderSortValue
     */
    constructor(property, value) {
        super(property, SpiderOperator.sort, value);
        this.query = `${this.operator}[${property}]=${value}`;
    }
}
exports.SpiderSortParam = SpiderSortParam;
class SpiderPageIdxParam extends SpiderParam {
    /**
     * @param value number
     * @param property string ('page' by default)
     */
    constructor(value, property = 'page') {
        super(property, SpiderOperator.equals, value);
        this.query = `${property}${this.operator}${value.toString()}`;
    }
}
exports.SpiderPageIdxParam = SpiderPageIdxParam;
class SpiderPageSizeParam extends SpiderParam {
    /**
     * @param value number
     * @param property string, ('itemsPerPage' by default)
     */
    constructor(value, property = 'itemsPerPage') {
        super(property, SpiderOperator.equals, value);
        this.query = `${property}${this.operator}${value.toString()}`;
    }
}
exports.SpiderPageSizeParam = SpiderPageSizeParam;
/**
 * Base operators
 * @enum string
 */
var SpiderOperator;
(function (SpiderOperator) {
    SpiderOperator["exists"] = "exists";
    SpiderOperator["equals"] = "=";
    SpiderOperator["sort"] = "order";
})(SpiderOperator = exports.SpiderOperator || (exports.SpiderOperator = {}));
/**
 * Sort values
 * @enum string
 */
var SpiderSortValue;
(function (SpiderSortValue) {
    SpiderSortValue["asc"] = "asc";
    SpiderSortValue["desc"] = "desc";
})(SpiderSortValue = exports.SpiderSortValue || (exports.SpiderSortValue = {}));
/**
 * Range and comparison operators
 * @enum string
 */
var SpiderRangeOperator;
(function (SpiderRangeOperator) {
    SpiderRangeOperator["lt"] = "lt";
    SpiderRangeOperator["lte"] = "lte";
    SpiderRangeOperator["gt"] = "gt";
    SpiderRangeOperator["gte"] = "gte";
    SpiderRangeOperator["between"] = "between";
})(SpiderRangeOperator = exports.SpiderRangeOperator || (exports.SpiderRangeOperator = {}));
/**
 * Date comparison operators
 * @enum string
 */
var SpiderDateOperator;
(function (SpiderDateOperator) {
    SpiderDateOperator["after"] = "after";
    SpiderDateOperator["before"] = "before";
    SpiderDateOperator["strictlyAfter"] = "strictly_after";
    SpiderDateOperator["strictlyBefore"] = "strictly_before";
})(SpiderDateOperator = exports.SpiderDateOperator || (exports.SpiderDateOperator = {}));
//# sourceMappingURL=spiderParam.js.map