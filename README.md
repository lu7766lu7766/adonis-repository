# Adonis Repository

adonisjs lucid is very strong, but it do too much and hard to extend, so i refer nestJs's repository, and build this to share model responsibility

## 📦 Installing

Simply run the following commands on your shell

```bash
npm install @lu7766lu7766/adonis-repository
node ace invoke @lu7766lu7766/adonis-repository
```

## 📌 Example

> Inject in constructor

```ts
// Controller.ts
import { inject } from "@adonisjs/fold"
import { InjectRepository, Repository } from "@ioc:Adonis/Repository"
import User from "App/Models/User"
@inject()
class Controller {
  constructor(@InjectRepository(User) private repo: Repository<typeof User>) {}
}
```

> Inject in class

```ts
// Controller.ts
import { InjectRepository, Repository } from "@ioc:Adonis/Repository"
import User from "App/Models/User"
class Controller {
  @InjectRepository(User)
  private repo: Repository<typeof User>
}
```

> features

```ts
// Controller.ts
import { inject } from "@adonisjs/fold"
import { InjectRepository, Repository } from "@ioc:Adonis/Repository"
import User from "App/Models/User"
@inject()
class Controller {
  constructor(@InjectRepository(User) private repo: Repository<typeof User>) {}

  getList() {
    return this.repo
      .query()
      .pager({ page: 1; perPage: 20 })
      .sort({ sortKey: "created_ad"; sortType: "desc" })
      .condiction({
        id: [1, 3, 5, 7], // whereIn("id", [1, 3, 5, 7])
        is_active: true, // where("is_active", true)
        subQuery(query) {
          // custom query
        },
      })
  }

  getTotal() {
    return this.repo.getTotal() // select count(*) from users // reutrn number
  }

  getOne() {
    return this.repo.find(5) // select * from users where id = 5
  }

  query() {
    return this.repo.query() // same as User.query
  }

  // findFail
  // findBy
  // findByOrFail
  // firstOrCreate
  // create
  // createMany
  // updateOrCreate
  // updateOrCreateManyByKey
  // merge
  // save
  // mergeSave
  // delete
  // deleteBy
}
```

## 📝 Contributing

If you find any issue, bug or missing feature, please kindly create an issue or submit a pull request.
