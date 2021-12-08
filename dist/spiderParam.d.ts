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
export declare abstract class SpiderParam implements SpiderParamInterface {
    private readonly _property;
    private readonly _operator;
    private readonly _value;
    private _query;
    /**
     * SpiderParam base constructor
     * @param property string
     * @param operator SpiderOperator | SpiderRangeOperator | SpiderDateOperator
     * @param value any
     * @protected
     */
    protected constructor(property: string, operator: SpiderOperator | SpiderRangeOperator | SpiderDateOperator, value: any);
    get query(): string;
    set query(value: string);
    get operator(): SpiderOperator | SpiderRangeOperator | SpiderDateOperator;
}
export declare class SpiderExistsParam extends SpiderParam {
    /**
     * @param property string
     * @param value boolean
     */
    constructor(property: string, value: boolean);
}
export declare class SpiderSearchParam extends SpiderParam {
    /**
     * @param property string
     * @param value string
     */
    constructor(property: string, value: string | string[]);
}
export declare class SpiderDateParam extends SpiderParam {
    /**
     * The date will be formatted in YYYY-MM-DD format, implement a new SpiderParam if you need another formatting.
     * @param property string
     * @param operator SpiderDateOperator
     * @param value Date
     */
    constructor(property: string, operator: SpiderDateOperator, value: Date);
}
export declare class SpiderRangeParam extends SpiderParam {
    /**
     * The secondValue parameter is required for the 'between' operator
     * @param property string
     * @param operator SpiderRangeOperator
     * @param value number
     * @param secondValue number // optional
     */
    constructor(property: string, operator: SpiderRangeOperator, value: number, secondValue?: number);
}
export declare class SpiderSortParam extends SpiderParam {
    /**
     * @param property string
     * @param value SpiderSortValue
     */
    constructor(property: string, value: SpiderSortValue);
}
/**
 * Base operators
 * @enum string
 */
export declare enum SpiderOperator {
    exists = "exists",
    equals = "equals",
    sort = "order"
}
/**
 * Sort values
 * @enum string
 */
export declare enum SpiderSortValue {
    asc = "asc",
    desc = "desc"
}
/**
 * Range and comparison operators
 * @enum string
 */
export declare enum SpiderRangeOperator {
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
export declare enum SpiderDateOperator {
    after = "after",
    before = "before",
    strictlyAfter = "strictly_after",
    strictlyBefore = "strictly_before"
}
