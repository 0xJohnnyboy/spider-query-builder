![spider logo](./assets/logo.png "logo")

# Spider Query Builder

This library is designed to help you interact between your front end app and your backend based on Api Platform. It can
help you build your query from a filters form with typing etc.

Example:

Say you have a DomainService (`domain.service.ts` file) with the something like:

```typescript

getDomain(query: string): Observable<HttpResponse<Domain[]>> {
    const url = `${this.baseUrl}/domain?${query}`;

    return this.http.get<Domain[]>(url);
}
```

API Platform has specific semantics for the built-in filters.

With this library, you have to build `SpiderParams` for each filter, like:

```typescript
import {SpiderSearchParam, SpiderExistsParam, SpiderRangeParam} from "./SpiderParam";
import {SpiderQueryBuilder} from "./SpiderQueryBuilder";

// create SpiderParams with values you get from your filters form on value change
const param1 = new SpiderExistsParam('username', true); // wether the property 'username' exists
const param2 = new SpiderSearchParam('firstname', 'john'); // search for a 'john' firstname
const param3 = new SpiderSearchParam('lastname', 'doe'); // search for a 'doe' lastname
const param4 = new SpiderRangeParam('rank', 1, 200); // search for a result with rank between 1 and 200

const params = [param1, param2, param3, param4];

const queryBuilder = new SpiderQueryBuilder(params); // builds a new query with '&' as default operand
const query = queryBuilder.query; // this query you can pass to your service

```

The returned query will be formatted as `exists[username]=true&firstname=john&lastname=doe&rank[between]=1..200`;

If you want, you can use the `append()` method to append manually a SpiderParam to the query. You can pass a custom
operand to both the builder and the append method. Passing it to the builder will result in something like this:

```typescript
const qb = new SpiderQueryBuilder(params, 'AND');
// qb.query => "exists[username]=trueANDfirstname=johnANDlastname=doeANDrank[between]=1..200"
```

```typescript
const param5 = new SpiderSearchParam('firstname', 'jane'); // search for a 'john' firstname
const param6 = new SpiderSearchParam('firstname', 'john'); // search for a 'doe' lastname

const qb2 = new SpiderQueryBuilder([param5, param6], '||');
// qb2.query => "firstname=jane||firstname=john
```

Passing it to the `append()` method will result in something like this:

```typescript
const qb = new SpiderQueryBuilder(params);
// qb => "exists[username]=true&firstname=john&lastname=doe&rank[between]=1..200"

qb.append(param5, '||');
// qb => "exists[username]=true&firstname=john&lastname=doe&rank[between]=1..200||firstname=jane"
```

Only defaults filters are supported but you can easily create your own `SpiderParam` by extending `SpiderParam` abstract
class. Plus, the `SpiderQueryBuilder` expects an implementation of the `SpiderParamInterface` so you can even create
your own abstract class that will suit you best.
---
NOTE: the `SpiderSearchParam` handles (as API Platform natively does), multiple values. You can indeed pass an array as you create a new instance:
```typescript
const param = new SpiderSearchParam('name', ['John Doe', 'Jane Doe']);
// param.query => "name[]=John Doe&name[]=Jane Doe"
```