import * as chai from 'chai';
import {SpdrDateOperator, SpdrOrderOperator, SpdrQueryBuilder, SpdrRangeOperator} from "../src";
import {SpdrParamType} from "../src/spdrQueryBuilder";

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

    it('should build with operand setting a query equal to exists[isActive]=true&&name[]=John Doe&&name[]=Jane Doe', () => {

        const qb = new SpdrQueryBuilder('&&')

        qb
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])

        const expectedQuery = `exists[isActive]=true&&name[]=John Doe&&name[]=Jane Doe`;

        qb.query.should.equal(expectedQuery);
    });

    it('should build with operand setting a query equal to exists[isActive]=true&&name[]=John Doe&&name[]=Jane Doe', () => {

        const qb = new SpdrQueryBuilder()

        qb
            .operand('&&')
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])

        const expectedQuery = `exists[isActive]=true&&name[]=John Doe&&name[]=Jane Doe`;

        qb.query.should.equal(expectedQuery);
    });

    it('should build with search operand setting a query equal to exists[isActive]=true&&name[]=John Doe||name[]=Jane Doe', () => {

        const qb = new SpdrQueryBuilder()

        qb
            .operand('&&')
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'], '||')

        const expectedQuery = `exists[isActive]=true&&name[]=John Doe||name[]=Jane Doe`;

        qb.query.should.equal(expectedQuery);
    });

    it('should build with operand switching a query equal to exists[isActive]=true&name=John Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10', () => {
        const qb = new SpdrQueryBuilder('&&')

        qb
            .exists('isActive', true)
            .search('name', ['John Doe'])
            .operand('!!')
            .date('addedAt', SpdrDateOperator.strictlyBefore, date)
            .operand('&')
            .range('orders', SpdrRangeOperator.between, 0, 10)

        const expectedQuery = `exists[isActive]=true&name=John Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10`;

        qb.query.should.equal(expectedQuery);
    });

    it('should build a query and change only the sort params', () => {
            const expectedQuery = `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[lastname]=desc&_page=2&itemsPerPage=10`;

            const qb = new SpdrQueryBuilder()
                .exists('isActive', true)
                .search('name', ['John Doe', 'Jane Doe'])
                .date('addedAt', SpdrDateOperator.strictlyBefore, date)
                .range('orders', SpdrRangeOperator.between, 0, 10)
                .order('name', SpdrOrderOperator.asc)
                .pageIndex(2, '_page')
                .pageSize(10)
                .clear(SpdrParamType.sort)
                .order('lastname', SpdrOrderOperator.desc)

            qb.query.should.equal(expectedQuery);
        });

    it('should build a query and change only the pagination params', () => {
        const expectedQuery = `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&pagination=true&_page=3&itemsPerPage=20`;

        const qb = new SpdrQueryBuilder()
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', SpdrDateOperator.strictlyBefore, date)
            .range('orders', SpdrRangeOperator.between, 0, 10)
            .order('name', SpdrOrderOperator.asc)
            .pageIndex(2, '_page')
            .pageSize(10)
            .clear(SpdrParamType.pagination)
            .enablePagination()
            .pageIndex(3, '_page')
            .pageSize(20)

        qb.query.should.equal(expectedQuery);
    });

    it('should build a query and change only other params (not pagination nor sort)', () => {
        const expectedQuery = `exists[isActive]=true&order[name]=asc&_page=2&itemsPerPage=10`;

        const qb = new SpdrQueryBuilder()
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', SpdrDateOperator.strictlyBefore, date)
            .range('orders', SpdrRangeOperator.between, 0, 10)
            .order('name', SpdrOrderOperator.asc)
            .pageIndex(2, '_page')
            .pageSize(10)
            .clear(SpdrParamType.param)
            .exists('isActive')

        qb.query.should.equal(expectedQuery);
    });

    it('should build a query and clear it completely', () => {
        const expectedQuery = ``;

        const qb = new SpdrQueryBuilder()
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', SpdrDateOperator.strictlyBefore, date)
            .range('orders', SpdrRangeOperator.between, 0, 10)
            .order('name', SpdrOrderOperator.asc)
            .pageIndex(2, '_page')
            .pageSize(10)
            .clear()

        qb.query.should.equal(expectedQuery);
    });

    it('should build a query and remove only the search on the name', () => {
        const expectedQuery = `exists[isActive]=true&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10`;

        const qb = new SpdrQueryBuilder()
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', SpdrDateOperator.strictlyBefore, date)
            .range('orders', SpdrRangeOperator.between, 0, 10)
            .order('name', SpdrOrderOperator.asc)
            .pageIndex(2, '_page')
            .pageSize(10);

        qb.remove('name', SpdrParamType.param);

        qb.query.should.equal(expectedQuery);
    });

    it('should build a query and remove the search on the name and the order filter on the name too', () => {
        const expectedQuery = `exists[isActive]=true&addedAt[strictly_before]=${isoString}&orders[between]=0..10&_page=2&itemsPerPage=10`;

        const qb = new SpdrQueryBuilder()
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', SpdrDateOperator.strictlyBefore, date)
            .range('orders', SpdrRangeOperator.between, 0, 10)
            .order('name', SpdrOrderOperator.asc)
            .pageIndex(2, '_page')
            .pageSize(10);

        qb.remove('name');

        qb.query.should.equal(expectedQuery);
    });

    it('should build 3 queries with the same instance and retrieve them in the history', () => {
        const expectedQuery1 = `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe`;
        const expectedQuery2 = `name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}`;
        const expectedQuery3 = `name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10`;

        const qb = new SpdrQueryBuilder()
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])

        qb.query.should.equal(expectedQuery1);

        qb
            .clear()
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', SpdrDateOperator.strictlyBefore, date)

        qb.query.should.equal(expectedQuery2);
        qb.previousQuery.should.equal(expectedQuery1);

        qb.clear()
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', SpdrDateOperator.strictlyBefore, date)
            .range('orders', SpdrRangeOperator.between, 0, 10)

        qb.query.should.equal(expectedQuery3);
        qb.history.should.deep.equal([expectedQuery1, expectedQuery2]);
    });

    it('should build 3 queries with the same instance, and clear the history', () => {
        const expectedQuery = `name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10`;

        const qb = new SpdrQueryBuilder()
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])
            .clear()
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', SpdrDateOperator.strictlyBefore, date).clear()
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', SpdrDateOperator.strictlyBefore, date)
            .range('orders', SpdrRangeOperator.between, 0, 10)
            .clearHistory();

        qb.query.should.equal(expectedQuery);
        qb.history.should.deep.equal([]);
    });
})