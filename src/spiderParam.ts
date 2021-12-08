/*
 * Copyright (c) 2021 Théo Lambert
 */

/**
 * SpiderParamInterface must be implemented by all SpiderParams
 */
export interface SpiderParamInterface {
    query: string;
    operator: SpiderOperator | SpiderRangeOperator | SpiderDateOperator;
}

/**
 * SpiderParam Abstract Class
 * You should extend this for your custom purposes.
 * The SpiderQueryBuilder expects SpiderParamInterface[] as a parameter, though.
 * This means you can create your own abstract implementation.
 */
export abstract class SpiderParam implements SpiderParamInterface {
    private readonly _property: string;
    private readonly _operator: SpiderOperator | SpiderRangeOperator | SpiderDateOperator;
    private readonly _value: any;
    private _query: string;

    /**
     * SpiderParam base constructor
     * @param property string
     * @param operator SpiderOperator | SpiderRangeOperator | SpiderDateOperator
     * @param value any
     * @protected
     */
    protected constructor(property: string, operator: SpiderOperator | SpiderRangeOperator | SpiderDateOperator, value: any) {
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

    get operator(): SpiderOperator | SpiderRangeOperator | SpiderDateOperator {
        return this._operator;
    }
}


export class SpiderExistsParam extends SpiderParam {

    /**
     * @param property string
     * @param value boolean
     */
    constructor(property: string, value: boolean) {
        super(property, SpiderOperator.exists, value);
        this.query = `${this.operator}[${property}]=${value.toString()}`;
    }
}

export class SpiderSearchParam extends SpiderParam {

    /**
     * @param property string
     * @param value string
     */
    constructor(property: string, value: string | string[]) {
        super(property, SpiderOperator.equals, value);
        if (!Array.isArray(value)) {
            this.query = `${property}${this.operator}${value}`;
        } else {
            this.query = '';
            value.forEach((v, i) => {
                this.query += i !== (value.length - 1) ? `${property}[]${this.operator}${value[i]}&` : `${property}[]${this.operator}${value[i]}`;
            })
        }


    }
}

export class SpiderDateParam extends SpiderParam {

    /**
     * The date will be formatted in YYYY-MM-DD format, implement a new SpiderParam if you need another formatting.
     * @param property string
     * @param operator SpiderDateOperator
     * @param value Date
     */
    constructor(property: string, operator: SpiderDateOperator, value: Date) {
        super(property, operator, value);
        this.query = `${property}[${operator}]=${value.toISOString().slice(0, 10)}`; // date formatting like YYYY-MM-DD
    }
}

export class SpiderRangeParam extends SpiderParam {

    /**
     * The secondValue parameter is required for the 'between' operator
     * @param property string
     * @param operator SpiderRangeOperator
     * @param value number
     * @param secondValue number // optional
     */
    constructor(property: string, operator: SpiderRangeOperator, value: number, secondValue?: number) {
        super(property, operator, value);
        this.query = !!secondValue && operator === SpiderRangeOperator.between ?
            `${property}[${operator}]=${value.toString()}..${secondValue.toString()}`
            : `${property}[${operator}]=${value.toString()}`;
    }
}

export class SpiderSortParam extends SpiderParam {

    /**
     * @param property string
     * @param value SpiderSortValue
     */
    constructor(property: string, value: SpiderSortValue) {
        super(property, SpiderOperator.sort, value);
        this.query = `${this.operator}[${property}]=${value}`;
    }
}

export class SpiderPaginationParam extends SpiderParam {
    /**
     * @param value boolean
     * @param property string ('pagination' by default)
     */
    constructor(value: boolean = true, property: string = SpiderPaginationProperty.pagination) {
        super(property, SpiderOperator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}

export class SpiderPageIdxParam extends SpiderParam {
    /**
     * @param value number
     * @param property string ('page' by default)
     */
    constructor(value: number, property: string = SpiderPaginationProperty.page) {
        super(property, SpiderOperator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}

export class SpiderPageSizeParam extends SpiderParam {
    /**
     * @param value number
     * @param property string ('itemsPerPage' by default)
     */
    constructor(value: number, property: string = SpiderPaginationProperty.itemsPerPage) {
        super(property, SpiderOperator.equals, value);
        this.query = `${property.toString()}${this.operator}${value.toString()}`;
    }
}

/**
 * Base operators
 * @enum string
 */
export enum SpiderOperator {
    exists = 'exists',
    equals = '=',
    sort = 'order'
}

/**
 * Sort values
 * @enum string
 */
export enum SpiderSortValue {
    asc = 'asc',
    desc = 'desc'
}

/**
 * Range and comparison operators
 * @enum string
 */
export enum SpiderRangeOperator {
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
export enum SpiderDateOperator {
    after = 'after',
    before = 'before',
    strictlyAfter = 'strictly_after',
    strictlyBefore = 'strictly_before'
}

/**
 * Pagination properties
 * @enum string
 */
export enum SpiderPaginationProperty {
    pagination = 'pagination',
    page = 'page',
    itemsPerPage = 'itemsPerPage'
}