/*
 * Copyright (c) 2021 Théo Lambert
 */
/**
 * Spdr Abstract Class
 * You should extend this for your custom purposes.
 * The SpdrQueryBuilder expects SpdrParamInterface[] as a parameter, though.
 * This means you can create your own abstract implementation.
 */
export class SpdrParam {
    /**
     * Spdr SpdrParam base constructor
     * @param property string
     * @param operator Operator | RangeOperator | DateOperator
     * @param value any
     * @protected
     */
    constructor(property, operator, value) {
        this._query = '';
        this._property = property;
        this._operator = operator;
        this._value = value;
    }
    get property() {
        return this._property;
    }
    get value() {
        return this._value;
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
export class SpdrExists extends SpdrParam {
    /**
     * @param property string
     * @param value boolean
     */
    constructor(property, value) {
        super(property, Operator.exists, value);
        this.query = `${this.operator}[${property}]=${value.toString()}`;
    }
}
export class SpdrSearch extends SpdrParam {
    /**
     *
     * @param property
     * @param values
     * @param operand
     */
    constructor(property, values, operand = '&') {
        super(property, Operator.equals, values);
        this.query = '';
        if (values.length === 1) {
            this.query = `${property}${this.operator}${values[0]}`;
        }
        else {
            values.forEach((value, i) => {
                let str = `${property}[]${this.operator}${value}${operand}`;
                if (i === values.length - 1) {
                    str = `${property}[]${this.operator}${value}`;
                }
                this.query += str;
            });
        }
    }
}
export class SpdrDate extends SpdrParam {
    /**
     * The date will be formatted in YYYY-MM-DD format, implement a new Spdr if you need another formatting.
     * @param property string
     * @param operator DateOperator
     * @param value Date
     */
    constructor(property, operator, value) {
        super(property, operator, value);
        this.query = `${property}[${operator}]=${value.toISOString().slice(0, 10)}`; // date formatting like YYYY-MM-DD
    }
}
export class SpdrRange extends SpdrParam {
    /**
     * The secondValue parameter is required for the 'between' operator
     * @param property string
     * @param operator RangeOperator
     * @param value number
     * @param secondValue number // optional
     */
    constructor(property, operator, value, secondValue) {
        super(property, operator, value);
        this.query = !!secondValue && operator === RangeOperator.between ?
            `${property}[${operator}]=${value.toString()}..${secondValue.toString()}`
            : `${property}[${operator}]=${value.toString()}`;
    }
}
export class SpdrOrder extends SpdrParam {
    /**
     * @param property string
     * @param value OrderOperator
     */
    constructor(property, value) {
        super(property, Operator.sort, value);
        this.query = `${this.operator}[${property}]=${value}`;
    }
}
export class SpdrPagination extends SpdrParam {
    /**
     * @param value boolean
     * @param property string ('pagination' by default)
     */
    constructor(value = true, property = PageOperator.pagination) {
        super(property, Operator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}
export class SpdrPageIdx extends SpdrParam {
    /**
     * @param value number
     * @param property string ('page' by default)
     */
    constructor(value, property = PageOperator.page) {
        super(property, Operator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}
export class SpdrPageSize extends SpdrParam {
    /**
     * @param value number
     * @param property string ('itemsPerPage' by default)
     */
    constructor(value, property = PageOperator.itemsPerPage) {
        super(property, Operator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}
/**
 * Base operators
 * @enum string
 */
export var Operator;
(function (Operator) {
    Operator["exists"] = "exists";
    Operator["equals"] = "=";
    Operator["sort"] = "order";
})(Operator || (Operator = {}));
/**
 * Sort values
 * @enum string
 */
export var OrderOperator;
(function (OrderOperator) {
    OrderOperator["asc"] = "asc";
    OrderOperator["desc"] = "desc";
})(OrderOperator || (OrderOperator = {}));
/**
 * Range and comparison operators
 * @enum string
 */
export var RangeOperator;
(function (RangeOperator) {
    RangeOperator["lt"] = "lt";
    RangeOperator["lte"] = "lte";
    RangeOperator["gt"] = "gt";
    RangeOperator["gte"] = "gte";
    RangeOperator["between"] = "between";
})(RangeOperator || (RangeOperator = {}));
/**
 * Date comparison operators
 * @enum string
 */
export var DateOperator;
(function (DateOperator) {
    DateOperator["after"] = "after";
    DateOperator["before"] = "before";
    DateOperator["strictlyAfter"] = "strictly_after";
    DateOperator["strictlyBefore"] = "strictly_before";
})(DateOperator || (DateOperator = {}));
/**
 * Pagination properties
 * @enum string
 */
export var PageOperator;
(function (PageOperator) {
    PageOperator["pagination"] = "pagination";
    PageOperator["page"] = "page";
    PageOperator["itemsPerPage"] = "itemsPerPage";
})(PageOperator || (PageOperator = {}));
//# sourceMappingURL=spdrParam.js.map