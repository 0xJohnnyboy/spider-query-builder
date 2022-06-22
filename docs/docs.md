# Spider Query Builder

---
- [Usage](#usage)
- [Filters Provided](#filters-provided)
- [Build the query](#build-the-query)
- [Extending the library](#extending-the-library)
---

## Usage
Get a properly formatted query for your API platform backend by using **SpdrQueryBuilder** and its methods.
This library helps you type and validate your query for basic filters. Some of them like "Boolean" or "Numeric" can be done with `qb.search()` since they have the same format.

You can easily build your own types by extending `SpdrParam`, or by implementing `SpdrParamInterface`. Like if you need ElasticSearch specific filters or else.

All the following examples are using a new instance of the **SpdrQueryBuilder**.

Params are splitted internally into **3 sections** so that you can reset them separately: **Params, Sort and Pagination**.
**Sort** and **Pagination** are *destructive*. It means that if you pass a sort on a same property, or if you set the page size 2 times in a row, it will **override the last param**.
This is way simpler to use since you usually don't want to sort twice on the same property, and you don't want to have multiple page size params in your query. You don't have to take care of the replacement yourself.
Note that only concerns sort and pagination. For now, **normal params are "manual"**.

```typescript
import { SpdrQueryBuilder } from '@sonicfury/spdr-query-builder';

const qb = new SpdrQueryBuilder();
```
---
## Filters provided
- Params
  - [exists](#exists)
  - [search](#search)
  - [date](#date)
  - [range](#range)
- Sort
  - [order](#order)
- Pagination
  - [enablePagination](#enable)
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
import {DateOperator} from "./spdrParam";

const date = new Date('12/25/2022') 
qb.date('addedAt', DateOperator.after, date);
```
`qb.query` equals `addedAt[after]=2022-12-25`
This will return all items added after 12/25/2022.

There are 4 operators that you can use.

```typescript
DateOperator.before;
DateOperator.after;
DateOperator.strictlyBefore;
DateOperator.strictlyAfter;
```
### Range
[API Platform: Range Filter](https://api-platform.com/docs/core/filters/#range-filter)

```typescript
import {RangeOperator} from "./spdrParam";

qb.range('price', RangeOperator.lt, 10);
```
`qb.query` equals `price[lt]=10`

This will return all items with price lower than 10.
There are 5 operators that you can use.

```typescript
RangeOperator.lt;
RangeOperator.lte; // 'lower than or equal'
RangeOperator.gt;
RangeOperator.gte; // 'greater than or equal'
RangeOperator.between
```

For `RangeOperator.between` you have to provide a second value.

```typescript
qb.range('price', RangeOperator.between, 10, 100);
```
`qb.query` equals `price[between]=10..100`

### Order
[API Platform: Order Filter](https://api-platform.com/docs/core/filters/#ordering-filter-sorting)

```typescript
import {OrderOperator} from "./spdrParam";

qb.order('name', OrderOperator.asc);
```
`qb.query` equals `order[name]=asc`

You can use the `OrderOperator.desc` to sort descending.

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
qb.enablePagination(false, 'enable_pagination');
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
    .date('addedAt', DateOperator.strictlyBefore, date)
    .range('orders', RangeOperator.between, 0, 10)
    .order('name', OrderOperator.asc)
    .pageIndex(2, '_page')
    .pageSize(10);

// for example
this.domainService.get(qb.query);
```

`qb.query` equals `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10`

### Clearing
You can remove all params matching a property by calling `qb.remove(property, type)` with property as a `string` and type as a `SpdrParamType`.
By passing only the property as a string, all params matching the property will be removed, no matter what their type is.
Passing a `SpdrParamType` lets you be more precise and remove only params matching the property of the passed type.

#### Example

```typescript

const qb = new SpdrQueryBuilder()
    .exists('isActive', true)
    .search('name', ['John Doe', 'Jane Doe'])
    .date('addedAt', DateOperator.strictlyBefore, date)
    .range('orders', RangeOperator.between, 0, 10)
    .order('name', OrderOperator.asc)
    .pageIndex(2, '_page')
    .pageSize(10);
```
At this point `qb.query` equals `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10`

- `qb.remove('name', SpdrParamType.param)` would get you `exists[isActive]=true&addedAt[strictly_before]=${isoString}&orders[between]=0..10&order[name]=asc&_page=2&itemsPerPage=10` . It has only removed the `search` filters on the 'name' property.
- `qb.remove('name')` would get you `exists[isActive]=true&addedAt[strictly_before]=${isoString}&orders[between]=0..10&_page=2&itemsPerPage=10` . You can see it has removed the `order` filter on the 'name' as well.


You can also clear the query builder by calling `qb.clear(type)`.
This lets you start a new query and keep the previous ones in history.
The behaviour is somewhat similar to the `qb.remove` method, in the way you can call the method with no arguments to remove all filters, or with a `SpdrParamType` to remove only filters of the passed type.

#### Example

```typescript
const qb = new SpdrQueryBuilder()
    .exists('isActive', true)
    .search('name', ['John Doe', 'Jane Doe'])
```
At this point, `qb.query` equals `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe`

```typescript
qb.clear()
```
`qb.query` is now empty.

```typescript
qb
    .search('name', ['John Doe', 'Jane Doe'])
    .date('addedAt', DateOperator.strictlyBefore, date)
```
Now, `qb.query` equals `name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}`

`qb.previousQuery` equals `exists[isActive]=true&name[]=John Doe&name[]=Jane Doe`

```typescript
qb.clear()
    .search('name', ['John Doe', 'Jane Doe'])
    .date('addedAt', DateOperator.strictlyBefore, date)
    .range('orders', RangeOperator.between, 0, 10)
```
At the end, `qb.query` equals `name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10`

`qb.previousQuery` equals `name[]=John Doe&name[]=Jane Doe&addedAt[strictly_before]=${isoString}`

But you can still get back to the first one by looking into `qb.history()`
You can also clear history by calling `qb.clearHistory()`. This lets you get a fresh start with the same instance (if you set a custom operand for example).

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

You can use this method multiple times, but it will override the operand each time:

```typescript
const qb = new SpdrQueryBuilder('&&')

qb
    .exists('isActive', true)
    .search('name', ['John Doe'])
    .setOperand('!!')
    .date('addedAt', DateOperator.strictlyBefore, date)
    .setOperand('&')
    .range('orders', RangeOperator.between, 0, 10)

```
`qb.query` equals `exists[isActive]=true&name=John Doe&addedAt[strictly_before]=${isoString}&orders[between]=0..10`
because the last time sets the operand to `&`

---

## Setting params
You may want to set manually the params. For example, you can get the params lists, save them into `localStorage` and set them back when needed.

The query builder exposes a getter and a setter for each list, rebuilding the query automatically every time you'll set a list.

Example:

```typescript
import {SpdrQueryBuilder} from "./spdrQueryBuilder";

const qb = new SpdrQueryBuilder()
const qb2 = new SpdrQueryBuilder()

qb
    .exists('isActive', true)
    .search('name', ['John Doe', 'Jane Doe']);

localStorage.setItem('params', JSON.stringify(qb.params))

const jsonParams = localStorage.getItem('params')

qb2.params = JSON.parse(params)
```
`qb` and `qb2` will output the same query. This also works with `qb.sortParams` and `qb.paginationParams`.

---

## Extending the library
Only basic default filters are supported but you can easily create your own `SpdrParam` by extending `SpdrParam` abstract
class. Plus, the `SpdrQueryBuilder` expects an implementation of the `SpdrParamInterface` so you can even create
your own abstract class that will suit you best.

```typescript
import {Operator, SpdrParamInterface} from "./spdrParam";

class MyCustomParam implements SpdrParamInterface {
    query: string;
    operator: Operator = Operator.equals;

    constructor(property: string, value: string) {
        this.query = `${property}${this.operator}${value}`;
    }
}
```
You'll have to implement a custom method in you own `SpdrQueryBuilder` definition, and that should eventually give:
```typescript
const qb = new CustomQueryBuilder();
qb.customMethod('myCustomParam', 'myCustomValue');
```
`qb.query` equals `myCustomParam=myValue`
