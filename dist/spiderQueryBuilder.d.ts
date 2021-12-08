import { SpiderParam, SpiderParamInterface } from "./spiderParam";
export declare class SpiderQueryBuilder {
    private _query;
    /**
     * Constructing a new SpiderQueryBuilder builds the query if you pass params.
     * In this case, the query will be built with the default operand '&'.
     * To override this behavior, you can construct an empty builder and manually append each SpiderParam according to your needs.
     * @param params SpiderParam[]
     */
    constructor(params?: SpiderParam[]);
    /**
     * Builds the query from the provided SpiderParams. The returned string should be placed right after the question mark in your url.
     * Provided params must implement SpiderParamInterface.
     * @param params SpiderParamInterface[]
     * @param operand string
     */
    build(params: SpiderParamInterface[], operand?: string): void;
    /**
     * Appends a SpiderParam to the query. The default operand is '&' but you can pass your own to the second param.
     * Provided param must implement SpiderParamInterface
     * @param param SpiderParamInterface
     * @param operand string
     */
    append(param: SpiderParamInterface, operand?: string): void;
    /**
     * Returns the query.
     * The query will be empty if you didn't feed the builder with params.
     */
    get query(): string;
}
