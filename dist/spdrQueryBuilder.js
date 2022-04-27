import { SpdrDate, SpdrExists, SpdrOrder, SpdrPageIdx, SpdrPageOperator, SpdrPageSize, SpdrPagination, SpdrRange, SpdrSearch } from "./spdrParam";
export class SpdrQueryBuilder {
    constructor(operand) {
        this._query = '';
        this._operand = operand !== null && operand !== void 0 ? operand : SpdrQueryBuilder._DEFAULT_OPERAND;
        operand && (this._firstOperand = operand);
    }
    append(param, operand = this._operand) {
        this._query += `${operand}${param.query}`;
    }
    search(property, values, operand = this._operand) {
        this.append(new SpdrSearch(property, values, operand));
        return this;
    }
    exists(property, value = true) {
        this.append(new SpdrExists(property, value));
        return this;
    }
    range(property, operator, value, secondValue) {
        this.append(new SpdrRange(property, operator, value, secondValue));
        return this;
    }
    date(property, operator, value) {
        this.append(new SpdrDate(property, operator, value));
        return this;
    }
    order(property, direction) {
        this.append(new SpdrOrder(property, direction));
        return this;
    }
    pagination(value = true, property = SpdrPageOperator.pagination) {
        this.append(new SpdrPagination(value, property));
        return this;
    }
    pageIndex(value, property = SpdrPageOperator.page) {
        this.append(new SpdrPageIdx(value, property));
        return this;
    }
    pageSize(value, property = SpdrPageOperator.itemsPerPage) {
        this.append(new SpdrPageSize(value, property));
        return this;
    }
    /**
     * Returns the query.
     * The query will be empty if you didn't feed the builder with params.
     */
    get query() {
        return this._query.slice(this._firstOperand ? this._firstOperand.length : this._operand.length);
    }
    /**
     * Returns the operand used in the query building.
     */
    get operand() {
        return this._operand;
    }
    /**
     * Sets the operand used in the query building.
     * @param value
     */
    setOperand(value) {
        this._operand = value;
        !this._firstOperand && (this._firstOperand = value);
        return this;
    }
}
SpdrQueryBuilder._DEFAULT_OPERAND = '&';
//# sourceMappingURL=spdrQueryBuilder.js.map