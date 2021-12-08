"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpiderQueryBuilder = void 0;
class SpiderQueryBuilder {
    /**
     * Constructing a new SpiderQueryBuilder builds the query if you pass params.
     * In this case, the query will be built with the default operand '&'.
     * To override this behavior, you can construct an empty builder and manually append each SpiderParam according to your needs.
     * @param params SpiderParam[]
     */
    constructor(params) {
        this._query = '';
        params && this.build(params);
    }
    /**
     * Builds the query from the provided SpiderParams. The returned string should be placed right after the question mark in your url.
     * Provided params must implement SpiderParamInterface.
     * @param params SpiderParamInterface[]
     * @param operand string
     */
    build(params, operand = '&') {
        params.forEach((param) => {
            this.append(param, operand);
        });
        this._query = this._query.slice(1);
    }
    /**
     * Appends a SpiderParam to the query. The default operand is '&' but you can pass your own to the second param.
     * Provided param must implement SpiderParamInterface
     * @param param SpiderParamInterface
     * @param operand string
     */
    append(param, operand = '&') {
        this._query += `${operand}${param.query}`;
    }
    /**
     * Returns the query.
     * The query will be empty if you didn't feed the builder with params.
     */
    get query() {
        return this._query;
    }
}
exports.SpiderQueryBuilder = SpiderQueryBuilder;
//# sourceMappingURL=spiderQueryBuilder.js.map