import * as chai from 'chai';
import {
    SpiderDateOperator,
    SpiderDateParam,
    SpiderExistsParam,
    SpiderQueryBuilder,
    SpiderRangeOperator,
    SpiderRangeParam,
    SpiderSearchParam,
    SpiderSortParam,
    SpiderSortValue
} from "../src";

const should = chai.should();

describe('Testing SpiderQueryBuilder', () => {
    it('should build a query equal to', () => {
        const date: Date = new Date();
        const isoString = date.toISOString().slice(0, 10);

        const params = [
            new SpiderExistsParam('isActive', true),
            new SpiderSearchParam('name', ['John Doe', 'Jane Doe']),
            new SpiderDateParam('addedAt', SpiderDateOperator.strictlyBefore, date),
            new SpiderRangeParam('orders', SpiderRangeOperator.between, 0, 10),
            new SpiderSortParam('name', SpiderSortValue.asc)
        ]

        const expectedQuery = `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc`;

        const qb = new SpiderQueryBuilder(params);

        qb.query.should.equal(expectedQuery);
    });
    it('should append "order[name]=asc" to "name=John Doe"', () => {
        const qb = new SpiderQueryBuilder([
            new SpiderSearchParam('name', 'John Doe')
        ]);
        const param = new SpiderSortParam('name', SpiderSortValue.asc);

        qb.append(param);

        qb.query.should.equal('name=John Doe&order[name]=asc');
    });
})