"use strict";
/*
 * Copyright (c) 2021 Théo Lambert
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpdrPageOperator = exports.SpdrDateOperator = exports.SpdrRangeOperator = exports.SpdrOrderOperator = exports.SpdrOperator = exports.SpdrPageSize = exports.SpdrPageIdx = exports.SpdrPagination = exports.SpdrOrder = exports.SpdrRange = exports.SpdrDate = exports.SpdrSearch = exports.SpdrExists = exports.SpdrParam = void 0;
/**
 * SpdrParam Abstract Class
 * You should extend this for your custom purposes.
 * The SpdrQueryBuilder expects SpdrParamInterface[] as a parameter, though.
 * This means you can create your own abstract implementation.
 */
class SpdrParam {
    /**
     * SpdrParam base constructor
     * @param property string
     * @param operator SpdrOperator | SpdrRangeOperator | SpdrDateOperator
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
exports.SpdrParam = SpdrParam;
class SpdrExists extends SpdrParam {
    /**
     * @param property string
     * @param value boolean
     */
    constructor(property, value) {
        super(property, SpdrOperator.exists, value);
        this.query = `${this.operator}[${property}]=${value.toString()}`;
    }
}
exports.SpdrExists = SpdrExists;
class SpdrSearch extends SpdrParam {
    /**
     * @param property string
     * @param values string[]
     */
    constructor(property, values) {
        super(property, SpdrOperator.equals, values);
        this.query = '';
        if (values.length === 1) {
            this.query = `${property}${this.operator}${values[0]}`;
        }
        else {
            values.forEach((value, i) => {
                let str = `${property}[]${this.operator}${value}&`;
                if (i === values.length - 1) {
                    str = `${property}[]${this.operator}${value}`;
                }
                this.query += str;
            });
        }
    }
}
exports.SpdrSearch = SpdrSearch;
class SpdrDate extends SpdrParam {
    /**
     * The date will be formatted in YYYY-MM-DD format, implement a new SpdrParam if you need another formatting.
     * @param property string
     * @param operator SpdrDateOperator
     * @param value Date
     */
    constructor(property, operator, value) {
        super(property, operator, value);
        this.query = `${property}[${operator}]=${value.toISOString().slice(0, 10)}`; // date formatting like YYYY-MM-DD
    }
}
exports.SpdrDate = SpdrDate;
class SpdrRange extends SpdrParam {
    /**
     * The secondValue parameter is required for the 'between' operator
     * @param property string
     * @param operator SpdrRangeOperator
     * @param value number
     * @param secondValue number // optional
     */
    constructor(property, operator, value, secondValue) {
        super(property, operator, value);
        this.query = !!secondValue && operator === SpdrRangeOperator.between ?
            `${property}[${operator}]=${value.toString()}..${secondValue.toString()}`
            : `${property}[${operator}]=${value.toString()}`;
    }
}
exports.SpdrRange = SpdrRange;
class SpdrOrder extends SpdrParam {
    /**
     * @param property string
     * @param value SpdrOrderOperator
     */
    constructor(property, value) {
        super(property, SpdrOperator.sort, value);
        this.query = `${this.operator}[${property}]=${value}`;
    }
}
exports.SpdrOrder = SpdrOrder;
class SpdrPagination extends SpdrParam {
    /**
     * @param value boolean
     * @param property string ('pagination' by default)
     */
    constructor(value = true, property = SpdrPageOperator.pagination) {
        super(property, SpdrOperator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}
exports.SpdrPagination = SpdrPagination;
class SpdrPageIdx extends SpdrParam {
    /**
     * @param value number
     * @param property string ('page' by default)
     */
    constructor(value, property = SpdrPageOperator.page) {
        super(property, SpdrOperator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}
exports.SpdrPageIdx = SpdrPageIdx;
class SpdrPageSize extends SpdrParam {
    /**
     * @param value number
     * @param property string ('itemsPerPage' by default)
     */
    constructor(value, property = SpdrPageOperator.itemsPerPage) {
        super(property, SpdrOperator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}
exports.SpdrPageSize = SpdrPageSize;
/**
 * Base operators
 * @enum string
 */
var SpdrOperator;
(function (SpdrOperator) {
    SpdrOperator["exists"] = "exists";
    SpdrOperator["equals"] = "=";
    SpdrOperator["sort"] = "order";
})(SpdrOperator = exports.SpdrOperator || (exports.SpdrOperator = {}));
/**
 * Sort values
 * @enum string
 */
var SpdrOrderOperator;
(function (SpdrOrderOperator) {
    SpdrOrderOperator["asc"] = "asc";
    SpdrOrderOperator["desc"] = "desc";
})(SpdrOrderOperator = exports.SpdrOrderOperator || (exports.SpdrOrderOperator = {}));
/**
 * Range and comparison operators
 * @enum string
 */
var SpdrRangeOperator;
(function (SpdrRangeOperator) {
    SpdrRangeOperator["lt"] = "lt";
    SpdrRangeOperator["lte"] = "lte";
    SpdrRangeOperator["gt"] = "gt";
    SpdrRangeOperator["gte"] = "gte";
    SpdrRangeOperator["between"] = "between";
})(SpdrRangeOperator = exports.SpdrRangeOperator || (exports.SpdrRangeOperator = {}));
/**
 * Date comparison operators
 * @enum string
 */
var SpdrDateOperator;
(function (SpdrDateOperator) {
    SpdrDateOperator["after"] = "after";
    SpdrDateOperator["before"] = "before";
    SpdrDateOperator["strictlyAfter"] = "strictly_after";
    SpdrDateOperator["strictlyBefore"] = "strictly_before";
})(SpdrDateOperator = exports.SpdrDateOperator || (exports.SpdrDateOperator = {}));
/**
 * Pagination properties
 * @enum string
 */
var SpdrPageOperator;
(function (SpdrPageOperator) {
    SpdrPageOperator["pagination"] = "pagination";
    SpdrPageOperator["page"] = "page";
    SpdrPageOperator["itemsPerPage"] = "itemsPerPage";
})(SpdrPageOperator = exports.SpdrPageOperator || (exports.SpdrPageOperator = {}));
//# sourceMappingURL=spdrParam.js.map