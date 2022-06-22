import { PageOperator, SpdrDate, SpdrExists, SpdrOrder, SpdrPageIdx, SpdrPageSize, SpdrPagination, SpdrRange, SpdrSearch } from './spdrParam';
export class SpdrQueryBuilder {
    constructor(operand) {
        this._history = [];
        this._params = [];
        this._sortParams = new Map();
        this._paginationParams = new Map();
        this._query = '';
        this._operand = operand !== null && operand !== void 0 ? operand : SpdrQueryBuilder._DEFAULT_OPERAND;
    }
    operand(value) {
        this._operand = value;
        return this;
    }
    clearHistory() {
        this._history = [];
        return this;
    }
    search(property, values, operand = this._operand) {
        this._addParam(new SpdrSearch(property, values, operand));
        return this;
    }
    exists(property, value = true) {
        this._addParam(new SpdrExists(property, value));
        return this;
    }
    range(property, operator, value, secondValue) {
        this._addParam(new SpdrRange(property, operator, value, secondValue));
        return this;
    }
    date(property, operator, value) {
        this._addParam(new SpdrDate(property, operator, value));
        return this;
    }
    order(property, direction) {
        this._addSortParam(new SpdrOrder(property, direction));
        return this;
    }
    enablePagination(value = true, property = PageOperator.pagination) {
        this._addPaginationParam(new SpdrPagination(value, property));
        return this;
    }
    pageIndex(value, property = PageOperator.page) {
        this._addPaginationParam(new SpdrPageIdx(value, property));
        return this;
    }
    pageSize(value, property = PageOperator.itemsPerPage) {
        this._addPaginationParam(new SpdrPageSize(value, property));
        return this;
    }
    /**
     * Clears the query builder according to the type passed
     * Clears completely if no type is passed
     *
     * @param type
     */
    clear(type) {
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
    remove(property, type) {
        switch (type) {
            case SpdrParamType.param:
                this._params = this._params.filter((param) => param.property !== property);
                break;
            case SpdrParamType.sort:
                this._sortParams.delete(property);
                break;
            case SpdrParamType.pagination:
                this._paginationParams.delete(property);
                break;
            default:
                this._params = this._params.filter((param) => param.property !== property);
                this._sortParams.delete(property);
                this._paginationParams.delete(property);
                break;
        }
        this._buildQuery();
        return this;
    }
    _addParam(param) {
        this._params.push(param);
        this._buildQuery();
    }
    _addSortParam(param) {
        this._sortParams.set(param.property, param);
        this._buildQuery();
    }
    _addPaginationParam(param) {
        this._paginationParams.set(param.property, param);
        this._buildQuery();
    }
    _append(param, operand = this._operand) {
        var _a;
        const query = (_a = param.query) !== null && _a !== void 0 ? _a : (param['_query'] || param['query']);
        // todo : find a way to cast params as SpdrSpdrParamInterface and keep getters
        this._query += `${operand}${query}`;
    }
    _buildQuery() {
        this._query = '';
        this._params.forEach(param => this._append(param));
        this._sortParams.forEach((value) => {
            this._append(value);
        });
        this._paginationParams.forEach((value) => {
            this._append(value);
        });
    }
    /**
     * Returns the query.
     * The query will be empty if you didn't feed the builder with params.
     */
    get query() {
        return this._query.slice(this._operand.length);
    }
    get history() {
        return this._history;
    }
    get previousQuery() {
        return this._history[this._history.length - 1];
    }
    get params() {
        return this._params;
    }
    set params(value) {
        this._params = value;
        this._buildQuery();
    }
    get sortParams() {
        return Array.from(this._sortParams.values());
    }
    set sortParams(values) {
        values.forEach(v => { var _a; return this._sortParams.set((_a = v.property) !== null && _a !== void 0 ? _a : (v['property'] || v['_property']), v); });
        this._buildQuery();
    }
    get paginationParams() {
        return Array.from(this._paginationParams.values());
    }
    set paginationParams(values) {
        values.forEach(v => { var _a; return this._paginationParams.set((_a = v.property) !== null && _a !== void 0 ? _a : (v['property'] || v['_property']), v); });
        this._buildQuery();
    }
}
SpdrQueryBuilder._DEFAULT_OPERAND = '&';
export var SpdrParamType;
(function (SpdrParamType) {
    SpdrParamType[SpdrParamType["param"] = 0] = "param";
    SpdrParamType[SpdrParamType["sort"] = 1] = "sort";
    SpdrParamType[SpdrParamType["pagination"] = 2] = "pagination";
})(SpdrParamType || (SpdrParamType = {}));
//# sourceMappingURL=spdrQueryBuilder.js.map