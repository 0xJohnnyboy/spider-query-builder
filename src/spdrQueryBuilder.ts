import {
    DateOperator,
    OrderOperator,
    PageOperator,
    RangeOperator,
    SpdrDate,
    SpdrExists,
    SpdrOrder,
    SpdrPageIdx,
    SpdrPageSize,
    SpdrPagination,
    SpdrParamInterface,
    SpdrRange,
    SpdrSearch
} from './spdrParam';


export class SpdrQueryBuilder {

    private static readonly _DEFAULT_OPERAND = '&';

    private _query: string;
    private _operand: string;
    private _history: string[] = [];

    private _params: SpdrParamInterface[] = [];
    private _sortParams: Map<string, SpdrParamInterface> = new Map<string, SpdrParamInterface>();
    private _paginationParams: Map<string, SpdrParamInterface> = new Map<string, SpdrParamInterface>();

    constructor(operand?: string) {
        this._query = '';
        this._operand = operand ?? SpdrQueryBuilder._DEFAULT_OPERAND;
    }

    public operand(value: string): SpdrQueryBuilder {
        this._operand = value;

        return this;
    }

    public clearHistory(): SpdrQueryBuilder {
        this._history = [];

        return this;
    }

    public search(property: string, values: string[], operand: string = this._operand): SpdrQueryBuilder {
        this._addParam(new SpdrSearch(property, values, operand));

        return this;
    }

    public exists(property: string, value: boolean = true): SpdrQueryBuilder {
        this._addParam(new SpdrExists(property, value));

        return this;
    }

    public range(property: string, operator: RangeOperator, value: number, secondValue?: number): SpdrQueryBuilder {
        this._addParam(new SpdrRange(property, operator, value, secondValue));

        return this;
    }

    public date(property: string, operator: DateOperator, value: Date): SpdrQueryBuilder {
        this._addParam(new SpdrDate(property, operator, value));

        return this;
    }

    public order(property: string, direction: OrderOperator): SpdrQueryBuilder {
        this._addSortParam(new SpdrOrder(property, direction));

        return this;
    }

    public enablePagination(value: boolean = true, property: string = PageOperator.pagination): SpdrQueryBuilder {
        this._addPaginationParam(new SpdrPagination(value, property));

        return this;
    }

    public pageIndex(value: number, property: string = PageOperator.page): SpdrQueryBuilder {
        this._addPaginationParam(new SpdrPageIdx(value, property));

        return this;
    }

    public pageSize(value: number, property: string = PageOperator.itemsPerPage): SpdrQueryBuilder {
        this._addPaginationParam(new SpdrPageSize(value, property));

        return this;
    }

    /**
     * Clears the query builder according to the type passed
     * Clears completely if no type is passed
     *
     * @param type
     */
    public clear(type?: SpdrParamType): SpdrQueryBuilder {
        switch (type) {
            case SpdrParamType.param:
                this._params = [];
                break;
            case SpdrParamType.sort:
                this._sortParams.clear();
                break;
            case SpdrParamType.pagination:
                this._paginationParams.clear();
                break;
            default:
                this._params = [];
                this._sortParams.clear();
                this._paginationParams.clear();
                break;
        }

        this._history.push(this.query);
        this._buildQuery();

        return this;
    }

    /**
     * Removes all params of the passed type matching the passed property from the query builder
     * If no type is passed, all params matching the passed property will be removed
     *
     * @param property
     * @param type
     */
    public remove(property: string, type?: SpdrParamType): SpdrQueryBuilder {
        switch (type) {
            case SpdrParamType.param:
                this._params = this._params.filter((param: SpdrParamInterface) => param.property !== property);
                break;
            case SpdrParamType.sort:
                this._sortParams.delete(property);
                break;
            case SpdrParamType.pagination:
                this._paginationParams.delete(property);
                break;
            default:
                this._params = this._params.filter((param: SpdrParamInterface) => param.property !== property);
                this._sortParams.delete(property);
                this._paginationParams.delete(property);
                break;
        }

        this._buildQuery();

        return this;
    }

    private _addParam(param: SpdrParamInterface) {
        this._params.push(param);
        this._buildQuery();
    }

    private _addSortParam(param: SpdrParamInterface) {
        this._sortParams.set(param.property, param);
        this._buildQuery();
    }

    private _addPaginationParam(param: SpdrParamInterface) {
        this._paginationParams.set(param.property, param);
        this._buildQuery();
    }

    private _append(param: SpdrParamInterface, operand: string = this._operand) {
        const query = param.query ?? (param['_query'] || param['query'])
        // todo : find a way to cast params as SpdrSpdrParamInterface and keep getters
        this._query += `${operand}${query}`;
    }

    private _buildQuery() {
        this._query = '';
        this._params.forEach(param => this._append(param));

        this._sortParams.forEach((value) => {
            this._append(value)
        })
        this._paginationParams.forEach((value) => {
            this._append(value)
        })
    }

    /**
     * Returns the query.
     * The query will be empty if you didn't feed the builder with params.
     */
    get query(): string {
        return this._query.slice(this._operand.length);
    }

    get history(): string[] {
        return this._history;
    }

    get previousQuery(): string {
        return this._history[this._history.length - 1];
    }


    get params(): SpdrParamInterface[] {
        return this._params;
    }

    set params(value: SpdrParamInterface[]) {
        this._params = value;
        this._buildQuery();
    }

    get sortParams(): SpdrParamInterface[] {
        return Array.from(this._sortParams.values());
    }

    set sortParams(values: SpdrParamInterface[]) {
        values.forEach(v => this._sortParams.set(v.property ?? (v['property']||v['_property']), v));
        this._buildQuery();
    }

    get paginationParams(): SpdrParamInterface[] {
        return Array.from(this._paginationParams.values());
    }

    set paginationParams(values: SpdrParamInterface[]) {
        values.forEach(v => this._paginationParams.set(v.property ?? (v['property'] || v['_property']), v));
        this._buildQuery();
    }
}

export enum SpdrParamType {
    param, sort, pagination
}