import * as chai from 'chai';
import {
    SpdrDateOperator,
    SpdrQueryBuilder,
    SpdrRangeOperator,
    SpdrOrderOperator
} from "../src";

chai.should();

const date: Date = new Date();
const isoString = date.toISOString().slice(0, 10);

describe('Testing SpdrQueryBuilder', () => {
    it('should build a query equal to exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10',
        () => {
            const expectedQuery = `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10`;

            const qb = new SpdrQueryBuilder()
                .exists('isActive', true)
                .search('name', ['John Doe', 'Jane Doe'])
                .date('addedAt', SpdrDateOperator.strictlyBefore, date)
                .range('orders', SpdrRangeOperator.between, 0, 10)
                .order('name', SpdrOrderOperator.asc)
                .pageIndex(2, '_page')
                .pageSize(10);

            qb.query.should.equal(expectedQuery);
        });
    it('should append "order[name]=asc" to "name=John Doe"', () => {

        const qb = new SpdrQueryBuilder()
            .search('name', ['John Doe'])

        const expectedQuery = 'name=John Doe';
        qb.query.should.equal(expectedQuery);

        qb.order('name', SpdrOrderOperator.asc);

        qb.query.should.equal('name=John Doe&order[name]=asc');
    });

    it('should build a query equal to exists[isActive]=true&&name[]=John Doe&&name[]=Jane Doe', () => {

        const qb = new SpdrQueryBuilder('&&')

        qb
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])

        const expectedQuery = `exists[isActive]=true&&name[]=John Doe&&name[]=Jane Doe`;

        qb.query.should.equal(expectedQuery);
    });

    it('should build a query equal to exists[isActive]=true&&name[]=John Doe&&name[]=Jane Doe', () => {

        const qb = new SpdrQueryBuilder()

        qb
            .setOperand('&&')
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])

        const expectedQuery = `exists[isActive]=true&&name[]=John Doe&&name[]=Jane Doe`;

        qb.query.should.equal(expectedQuery);
    });

    it('should build a query equal to exists[isActive]=true&&name[]=John Doe||name[]=Jane Doe', () => {

        const qb = new SpdrQueryBuilder()

        qb
            .setOperand('&&')
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'], '||')

        const expectedQuery = `exists[isActive]=true&&name[]=John Doe||name[]=Jane Doe`;

        qb.query.should.equal(expectedQuery);
    });

    it('should build a query equal to exists[isActive]=true&&name=John Doe!!addedAt[strictly_before]=${isoString}&orders[between]=0..10', () => {
        const qb = new SpdrQueryBuilder('&&')

        qb
            .exists('isActive', true)
            .search('name', ['John Doe'])
            .setOperand('!!')
            .date('addedAt', SpdrDateOperator.strictlyBefore, date)
            .setOperand('&')
            .range('orders', SpdrRangeOperator.between, 0, 10)

        const expectedQuery = `exists[isActive]=true&&name=John Doe!!addedAt[strictly_before]=${isoString}&orders[between]=0..10`;

        qb.query.should.equal(expectedQuery);
    });
})