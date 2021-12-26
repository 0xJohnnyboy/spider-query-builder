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
export declare abstract class SpdrParam implements SpdrParamInterface {
    private readonly _property;
    private readonly _operator;
    private readonly _value;
    private _query;
    /**
     * SpdrParam base constructor
     * @param property string
     * @param operator SpdrOperator | SpdrRangeOperator | SpdrDateOperator
     * @param value any
     * @protected
     */
    protected constructor(property: string, operator: SpdrOperator | SpdrRangeOperator | SpdrDateOperator, value: any);
    get query(): string;
    set query(value: string);
    get operator(): SpdrOperator | SpdrRangeOperator | SpdrDateOperator;
}
export declare class SpdrExists extends SpdrParam {
    /**
     * @param property string
     * @param value boolean
     */
    constructor(property: string, value: boolean);
}
export declare class SpdrSearch extends SpdrParam {
    /**
     * @param property string
     * @param values string[]
     */
    constructor(property: string, values: string[]);
}
export declare class SpdrDate extends SpdrParam {
    /**
     * The date will be formatted in YYYY-MM-DD format, implement a new SpdrParam if you need another formatting.
     * @param property string
     * @param operator SpdrDateOperator
     * @param value Date
     */
    constructor(property: string, operator: SpdrDateOperator, value: Date);
}
export declare class SpdrRange extends SpdrParam {
    /**
     * The secondValue parameter is required for the 'between' operator
     * @param property string
     * @param operator SpdrRangeOperator
     * @param value number
     * @param secondValue number // optional
     */
    constructor(property: string, operator: SpdrRangeOperator, value: number, secondValue?: number);
}
export declare class SpdrOrder extends SpdrParam {
    /**
     * @param property string
     * @param value SpdrOrderOperator
     */
    constructor(property: string, value: SpdrOrderOperator);
}
export declare class SpdrPagination extends SpdrParam {
    /**
     * @param value boolean
     * @param property string ('pagination' by default)
     */
    constructor(value?: boolean, property?: string);
}
export declare class SpdrPageIdx extends SpdrParam {
    /**
     * @param value number
     * @param property string ('page' by default)
     */
    constructor(value: number, property?: string);
}
export declare class SpdrPageSize extends SpdrParam {
    /**
     * @param value number
     * @param property string ('itemsPerPage' by default)
     */
    constructor(value: number, property?: string);
}
/**
 * Base operators
 * @enum string
 */
export declare enum SpdrOperator {
    exists = "exists",
    equals = "=",
    sort = "order"
}
/**
 * Sort values
 * @enum string
 */
export declare enum SpdrOrderOperator {
    asc = "asc",
    desc = "desc"
}
/**
 * Range and comparison operators
 * @enum string
 */
export declare enum SpdrRangeOperator {
    lt = "lt",
    lte = "lte",
    gt = "gt",
    gte = "gte",
    between = "between"
}
/**
 * Date comparison operators
 * @enum string
 */
export declare enum SpdrDateOperator {
    after = "after",
    before = "before",
    strictlyAfter = "strictly_after",
    strictlyBefore = "strictly_before"
}
/**
 * Pagination properties
 * @enum string
 */
export declare enum SpdrPageOperator {
    pagination = "pagination",
    page = "page",
    itemsPerPage = "itemsPerPage"
}
