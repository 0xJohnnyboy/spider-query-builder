/*
 * Copyright (c) 2021 Théo Lambert
 */

/**
 * SpdrParamInterface must be implemented by all SpiderParams
 */
export interface SpdrParamInterface {
    query: string;
    operator: SpdrOperator | SpdrRangeOperator | SpdrDateOperator;
}

/**
 * SpdrParam Abstract Class
 * You should extend this for your custom purposes.
 * The SpdrQueryBuilder expects SpdrParamInterface[] as a parameter, though.
 * This means you can create your own abstract implementation.
 */
export abstract class SpdrParam implements SpdrParamInterface {
    private readonly _property: string;
    private readonly _operator: SpdrOperator | SpdrRangeOperator | SpdrDateOperator;
    private readonly _value: any;
    private _query: string;

    /**
     * SpdrParam base constructor
     * @param property string
     * @param operator SpdrOperator | SpdrRangeOperator | SpdrDateOperator
     * @param value any
     * @protected
     */
    protected constructor(property: string, operator: SpdrOperator | SpdrRangeOperator | SpdrDateOperator, value: any) {
        this._property = property;
        this._operator = operator;
        this._value = value;
    }

    get query(): string {
        return this._query;
    }

    set query(value: string) {
        this._query = value;
    }

    get operator(): SpdrOperator | SpdrRangeOperator | SpdrDateOperator {
        return this._operator;
    }
}


export class SpdrExists extends SpdrParam {

    /**
     * @param property string
     * @param value boolean
     */
    constructor(property: string, value: boolean) {
        super(property, SpdrOperator.exists, value);
        this.query = `${this.operator}[${property}]=${value.toString()}`;
    }
}

export class SpdrSearch extends SpdrParam {

    /**
     * @param property string
     * @param values string[]
     */
    constructor(property: string, values: string[]) {
        super(property, SpdrOperator.equals, values);

        this.query = '';

        if (values.length === 1) {
            this.query = `${property}${this.operator}${values[0]}`;
        } else {
            values.forEach((value, i) => {
                let str = `${property}[]${this.operator}${value}&`;

                if (i === values.length - 1) {
                    str = `${property}[]${this.operator}${value}`;
                }

                this.query += str;
            })
        }
    }
}

export class SpdrDate extends SpdrParam {

    /**
     * The date will be formatted in YYYY-MM-DD format, implement a new SpdrParam if you need another formatting.
     * @param property string
     * @param operator SpdrDateOperator
     * @param value Date
     */
    constructor(property: string, operator: SpdrDateOperator, value: Date) {
        super(property, operator, value);
        this.query = `${property}[${operator}]=${value.toISOString().slice(0, 10)}`; // date formatting like YYYY-MM-DD
    }
}

export class SpdrRange extends SpdrParam {

    /**
     * The secondValue parameter is required for the 'between' operator
     * @param property string
     * @param operator SpdrRangeOperator
     * @param value number
     * @param secondValue number // optional
     */
    constructor(property: string, operator: SpdrRangeOperator, value: number, secondValue?: number) {
        super(property, operator, value);
        this.query = !!secondValue && operator === SpdrRangeOperator.between ?
            `${property}[${operator}]=${value.toString()}..${secondValue.toString()}`
            : `${property}[${operator}]=${value.toString()}`;
    }
}

export class SpdrOrder extends SpdrParam {

    /**
     * @param property string
     * @param value SpdrOrderOperator
     */
    constructor(property: string, value: SpdrOrderOperator) {
        super(property, SpdrOperator.sort, value);
        this.query = `${this.operator}[${property}]=${value}`;
    }
}

export class SpdrPagination extends SpdrParam {
    /**
     * @param value boolean
     * @param property string ('pagination' by default)
     */
    constructor(value: boolean = true, property: string = SpdrPageOperator.pagination) {
        super(property, SpdrOperator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}

export class SpdrPageIdx extends SpdrParam {
    /**
     * @param value number
     * @param property string ('page' by default)
     */
    constructor(value: number, property: string = SpdrPageOperator.page) {
        super(property, SpdrOperator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}

export class SpdrPageSize extends SpdrParam {
    /**
     * @param value number
     * @param property string ('itemsPerPage' by default)
     */
    constructor(value: number, property: string = SpdrPageOperator.itemsPerPage) {
        super(property, SpdrOperator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}

/**
 * Base operators
 * @enum string
 */
export enum SpdrOperator {
    exists = 'exists',
    equals = '=',
    sort = 'order'
}

/**
 * Sort values
 * @enum string
 */
export enum SpdrOrderOperator {
    asc = 'asc',
    desc = 'desc'
}

/**
 * Range and comparison operators
 * @enum string
 */
export enum SpdrRangeOperator {
    lt = 'lt',
    lte = 'lte',
    gt = 'gt',
    gte = 'gte',
    between = 'between'
}

/**
 * Date comparison operators
 * @enum string
 */
export enum SpdrDateOperator {
    after = 'after',
    before = 'before',
    strictlyAfter = 'strictly_after',
    strictlyBefore = 'strictly_before'
}

/**
 * Pagination properties
 * @enum string
 */
export enum SpdrPageOperator {
    pagination = 'pagination',
    page = 'page',
    itemsPerPage = 'itemsPerPage'
}