import * as chai from 'chai';
import {
    SpdrDateOperator,
    SpdrDate,
    SpdrExists,
    SpdrPageIdx,
    SpdrPageSize,
    SpdrQueryBuilder,
    SpdrRangeOperator,
    SpdrRange,
    SpdrSearch,
    SpdrOrder,
    SpdrOrderOperator
} from "../src";

chai.should();

describe('Testing SpdrQueryBuilder', () => {
    it('should build a query equal to exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10', () => {
        const date: Date = new Date();
        const isoString = date.toISOString().slice(0, 10);

        const params = [
            new SpdrExists('isActive', true),
            new SpdrSearch('name', ['John Doe', 'Jane Doe']),
            new SpdrDate('addedAt', SpdrDateOperator.strictlyBefore, date),
            new SpdrRange('orders', SpdrRangeOperator.between, 0, 10),
            new SpdrOrder('name', SpdrOrderOperator.asc),
            new SpdrPageIdx(2, '_page'),
            new SpdrPageSize(10)
        ]

        const expectedQuery = `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10`;

        const qb = new SpdrQueryBuilder(params);

        qb.query.should.equal(expectedQuery);
    });
    it('should append "order[name]=asc" to "name=John Doe"', () => {
        const qb = new SpdrQueryBuilder([
            new SpdrSearch('name', ['John Doe'])
        ]);
        const param = new SpdrOrder('name', SpdrOrderOperator.asc);

        qb.append(param);

        qb.query.should.equal('name=John Doe&order[name]=asc');
    });
})