# Spider Query Builder

---
- [Usage](#usage)
- [Types Provided](#types-provided)
- [Build the query](#build-the-query)
- [Extending the library](#extending-the-library)
---

## Usage
Build SpdrParams from your custom frontend filters and pass them to the query builder to get a properly formatted query for your API platform backend.
This library helps you type and validate your query for basic filters. Some of them like "Boolean" or "Numeric" can be done with `SpdrSearch` since they have the same format.

You can easily build your own types by extending `SpdrParam`, or by implementing `SpdrParamInterface`. Like if you need ElasticSearch specific filters or else.

---
## Types provided
- [SpdrExists](#exists)
- [SpdrSearch](#search)
- [SpdrDate](#date)
- [SpdrRange](#range)
- [SpdrOrder](#order)
- [SpdrPagination](#enable)
- [SpdrPageIdx](#page-index)
- [SpdrPageSize](#page-size)

### Exists
[API Platform: Exists Filter](https://api-platform.com/docs/core/filters/#exists-filter)

```typescript
import {SpdrExists} from "./spdrParam";

let p = new SpdrExists('transportFees');
```
`p.query` equals `'exists[transportFees]=true'`

This query will return all items where transport fees is not null.
SpdrExists build the param with the `true` value by default, but you can set it to false.
```typescript
p = new SpdrExists('transportFees', false);
```
`p.query` equals `'exists[transportFees]=false'`
### Search
[API Platform: Search Filter](https://api-platform.com/docs/core/filters/#search-filter)

```typescript
import {SpdrSearch} from "./spdrParam";

let p = new SpdrSearch('description', ['shirt']);
```
`p.query` equals `description=shirt`

As you can see, the second parameter is an array of values. The behaviour in case of multiple values is the following:

```typescript
p = new SpdrSearch('color', ['blue', 'red', 'green'])
```
`p.query` equals `color[]=blue&color[]=red&color[]=green`

This behaviour is the default for SQL 'IN' equivalent, but only works with the `exact` search strategy (see API platform docs by following the provided link for further information).
### Date
[API Platform: Date Filter](https://api-platform.com/docs/core/filters/#date-filter)

```typescript
import {SpdrDate, SpdrDateOperator} from "./spdrParam";

const date = new Date('12/25/2022')
let p = new SpdrDate('addedAt', SpdrDateOperator.after, date);
```
`p.query` equals `addedAt[after]=2022-12-25`
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
import {SpdrRange, SpdrRangeOperator} from "./spdrParam";

let p = new SpdrRange('price', SpdrRangeOperator.lt, 10);
```
`p.query` equals `price[lt]=10`

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
p = new SpdrRange('price', SpdrRangeOperator.between, 10, 100);
```
`p.query` equals `price[between]=10..100`

### Order
[API Platform: Order Filter](https://api-platform.com/docs/core/filters/#ordering-filter-sorting)

```typescript
import {SpdrOrder, SpdrOrderOperator} from "./spdrParam";

let p = new SpdrOrder('name', SpdrOrderOperator.asc);
```
`p.query` equals `order[name]=asc`

You can use the `SpdrOrderOperator.desc` to sort descending.

### Pagination
You can handle pagination too.
#### Enable
[API Platform: Let client enable pagination](https://api-platform.com/docs/core/pagination/#disabling-the-pagination-client-side-globally)

```typescript
import {SpdrPagination} from "./spdrParam";

let p = new SpdrPagination();
```
`p.query` equals `pagination=true`

You can disable pagination by passing `false` as the first argument.
If you want to use a custom parameter name, just pass it as the second argument.

```typescript
p = new SpdrPagination(false, 'enable_pagination');
```
`p.query` equals `enable_pagination=false`

#### Page index
[API Platform: Define page index client-side](https://api-platform.com/docs/core/pagination/#pagination)

```typescript
import {SpdrPageIdx} from "./spdrParam";

let p = new SpdrPageIdx(14);
```
`p.query` equals `page=14`

```typescript
p = new SpdrPageIdx(14, 'offset');
```
`p.query` equals `offset=14`

#### Page size
[API Platform: Define items per page client-side](https://api-platform.com/docs/core/pagination/#changing-the-number-of-items-per-page-client-side)

```typescript
import {SpdrPageSize} from "./spdrParam";

let p = SpdrPageSize(15);
```
`p.query` equals `itemsPerPage=15`

```typescript
p = new SpdrPageSize(15, 'limit')
```
`p.query` equals `limit=15`

---

## Build the query

The query builder takes an array of SpdrParam as argument and builds a query string that you can append to your API url.

```typescript
import {SpdrQueryBuilder} from "./spdrQueryBuilder";

const params = [
    new SpdrExists('isActive', true),
    new SpdrSearch('name', ['John Doe', 'Jane Doe']),
    new SpdrRange('orders', SpdrRangeOperator.between, 0, 10),
    new SpdrOrder('name', SpdrOrderOperator.asc),
    new SpdrPageIdx(2, '_page'),
    new SpdrPageSize(10)
]
const qb = new SpdrQueryBuilder(params);
```

`qb.query` equals `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10`

### Add params manually

If you want, you can use the `append()` method to append manually a SpdrParam to the query.

```typescript

const newParam = SpdrSearch('middleName', ['karl', 'carl']);

qb.append(newParam);
```
`qb.query` equals `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10&middleName[]=karl&middleName[]=carl`

### Define a custom operand
Maybe you have custom filters with custom operands.
Say you have defined a custom OR filter, with a double pipe `||` as operand. Just pass it as a second argument.

```typescript
const OR = '||';

const params = [
    new SpdrSearch('firstname', 'jane'),
    new SpdrSearch('firstname', 'john')
];

const qb = new SpdrQueryBuilder(params, OR);
```
`qb.query` equals `firstname=jane||firstname=john`

Sometimes you just need a custom operand for one param. Pass it to the `append()` method:

```typescript
const CUSTOM_OPERAND = '++';
const p = new SpdrSearch('color', 'yellow');
qb.append(p, CUSTOM_OPERAND);
```
`qb.query` equals `firstname=jane||firstname=john++color=yellow`

---

## Extending the library
Only basic default filters are supported but you can easily create your own `SpdrParam` by extending `SpdrParam` abstract
class. Plus, the `SpdrQueryBuilder` expects an implementation of the `SpdrParamInterface` so you can even create
your own abstract class that will suit you best.
