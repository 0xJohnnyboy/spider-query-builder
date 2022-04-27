import { SpdrDateOperator, SpdrOrderOperator, SpdrParamInterface, SpdrRangeOperator } from "./spdrParam";
export declare class SpdrQueryBuilder {
    private static readonly _DEFAULT_OPERAND;
    private _query;
    private _operand;
    private _firstOperand;
    constructor(operand?: string);
    append(param: SpdrParamInterface, operand?: string): void;
    search(property: string, values: string[], operand?: string): SpdrQueryBuilder;
    exists(property: string, value?: boolean): SpdrQueryBuilder;
    range(property: string, operator: SpdrRangeOperator, value: number, secondValue?: number): SpdrQueryBuilder;
    date(property: string, operator: SpdrDateOperator, value: Date): SpdrQueryBuilder;
    order(property: string, direction: SpdrOrderOperator): SpdrQueryBuilder;
    pagination(value?: boolean, property?: string): SpdrQueryBuilder;
    pageIndex(value: number, property?: string): SpdrQueryBuilder;
    pageSize(value: number, property?: string): SpdrQueryBuilder;
    /**
     * Returns the query.
     * The query will be empty if you didn't feed the builder with params.
     */
    get query(): string;
    /**
     * Returns the operand used in the query building.
     */
    get operand(): string;
    /**
     * Sets the operand used in the query building.
     * @param value
     */
    setOperand(value: string): SpdrQueryBuilder;
}
