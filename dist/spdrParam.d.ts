/**
 * SpdrParamInterface must be implemented by all SpiderParams
 */
export interface SpdrParamInterface {
    query: string;
    property: string;
    value: any;
    operator: Operator | RangeOperator | DateOperator;
}
/**
 * Spdr Abstract Class
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
     * Spdr SpdrParam base constructor
     * @param property string
     * @param operator Operator | RangeOperator | DateOperator
     * @param value any
     * @protected
     */
    protected constructor(property: string, operator: Operator | RangeOperator | DateOperator, value: any);
    get property(): string;
    get value(): any;
    get query(): string;
    set query(value: string);
    get operator(): Operator | RangeOperator | DateOperator;
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
     *
     * @param property
     * @param values
     * @param operand
     */
    constructor(property: string, values: string[], operand?: string);
}
export declare class SpdrDate extends SpdrParam {
    /**
     * The date will be formatted in YYYY-MM-DD format, implement a new Spdr if you need another formatting.
     * @param property string
     * @param operator DateOperator
     * @param value Date
     */
    constructor(property: string, operator: DateOperator, value: Date);
}
export declare class SpdrRange extends SpdrParam {
    /**
     * The secondValue parameter is required for the 'between' operator
     * @param property string
     * @param operator RangeOperator
     * @param value number
     * @param secondValue number // optional
     */
    constructor(property: string, operator: RangeOperator, value: number, secondValue?: number);
}
export declare class SpdrOrder extends SpdrParam {
    /**
     * @param property string
     * @param value OrderOperator
     */
    constructor(property: string, value: OrderOperator);
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
export declare enum Operator {
    exists = "exists",
    equals = "=",
    sort = "order"
}
/**
 * Sort values
 * @enum string
 */
export declare enum OrderOperator {
    asc = "asc",
    desc = "desc"
}
/**
 * Range and comparison operators
 * @enum string
 */
export declare enum RangeOperator {
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
export declare enum DateOperator {
    after = "after",
    before = "before",
    strictlyAfter = "strictly_after",
    strictlyBefore = "strictly_before"
}
/**
 * Pagination properties
 * @enum string
 */
export declare enum PageOperator {
    pagination = "pagination",
    page = "page",
    itemsPerPage = "itemsPerPage"
}
