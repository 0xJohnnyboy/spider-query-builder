```
           _     _                                       _           _ _     _
          (_)   | |                                     | |         (_| |   | |
 ___ _ __  _  __| | ___ _ __  __ _ _   _  ___ _ __ _   _| |__  _   _ _| | __| | ___ _ __
/ __| '_ \| |/ _` |/ _ | '__ / _` | | | |/ _ | '__| | | | '_ \| | | | | |/ _` |/ _ | '__|
\__ | |_) | | (_| |  __| |  | (_| | |_| |  __| |  | |_| | |_) | |_| | | | (_| |  __| |
|___| .__/|_|\__,_|\___|_|   \__, |\__,_|\___|_|   \__, |_.__/ \__,_|_|_|\__,_|\___|_|
    | |                         | |                 __/
    |_|                         |_|                |___/
```


[![GitHub Release](https://github-basic-badges.herokuapp.com/release/Sonicfury/spider-query-builder.svg)]()
[![GitHub License](https://github-basic-badges.herokuapp.com/license/Sonicfury/spider-query-builder.svg)]()
![test](https://github.com/sonicfury/spider-query-builder/actions/workflows/test.yml/badge.svg)
![publish](https://github.com/sonicfury/spider-query-builder/actions/workflows/publish.yml/badge.svg)

# Installation
```bash
$ npm i @sonicfury/spider-query-builder
```

# What it does

This typescript library is designed to help you interact between your front end app and your backend based on API Platform. It can
help you build your query from a filters form with typing etc.

# License
This project is under AGPL 3 License

[See license](LICENSE)

# How to

[See docs](docs/docs.md)
## Example
Say you have a DomainService (`domain.service.ts` file) with the something like:

```typescript
class DomainService extends AbstractService{
    
    getDomain(query: string): Observable<HttpResponse<Domain[]>> {
        const url = `${this.baseUrl}/domain?${query}`;

        return this.http.get<Domain[]>(url);
    }
}
```

API Platform has specific semantics for the built-in filters.

With this library, you have to build `SpiderParams` for each filter, like:

```typescript
import {SpdrQueryBuilder} from "./SpdrQueryBuilder";

const qb = new SpdrQueryBuilder(); // initialize the builder

qb
    .exists('username', true) // wether the property 'username' exists
    .search('firstname', ['john']) // search for a 'john' firstname
    .search('lastname', ['doe']) // search for a 'doe' lastname
    .range('rank', 1, 200); // search for a result with rank between 1 and 200


this.domainService.getDomain(qb.query)
    .subscribe(
        // ...
    )
```

`qb.query` will be formatted as `exists[username]=true&firstname=john&lastname=doe&rank[between]=1..200`;

# Issues

Feel free to submit an issue if you find something wrong or if you feel some important feature is missing. Be sure to note the version you're using, and provide minimum context and information (as if you were on SO). 
# Contributing

You're welcome to contribute if you want. Just be sure to check [the guidelines](CONTRIBUTING.md)