"use strict";
/*
 * Copyright (c) 2021 Théo Lambert
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.SpiderDateOperator = exports.SpiderRangeOperator = exports.SpiderSortValue = exports.SpiderOperator = exports.SpiderPageSizeParam = exports.SpiderPageIdxParam = exports.SpiderSortParam = exports.SpiderRangeParam = exports.SpiderDateParam = exports.SpiderSearchParam = exports.SpiderExistsParam = exports.SpiderParam = void 0;
/**
 * SpiderParam Abstract Class
 * You should extend this for your custom purposes.
 * The SpiderQueryBuilder expects SpiderParamInterface[] as a parameter, though.
 * This means you can create your own abstract implementation.
 */
var SpiderParam = /** @class */ (function () {
    /**
     * SpiderParam base constructor
     * @param property string
     * @param operator SpiderOperator | SpiderRangeOperator | SpiderDateOperator
     * @param value any
     * @protected
     */
    function SpiderParam(property, operator, value) {
        this._property = property;
        this._operator = operator;
        this._value = value;
    }
    Object.defineProperty(SpiderParam.prototype, "query", {
        get: function () {
            return this._query;
        },
        set: function (value) {
            this._query = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SpiderParam.prototype, "operator", {
        get: function () {
            return this._operator;
        },
        enumerable: false,
        configurable: true
    });
    return SpiderParam;
}());
exports.SpiderParam = SpiderParam;
var SpiderExistsParam = /** @class */ (function (_super) {
    __extends(SpiderExistsParam, _super);
    /**
     * @param property string
     * @param value boolean
     */
    function SpiderExistsParam(property, value) {
        var _this = _super.call(this, property, SpiderOperator.exists, value) || this;
        _this.query = "".concat(_this.operator, "[").concat(property, "]=").concat(value.toString());
        return _this;
    }
    return SpiderExistsParam;
}(SpiderParam));
exports.SpiderExistsParam = SpiderExistsParam;
var SpiderSearchParam = /** @class */ (function (_super) {
    __extends(SpiderSearchParam, _super);
    /**
     * @param property string
     * @param value string
     */
    function SpiderSearchParam(property, value) {
        var _this = _super.call(this, property, SpiderOperator.equals, value) || this;
        if (!Array.isArray(value)) {
            _this.query = "".concat(property).concat(_this.operator).concat(value);
        }
        else {
            _this.query = '';
            value.forEach(function (v, i) {
                _this.query += i !== (value.length - 1) ? "".concat(property, "[]").concat(_this.operator).concat(value[i], "&") : "".concat(property, "[]").concat(_this.operator).concat(value[i]);
            });
        }
        return _this;
    }
    return SpiderSearchParam;
}(SpiderParam));
exports.SpiderSearchParam = SpiderSearchParam;
var SpiderDateParam = /** @class */ (function (_super) {
    __extends(SpiderDateParam, _super);
    /**
     * The date will be formatted in YYYY-MM-DD format, implement a new SpiderParam if you need another formatting.
     * @param property string
     * @param operator SpiderDateOperator
     * @param value Date
     */
    function SpiderDateParam(property, operator, value) {
        var _this = _super.call(this, property, operator, value) || this;
        _this.query = "".concat(property, "[").concat(operator, "]=").concat(value.toISOString().slice(0, 10)); // date formatting like YYYY-MM-DD
        return _this;
    }
    return SpiderDateParam;
}(SpiderParam));
exports.SpiderDateParam = SpiderDateParam;
var SpiderRangeParam = /** @class */ (function (_super) {
    __extends(SpiderRangeParam, _super);
    /**
     * The secondValue parameter is required for the 'between' operator
     * @param property string
     * @param operator SpiderRangeOperator
     * @param value number
     * @param secondValue number // optional
     */
    function SpiderRangeParam(property, operator, value, secondValue) {
        var _this = _super.call(this, property, operator, value) || this;
        _this.query = !!secondValue && operator === SpiderRangeOperator.between ?
            "".concat(property, "[").concat(operator, "]=").concat(value.toString(), "..").concat(secondValue.toString())
            : "".concat(property, "[").concat(operator, "]=").concat(value.toString());
        return _this;
    }
    return SpiderRangeParam;
}(SpiderParam));
exports.SpiderRangeParam = SpiderRangeParam;
var SpiderSortParam = /** @class */ (function (_super) {
    __extends(SpiderSortParam, _super);
    /**
     * @param property string
     * @param value SpiderSortValue
     */
    function SpiderSortParam(property, value) {
        var _this = _super.call(this, property, SpiderOperator.sort, value) || this;
        _this.query = "".concat(_this.operator, "[").concat(property, "]=").concat(value);
        return _this;
    }
    return SpiderSortParam;
}(SpiderParam));
exports.SpiderSortParam = SpiderSortParam;
var SpiderPageIdxParam = /** @class */ (function (_super) {
    __extends(SpiderPageIdxParam, _super);
    /**
     * @param value number
     * @param property string ('page' by default)
     */
    function SpiderPageIdxParam(value, property) {
        if (property === void 0) { property = 'page'; }
        var _this = _super.call(this, property, SpiderOperator.equals, value) || this;
        _this.query = "".concat(property).concat(_this.operator).concat(value.toString());
        return _this;
    }
    return SpiderPageIdxParam;
}(SpiderParam));
exports.SpiderPageIdxParam = SpiderPageIdxParam;
var SpiderPageSizeParam = /** @class */ (function (_super) {
    __extends(SpiderPageSizeParam, _super);
    /**
     * @param value number
     * @param property string, ('itemsPerPage' by default)
     */
    function SpiderPageSizeParam(value, property) {
        if (property === void 0) { property = 'itemsPerPage'; }
        var _this = _super.call(this, property, SpiderOperator.equals, value) || this;
        _this.query = "".concat(property).concat(_this.operator).concat(value.toString());
        return _this;
    }
    return SpiderPageSizeParam;
}(SpiderParam));
exports.SpiderPageSizeParam = SpiderPageSizeParam;
/**
 * Base operators
 * @enum string
 */
var SpiderOperator;
(function (SpiderOperator) {
    SpiderOperator["exists"] = "exists";
    SpiderOperator["equals"] = "=";
    SpiderOperator["sort"] = "order";
})(SpiderOperator = exports.SpiderOperator || (exports.SpiderOperator = {}));
/**
 * Sort values
 * @enum string
 */
var SpiderSortValue;
(function (SpiderSortValue) {
    SpiderSortValue["asc"] = "asc";
    SpiderSortValue["desc"] = "desc";
})(SpiderSortValue = exports.SpiderSortValue || (exports.SpiderSortValue = {}));
/**
 * Range and comparison operators
 * @enum string
 */
var SpiderRangeOperator;
(function (SpiderRangeOperator) {
    SpiderRangeOperator["lt"] = "lt";
    SpiderRangeOperator["lte"] = "lte";
    SpiderRangeOperator["gt"] = "gt";
    SpiderRangeOperator["gte"] = "gte";
    SpiderRangeOperator["between"] = "between";
})(SpiderRangeOperator = exports.SpiderRangeOperator || (exports.SpiderRangeOperator = {}));
/**
 * Date comparison operators
 * @enum string
 */
var SpiderDateOperator;
(function (SpiderDateOperator) {
    SpiderDateOperator["after"] = "after";
    SpiderDateOperator["before"] = "before";
    SpiderDateOperator["strictlyAfter"] = "strictly_after";
    SpiderDateOperator["strictlyBefore"] = "strictly_before";
})(SpiderDateOperator = exports.SpiderDateOperator || (exports.SpiderDateOperator = {}));
