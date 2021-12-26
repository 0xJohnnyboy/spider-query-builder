import * as chai from 'chai';
import {
    SpdrDateOperator,
    SpdrDate,
    SpdrExists,
    SpdrPageIdx,
    SpdrPageSize,
    SpdrRangeOperator,
    SpdrRange,
    SpdrSearch,
    SpdrOrder,
    SpdrOrderOperator,
    SpdrPagination
} from "../src";

chai.should();

describe('Testing SpdrExists', () => {
    it("should create a query equal to 'exists[isActive]=true'", () => {
        const param = new SpdrExists('isActive', true);

        param.query.should.equal('exists[isActive]=true');
    });
})

describe('Testing SpdrSearch', () => {
    it("should create a query equal to 'name=John Doe'", () => {
        const param = new SpdrSearch('name', ['John Doe']);

        param.query.should.equal('name=John Doe');
    });
    it("should create the query equal to 'name[]=John Doe&name[]=Jane Doe'", () => {
        const param = new SpdrSearch('name', ['John Doe', 'Jane Doe']);

        param.query.should.equal('name[]=John Doe&name[]=Jane Doe');
    });
});

describe('Testing SpdrDate', () => {
    it('should create a query equal to "addedAt[after]=date" with date being today formatted as yyy-mm-dd', () => {
        const date: Date = new Date();
        const isoString = date.toISOString().slice(0, 10);
        const param = new SpdrDate('addedAt', SpdrDateOperator.after, date);

        param.query.should.equal(`addedAt[after]=${isoString}`);
    });
    it('should create a query equal to "addedAt[strictly_after]=date" with date being today formatted as yyy-mm-dd', () => {
        const date: Date = new Date();
        const isoString = date.toISOString().slice(0, 10);
        const param = new SpdrDate('addedAt', SpdrDateOperator.strictlyAfter, date);

        param.query.should.equal(`addedAt[strictly_after]=${isoString}`);
    });
    it('should create a query equal to "addedAt[before]=date" with date being today formatted as yyy-mm-dd', () => {
        const date: Date = new Date();
        const isoString = date.toISOString().slice(0, 10);
        const param = new SpdrDate('addedAt', SpdrDateOperator.before, date);

        param.query.should.equal(`addedAt[before]=${isoString}`);
    });
    it('should create a query equal to "addedAt[strictly_before]=date" with date being today formatted as yyy-mm-dd', () => {
        const date: Date = new Date();
        const isoString = date.toISOString().slice(0, 10);
        const param = new SpdrDate('addedAt', SpdrDateOperator.strictlyBefore, date);

        param.query.should.equal(`addedAt[strictly_before]=${isoString}`);
    });
});

describe('Testing SpdrRange', () => {
    it('should create a query equal to "price[lt]=10"', () => {
        const param = new SpdrRange('price', SpdrRangeOperator.lt, 10);

        param.query.should.equal('price[lt]=10');
    });
    it('should create a query equal to "price[lte]=10"', () => {
        const param = new SpdrRange('price', SpdrRangeOperator.lte, 10);

        param.query.should.equal('price[lte]=10');
    });
    it('should create a query equal to "price[gt]=10"', () => {
        const param = new SpdrRange('price', SpdrRangeOperator.gt, 10);

        param.query.should.equal('price[gt]=10');
    });
    it('should create a query equal to "price[gte]=10"', () => {
        const param = new SpdrRange('price', SpdrRangeOperator.gte, 10);

        param.query.should.equal('price[gte]=10');
    });
    it('should create a query equal to "price[between]=0..10"', () => {
        const param = new SpdrRange('price', SpdrRangeOperator.between, 0, 10);

        param.query.should.equal('price[between]=0..10');
    });
});

describe('Testing SpdrOrder', () => {
    it('should create a query equal to "order[name]=asc"', () => {
        const param = new SpdrOrder('name', SpdrOrderOperator.asc);

        param.query.should.equal('order[name]=asc');
    });
    it('should create a query equal to "order[name]=desc"', () => {
        const param = new SpdrOrder('name', SpdrOrderOperator.desc);

        param.query.should.equal('order[name]=desc');
    });
});

describe('Testing SpdrPageIdx', () => {
    it('should create a query equal to "page=2"', () => {
        const param = new SpdrPageIdx(2);

        param.query.should.equal('page=2');
    });
    it('should create a query equal to "_page=42"', () => {
        const param = new SpdrPageIdx(42, '_page');

        param.query.should.equal('_page=42');
    });
});

describe('Testing SpdrPageSize', () => {
    it('should create a query equal to "itemsPerPage=5"', () => {
        const param = new SpdrPageSize(5);

        param.query.should.equal('itemsPerPage=5');
    });
    it('should create a query equal to "collectionSize=42"', () => {
        const param = new SpdrPageSize(42, 'collectionSize');

        param.query.should.equal('collectionSize=42');
    });
});

describe('Testing SpdrPagination', () => {
    it('should create a query equal to "pagination=true"', () => {
        const param = new SpdrPagination();

        param.query.should.equal('pagination=true');
    });
    it('should create a query equal to "collectionSize=42"', () => {
        const param = new SpdrPagination(false, 'pagination_enable');

        param.query.should.equal('pagination_enable=false');
    });
});