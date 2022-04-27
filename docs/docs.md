# Spider Query Builder

---
- [Usage](#usage)
- [Filters Provided](#filters-provided)
- [Build the query](#build-the-query)
- [Extending the library](#extending-the-library)
---

## Usage
Get a properly formatted query for your API platform backend by using **SpdrQueryBuilder** and its methods.
This library helps you type and validate your query for basic filters. Some of them like "Boolean" or "Numeric" can be done with `SpdrSearch` since they have the same format.

You can easily build your own types by extending `SpdrParam`, or by implementing `SpdrParamInterface`. Like if you need ElasticSearch specific filters or else.

All the following examples are using a new instance of the **SpdrQueryBuilder**.

```typescript
import { SpdrQueryBuilder } from '@sonicfury/spdr-query-builder';

const qb = new SpdrQueryBuilder();
```
---
## Filters provided
- [exists](#exists)
- [search](#search)
- [date](#date)
- [range](#range)
- [order](#order)
- [pagination](#enable)
- [pageIndex](#page-index)
- [pageSize](#page-size)

### Exists
[API Platform: Exists Filter](https://api-platform.com/docs/core/filters/#exists-filter)

```typescript
qb.exists('transportFees');
```
`qb.query` equals `'exists[transportFees]=true'`

This query will return all items where transport fees is not null.
It builds the param with the `true` value by default, but you can set it to false.
```typescript
qb.exists('transportFees', false);
```
`qb.query` equals `'exists[transportFees]=false'`
### Search
[API Platform: Search Filter](https://api-platform.com/docs/core/filters/#search-filter)

```typescript
qb.search('description', ['shirt']);
```
`qb.query` equals `description=shirt`

As you can see, the second parameter is an array of values. The behaviour in case of multiple values is the following:

```typescript
qb.search('color', ['blue', 'red', 'green'])
```
`qb.query` equals `color[]=blue&color[]=red&color[]=green`

This behaviour is the default for SQL 'IN' equivalent, but only works with the `exact` search strategy (see API platform docs by following the provided link for further information).

Also, if you have a custom filter that needs a custom operand for multiple values ('OR' case), you can pass it as third parameter:

```typescript
qb.search('color', ['blue', 'red', 'green'], '||');
```

`qb.query` equals `color[]=blue||color[]=red||color[]=green`

That won't affect the query builder's global operand.

### Date
[API Platform: Date Filter](https://api-platform.com/docs/core/filters/#date-filter)

```typescript
import {SpdrDateOperator} from "./spdrParam";

const date = new Date('12/25/2022') 
qb.date('addedAt', SpdrDateOperator.after, date);
```
`qb.query` equals `addedAt[after]=2022-12-25`
This will return all items added after 12/25/2022.

There are 4 operators that you can use.

```typescript
SpdrDateOperator.before;
SpdrDateOperator.after;
SpdrDateOperator.strictlyBefore;
SpdrDateOperator.strictlyAfter;
```
### Range
[API Platform: Range Filter](https://api-platform.com/docs/core/filters/#range-filter)

```typescript
import {SpdrRangeOperator} from "./spdrParam";

qb.range('price', SpdrRangeOperator.lt, 10);
```
`qb.query` equals `price[lt]=10`

This will return all items with price lower than 10.
There are 5 operators that you can use.

```typescript
SpdrRangeOperator.lt;
SpdrRangeOperator.lte; // 'lower than or equal'
SpdrRangeOperator.gt;
SpdrRangeOperator.gte; // 'greater than or equal'
SpdrRangeOperator.between
```

For `SpdrRangeOperator.between` you have to provide a second value.

```typescript
qb.range('price', SpdrRangeOperator.between, 10, 100);
```
`qb.query` equals `price[between]=10..100`

### Order
[API Platform: Order Filter](https://api-platform.com/docs/core/filters/#ordering-filter-sorting)

```typescript
import {SpdrOrderOperator} from "./spdrParam";

qb.order('name', SpdrOrderOperator.asc);
```
`qb.query` equals `order[name]=asc`

You can use the `SpdrOrderOperator.desc` to sort descending.

### Pagination
You can handle pagination too.
#### Enable
[API Platform: Let client enable pagination](https://api-platform.com/docs/core/pagination/#disabling-the-pagination-client-side-globally)

```typescript
qb.pagination();
```
`qb.query` equals `pagination=true`

You can disable pagination by passing `false` as the first argument.
If you want to use a custom parameter name, just pass it as the second argument.

```typescript
qb.pagination(false, 'enable_pagination');
```
`qb.query` equals `enable_pagination=false`

#### Page index
[API Platform: Define page index client-side](https://api-platform.com/docs/core/pagination/#pagination)

```typescript
qb.pageIndex(14);
```
`qb.query` equals `page=14`

```typescript
qb.pageIndex(14, 'offset');
```
`qb.query` equals `offset=14`

#### Page size
[API Platform: Define items per page client-side](https://api-platform.com/docs/core/pagination/#changing-the-number-of-items-per-page-client-side)

```typescript
qb.pageSize(15);
```
`qb.query` equals `itemsPerPage=15`

```typescript
qb.pageSize(15, 'limit')
```
`qb.query` equals `limit=15`

---

## Build the query

The query builder takes as many parameters as you want and builds automatically a query string that you can append to your API url.

```typescript
import {SpdrQueryBuilder} from "./spdrQueryBuilder";

const qb = new SpdrQueryBuilder()
    .exists('isActive', true)
    .search('name', ['John Doe', 'Jane Doe'])
    .date('addedAt', SpdrDateOperator.strictlyBefore, date)
    .range('orders', SpdrRangeOperator.between, 0, 10)
    .order('name', SpdrOrderOperator.asc)
    .pageIndex(2, '_page')
    .pageSize(10);

// for example
this.domainService.get(qb.query);
```

`qb.query` equals `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10`

### Define a custom operand
If you need a custom operand to be applied to your query, you have 2 ways to set it.
First way is in the constructor:

```typescript
const CUSTOM_OPERAND = '&&';

const qb = new SpdrQueryBuilder(CUSTOM_OPERAND);

qb
    .exists('isActive', true)
    .search('name', ['John Doe', 'Jane Doe'])

```
`qb.query` equals `exists[isActive]=true&&name[]=John Doe&&name[]=Jane Doe`

Second way is the `setOperand` method:

```typescript
const qb = new SpdrQueryBuilder()

qb
    .setOperand('&&')
    .exists('isActive', true)
    .search('name', ['John Doe', 'Jane Doe'])
```
`qb.query` equals `exists[isActive]=true&&name[]=John Doe&&name[]=Jane Doe`

You can use this method multiple times:

```typescript
const qb = new SpdrQueryBuilder('&&')

qb
    .exists('isActive', true)
    .search('name', ['John Doe'])
    .setOperand('!!')
    .date('addedAt', SpdrDateOperator.strictlyBefore, date)
    .setOperand('&')
    .range('orders', SpdrRangeOperator.between, 0, 10)

```
`qb.query` equals `exists[isActive]=true&&name=John Doe!!addedAt[strictly_before]=${isoString}&orders[between]=0..10`

---

## Extending the library
Only basic default filters are supported but you can easily create your own `SpdrParam` by extending `SpdrParam` abstract
class. Plus, the `SpdrQueryBuilder` expects an implementation of the `SpdrParamInterface` so you can even create
your own abstract class that will suit you best.
You can either append your custom param directly to the `SpdrQueryBuilder` or you can extend the query builder.
Use the `append()` method in the first case:

```typescript
import {SpdrOperator, SpdrParamInterface} from "./spdrParam";

class MyCustomParam implements SpdrParamInterface {
    query: string;
    operator: SpdrOperator = SpdrOperator.equals;

    constructor(property: string, value: string) {
        this.query = `${property}${this.operator}${value}`;
    }
}

const qb = new SpdrQueryBuilder();

qb.append(
    new MyCustomParam('myCustomParam', 'myValue')
);
```
`qb.query` equals `myCustomParam=myValue`
