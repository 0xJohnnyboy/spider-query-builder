import {
    SpdrDate,
    SpdrDateOperator,
    SpdrExists,
    SpdrOrder,
    SpdrOrderOperator,
    SpdrPageIdx,
    SpdrPageOperator,
    SpdrPageSize,
    SpdrPagination,
    SpdrParamInterface,
    SpdrRange,
    SpdrRangeOperator,
    SpdrSearch
} from "./spdrParam";

export class SpdrQueryBuilder {

    private static readonly _DEFAULT_OPERAND = '&';
    private _query: string;
    private _operand: string;
    private _firstOperand: string;

    constructor(operand?: string) {
        this._query = '';
        this._operand = operand ?? SpdrQueryBuilder._DEFAULT_OPERAND;
        operand && (this._firstOperand = operand);
    }

    public append(param: SpdrParamInterface, operand: string = this._operand) {
        this._query += `${operand}${param.query}`;
    }

    public search(property: string, values: string[], operand: string = this._operand): SpdrQueryBuilder {
        this.append(new SpdrSearch(property, values, operand));

        return this;
    }

    public exists(property: string, value: boolean = true): SpdrQueryBuilder {
        this.append(new SpdrExists(property, value));

        return this;
    }

    public range(property: string, operator: SpdrRangeOperator, value: number, secondValue?: number): SpdrQueryBuilder {
        this.append(new SpdrRange(property, operator, value, secondValue));

        return this;
    }

    public date(property: string, operator: SpdrDateOperator, value: Date): SpdrQueryBuilder {
        this.append(new SpdrDate(property, operator, value));

        return this;
    }

    public order(property: string, direction: SpdrOrderOperator): SpdrQueryBuilder {
        this.append(new SpdrOrder(property, direction));

        return this;
    }

    public pagination(value: boolean = true, property: string = SpdrPageOperator.pagination): SpdrQueryBuilder {
        this.append(new SpdrPagination(value, property));

        return this;
    }

    public pageIndex(value: number, property: string = SpdrPageOperator.page): SpdrQueryBuilder {
        this.append(new SpdrPageIdx(value, property));

        return this;
    }

    public pageSize(value: number, property: string = SpdrPageOperator.itemsPerPage): SpdrQueryBuilder {
        this.append(new SpdrPageSize(value, property));

        return this;
    }

    /**
     * Returns the query.
     * The query will be empty if you didn't feed the builder with params.
     */
    get query(): string {
        return this._query.slice(this._firstOperand ? this._firstOperand.length : this._operand.length);
    }

    /**
     * Returns the operand used in the query building.
     */
    get operand(): string {
        return this._operand;
    }

    /**
     * Sets the operand used in the query building.
     * @param value
     */
    setOperand(value: string): SpdrQueryBuilder {
        this._operand = value;
        !this._firstOperand && (this._firstOperand = value);

        return this;
    }
}
