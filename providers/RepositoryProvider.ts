import "reflect-metadata"
import { ApplicationContract } from "@ioc:Adonis/Core/Application"
import { InjectRepository } from "../src/Decorator/InjectRepository"
import { Repository } from "../src/Repository"
import _ from "lodash"
/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = (await import('@ioc:Adonis/Lucid/Database')).default
|   const Event = (await import('@ioc:Adonis/Core/Event')).default
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class ClassValidatorProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    this.bindExtend()
    this.bindRepository()
  }

  /**
   * Bind the class validator to the IOC.
   */
  private bindExtend() {
    const DB = this.app.container.use("Adonis/Lucid/Database")
    const { DatabaseQueryBuilder, ModelQueryBuilder } = DB
    DatabaseQueryBuilder.macro("getTotal", async function () {
      const res = await this.count("* as total").first()
      return res?.total.valueOf() || 0
    })
    ModelQueryBuilder.macro("getTotal", async function () {
      const res = await this.count("* as total").first()
      return res?.$extras.total.valueOf() || 0
    })
    DatabaseQueryBuilder.macro("exists", async function () {
      return (await this.getTotal()) > 0
    })
    ModelQueryBuilder.macro("exists", async function () {
      return (await this.getTotal()) > 0
    })
    DatabaseQueryBuilder.macro("pager", function ({ page, perPage }) {
      if (typeof page !== "undefined" && typeof perPage != "undefined") {
        this.offset((page - 1) * perPage).limit(perPage)
      }
      return this
    })
    DatabaseQueryBuilder.macro("sort", function ({ sortKey, sortType }) {
      if (typeof sortKey !== "undefined" && typeof sortType !== "undefined") {
        if (sortKey.constructor === Array) {
          sortKey.forEach((key, i) => {
            this.orderBy(key, sortType[i] as "asc" | "desc")
          })
        } else {
          this.orderBy(sortKey as string, sortType as "asc" | "desc")
        }
      }
      return this
    })
    DatabaseQueryBuilder.macro("condiction", function (condiction) {
      const { subQuery, ...condictions } = _.pickBy(condiction)

      subQuery?.(this)

      Object.keys(condictions).forEach((key) => {
        const target = condictions[key]!
        if (target.constructor === Array) {
          this.whereIn(key, target)
        } else {
          this.where(key, target)
        }
      })
      return this
    })
  }

  private bindRepository() {
    this.app.container.bind("Adonis/Repository", () => {
      return {
        InjectRepository,
        Repository,
      }
    })
  }
}
