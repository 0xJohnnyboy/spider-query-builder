"use strict";
exports.__esModule = true;
exports.SpiderQueryBuilder = void 0;
var SpiderQueryBuilder = /** @class */ (function () {
    /**
     * Constructing a new SpiderQueryBuilder builds the query if you pass params.
     * In this case, the query will be built with the default operand '&'.
     * To override this behavior, you can construct an empty builder and manually append each SpiderParam according to your needs.
     * @param params SpiderParam[]
     */
    function SpiderQueryBuilder(params) {
        this._query = '';
        params && this.build(params);
    }
    /**
     * Builds the query from the provided SpiderParams. The returned string should be placed right after the question mark in your url.
     * Provided params must implement SpiderParamInterface.
     * @param params SpiderParamInterface[]
     * @param operand string
     */
    SpiderQueryBuilder.prototype.build = function (params, operand) {
        var _this = this;
        if (operand === void 0) { operand = '&'; }
        params.forEach(function (param) {
            _this.append(param, operand);
        });
        this._query = this._query.slice(1);
    };
    /**
     * Appends a SpiderParam to the query. The default operand is '&' but you can pass your own to the second param.
     * Provided param must implement SpiderParamInterface
     * @param param SpiderParamInterface
     * @param operand string
     */
    SpiderQueryBuilder.prototype.append = function (param, operand) {
        if (operand === void 0) { operand = '&'; }
        this._query += "".concat(operand).concat(param.query);
    };
    Object.defineProperty(SpiderQueryBuilder.prototype, "query", {
        /**
         * Returns the query.
         * The query will be empty if you didn't feed the builder with params.
         */
        get: function () {
            return this._query;
        },
        enumerable: false,
        configurable: true
    });
    return SpiderQueryBuilder;
}());
exports.SpiderQueryBuilder = SpiderQueryBuilder;
