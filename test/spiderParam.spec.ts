import * as chai from 'chai';
import {
    SpiderDateOperator,
    SpiderDateParam,
    SpiderExistsParam,
    SpiderPageIdxParam,
    SpiderPageSizeParam,
    SpiderRangeOperator,
    SpiderRangeParam,
    SpiderSearchParam,
    SpiderSortParam,
    SpiderSortValue,
} from "../src";
import {SpiderPaginationParam} from "../dist";

chai.should();

describe('Testing SpiderExistsParam', () => {
    it("should create a query equal to 'exists[isActive]=true'", () => {
        const param = new SpiderExistsParam('isActive', true);

        param.query.should.equal('exists[isActive]=true');
    });
})

describe('Testing SpiderSearchParam', () => {
    it("should create a query equal to 'name=John Doe'", () => {
        const param = new SpiderSearchParam('name', 'John Doe');

        param.query.should.equal('name=John Doe');
    });
    it("should create the query equal to 'name[]=John Doe&name[]=Jane Doe'", () => {
        const param = new SpiderSearchParam('name', ['John Doe', 'Jane Doe']);

        param.query.should.equal('name[]=John Doe&name[]=Jane Doe');
    });
});

describe('Testing SpiderDateParam', () => {
    it('should create a query equal to "addedAt[after]=date" with date being today formatted as yyy-mm-dd', () => {
        const date: Date = new Date();
        const isoString = date.toISOString().slice(0, 10);
        const param = new SpiderDateParam('addedAt', SpiderDateOperator.after, date);

        param.query.should.equal(`addedAt[after]=${isoString}`);
    });
    it('should create a query equal to "addedAt[strictly_after]=date" with date being today formatted as yyy-mm-dd', () => {
        const date: Date = new Date();
        const isoString = date.toISOString().slice(0, 10);
        const param = new SpiderDateParam('addedAt', SpiderDateOperator.strictlyAfter, date);

        param.query.should.equal(`addedAt[strictly_after]=${isoString}`);
    });
    it('should create a query equal to "addedAt[before]=date" with date being today formatted as yyy-mm-dd', () => {
        const date: Date = new Date();
        const isoString = date.toISOString().slice(0, 10);
        const param = new SpiderDateParam('addedAt', SpiderDateOperator.before, date);

        param.query.should.equal(`addedAt[before]=${isoString}`);
    });
    it('should create a query equal to "addedAt[strictly_before]=date" with date being today formatted as yyy-mm-dd', () => {
        const date: Date = new Date();
        const isoString = date.toISOString().slice(0, 10);
        const param = new SpiderDateParam('addedAt', SpiderDateOperator.strictlyBefore, date);

        param.query.should.equal(`addedAt[strictly_before]=${isoString}`);
    });
});

describe('Testing SpiderRangeParam', () => {
    it('should create a query equal to "price[lt]=10"', () => {
        const param = new SpiderRangeParam('price', SpiderRangeOperator.lt, 10);

        param.query.should.equal('price[lt]=10');
    });
    it('should create a query equal to "price[lte]=10"', () => {
        const param = new SpiderRangeParam('price', SpiderRangeOperator.lte, 10);

        param.query.should.equal('price[lte]=10');
    });
    it('should create a query equal to "price[gt]=10"', () => {
        const param = new SpiderRangeParam('price', SpiderRangeOperator.gt, 10);

        param.query.should.equal('price[gt]=10');
    });
    it('should create a query equal to "price[gte]=10"', () => {
        const param = new SpiderRangeParam('price', SpiderRangeOperator.gte, 10);

        param.query.should.equal('price[gte]=10');
    });
    it('should create a query equal to "price[between]=0..10"', () => {
        const param = new SpiderRangeParam('price', SpiderRangeOperator.between, 0, 10);

        param.query.should.equal('price[between]=0..10');
    });
});

describe('Testing SpiderSortParam', () => {
    it('should create a query equal to "order[name]=asc"', () => {
        const param = new SpiderSortParam('name', SpiderSortValue.asc);

        param.query.should.equal('order[name]=asc');
    });
    it('should create a query equal to "order[name]=desc"', () => {
        const param = new SpiderSortParam('name', SpiderSortValue.desc);

        param.query.should.equal('order[name]=desc');
    });
});

describe('Testing SpiderPageIdxParam', () => {
    it('should create a query equal to "page=2"', () => {
        const param = new SpiderPageIdxParam(2);

        param.query.should.equal('page=2');
    });
    it('should create a query equal to "_page=42"', () => {
        const param = new SpiderPageIdxParam(42, '_page');

        param.query.should.equal('_page=42');
    });
});

describe('Testing SpiderPageSizeParam', () => {
    it('should create a query equal to "itemsPerPage=5"', () => {
        const param = new SpiderPageSizeParam(5);

        param.query.should.equal('itemsPerPage=5');
    });
    it('should create a query equal to "collectionSize=42"', () => {
        const param = new SpiderPageSizeParam(42, 'collectionSize');

        param.query.should.equal('collectionSize=42');
    });
});

describe('Testing SpiderPaginationParam', () => {
    it('should create a query equal to "pagination=true"', () => {
        const param = new SpiderPaginationParam();

        param.query.should.equal('pagination=true');
    });
    it('should create a query equal to "collectionSize=42"', () => {
        const param = new SpiderPaginationParam(false, 'pagination_enable');

        param.query.should.equal('pagination_enable=false');
    });
});