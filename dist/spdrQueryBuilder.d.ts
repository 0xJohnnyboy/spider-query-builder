import { DateOperator, OrderOperator, RangeOperator, SpdrParamInterface } from './spdrParam';
export declare class SpdrQueryBuilder {
    private static readonly _DEFAULT_OPERAND;
    private _query;
    private _operand;
    private _history;
    private _params;
    private _sortParams;
    private _paginationParams;
    constructor(operand?: string);
    operand(value: string): SpdrQueryBuilder;
    clearHistory(): SpdrQueryBuilder;
    search(property: string, values: string[], operand?: string): SpdrQueryBuilder;
    exists(property: string, value?: boolean): SpdrQueryBuilder;
    range(property: string, operator: RangeOperator, value: number, secondValue?: number): SpdrQueryBuilder;
    date(property: string, operator: DateOperator, value: Date): SpdrQueryBuilder;
    order(property: string, direction: OrderOperator): SpdrQueryBuilder;
    enablePagination(value?: boolean, property?: string): SpdrQueryBuilder;
    pageIndex(value: number, property?: string): SpdrQueryBuilder;
    pageSize(value: number, property?: string): SpdrQueryBuilder;
    /**
     * Clears the query builder according to the type passed
     * Clears completely if no type is passed
     *
     * @param type
     */
    clear(type?: SpdrParamType): SpdrQueryBuilder;
    /**
     * Removes all params of the passed type matching the passed property from the query builder
     * If no type is passed, all params matching the passed property will be removed
     *
     * @param property
     * @param type
     */
    remove(property: string, type?: SpdrParamType): SpdrQueryBuilder;
    private _addParam;
    private _addSortParam;
    private _addPaginationParam;
    private _append;
    private _buildQuery;
    /**
     * Returns the query.
     * The query will be empty if you didn't feed the builder with params.
     */
    get query(): string;
    get history(): string[];
    get previousQuery(): string;
    get params(): SpdrParamInterface[];
    set params(value: SpdrParamInterface[]);
    get sortParams(): SpdrParamInterface[];
    set sortParams(value: SpdrParamInterface[]);
    get paginationParams(): SpdrParamInterface[];
    set paginationParams(value: SpdrParamInterface[]);
}
export declare enum SpdrParamType {
    param = 0,
    sort = 1,
    pagination = 2
}
