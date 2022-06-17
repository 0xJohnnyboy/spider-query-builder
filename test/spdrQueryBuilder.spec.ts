import * as chai from 'chai';
import {
    SpdrQueryBuilder,
    DateOperator,
    RangeOperator,
    OrderOperator,
    Operator
} from "../src";
import {SpdrParamType} from "../src/spdrQueryBuilder";

chai.should();

const date: Date = new Date();
const isoString = date.toISOString().slice(0, 10);
const fakeLocalStorage: Map<string, any> = new Map<string, any>()

describe('Testing SpdrQueryBuilder', () => {
    it('should build a query equal to exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10',
        () => {
            const expectedQuery = `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10`;

            const qb = new SpdrQueryBuilder()
                .exists('isActive', true)
                .search('name', ['John Doe', 'Jane Doe'])
                .date('addedAt', DateOperator.strictlyBefore, date)
                .range('orders', RangeOperator.between, 0, 10)
                .order('name', OrderOperator.asc)
                .pageIndex(2, '_page')
                .pageSize(10);

            qb.query.should.equal(expectedQuery);
        });

    it('should append "order[name]=asc" to "name=John Doe"', () => {

        const qb = new SpdrQueryBuilder()
            .search('name', ['John Doe'])

        const expectedQuery = 'name=John Doe';
        qb.query.should.equal(expectedQuery);

        qb.order('name', OrderOperator.asc);

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
            .date('addedAt', DateOperator.strictlyBefore, date)
            .operand('&')
            .range('orders', RangeOperator.between, 0, 10)

        const expectedQuery = `exists[isActive]=true&name=John Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10`;

        qb.query.should.equal(expectedQuery);
    });

    it('should build a query and change only the sort params', () => {
        const expectedQuery = `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[lastname]=desc&_page=2&itemsPerPage=10`;

        const qb = new SpdrQueryBuilder()
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', DateOperator.strictlyBefore, date)
            .range('orders', RangeOperator.between, 0, 10)
            .order('name', OrderOperator.asc)
            .pageIndex(2, '_page')
            .pageSize(10)
            .clear(SpdrParamType.sort)
            .order('lastname', OrderOperator.desc)

        qb.query.should.equal(expectedQuery);
    });

    it('should build a query and change only the pagination params', () => {
        const expectedQuery = `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&pagination=true&_page=3&itemsPerPage=20`;

        const qb = new SpdrQueryBuilder()
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', DateOperator.strictlyBefore, date)
            .range('orders', RangeOperator.between, 0, 10)
            .order('name', OrderOperator.asc)
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
            .date('addedAt', DateOperator.strictlyBefore, date)
            .range('orders', RangeOperator.between, 0, 10)
            .order('name', OrderOperator.asc)
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
            .date('addedAt', DateOperator.strictlyBefore, date)
            .range('orders', RangeOperator.between, 0, 10)
            .order('name', OrderOperator.asc)
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
            .date('addedAt', DateOperator.strictlyBefore, date)
            .range('orders', RangeOperator.between, 0, 10)
            .order('name', OrderOperator.asc)
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
            .date('addedAt', DateOperator.strictlyBefore, date)
            .range('orders', RangeOperator.between, 0, 10)
            .order('name', OrderOperator.asc)
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
            .date('addedAt', DateOperator.strictlyBefore, date)

        qb.query.should.equal(expectedQuery2);
        qb.previousQuery.should.equal(expectedQuery1);

        qb.clear()
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', DateOperator.strictlyBefore, date)
            .range('orders', RangeOperator.between, 0, 10)

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
            .date('addedAt', DateOperator.strictlyBefore, date).clear()
            .search('name', ['John Doe', 'Jane Doe'])
            .date('addedAt', DateOperator.strictlyBefore, date)
            .range('orders', RangeOperator.between, 0, 10)
            .clearHistory();

        qb.query.should.equal(expectedQuery);
        qb.history.should.deep.equal([]);
    });

    it('should get the 3 params types in 3 arrays', () => {
        const qb = new SpdrQueryBuilder()
            .exists('isActive', true)
            .search('name', ['John Doe', 'Jane Doe'])
            .order('name', OrderOperator.asc)
            .pageIndex(2, '_page')
            .pageSize(10);

        const params = qb.params;
        const sortParams = qb.sortParams;
        const paginationParams = qb.paginationParams;

        params.length.should.equal(2);
        sortParams.length.should.equal(1);
        paginationParams.length.should.equal(2);

        fakeLocalStorage.set('params', JSON.stringify(params));
        fakeLocalStorage.set('sortParams', JSON.stringify(sortParams));
        fakeLocalStorage.set('paginationParams', JSON.stringify(paginationParams));
    });

    it('should set provided params and return the expected query string', () => {
        const expected = `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe`;
        const jsonParams = fakeLocalStorage.get('params');
        const params = JSON.parse(jsonParams);
        const qb = new SpdrQueryBuilder();

        qb.params = params;

        qb.query.should.equal(expected);

        fakeLocalStorage.delete('params');
    });

    it('should set provided sort params and return the expected query string', () => {
        const expected = `order[name]=asc`;
        const jsonParams = fakeLocalStorage.get('sortParams');
        const params = JSON.parse(jsonParams);
        const qb = new SpdrQueryBuilder();

        qb.sortParams = params;

        qb.query.should.equal(expected);

        fakeLocalStorage.delete('sortParams');
    });

    it('should set provided pagination params and return the expected query string', () => {
        const expected = `_page=2&itemsPerPage=10`;
        const jsonParams = fakeLocalStorage.get('paginationParams');
        const params = JSON.parse(jsonParams);
        const qb = new SpdrQueryBuilder();

        qb.paginationParams = params;

        qb.query.should.equal(expected);

        fakeLocalStorage.delete('paginationParams');
    });

    it('should append a SpdrParamInterface to a query builder',  () => {
        const qb = new SpdrQueryBuilder();
        const param = {
            query: 'name[]=John Doe&name[]=Jane Doe',
            property: 'name',
            operator: Operator.equals,
            value: [ 'John Doe', 'Jane Doe' ]
        };

        qb['_append'](param);
        qb.query.should.equal('name[]=John Doe&name[]=Jane Doe');
    });

    it('should append a param to a query builder',  () => {
        const qb = new SpdrQueryBuilder()
            .search('name', ['John Doe', 'Jane Doe']);

        const param = JSON.parse(JSON.stringify(qb.params))[0];

        qb.clear();
        qb['_append'](param);
        qb.query.should.equal('name[]=John Doe&name[]=Jane Doe');
    });
})