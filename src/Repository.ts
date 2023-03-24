import { StrictValues, TransactionClientContract } from "@ioc:Adonis/Lucid/Database"
import { LucidModel, ModelAssignOptions, ModelAttributes, ModelQueryBuilderContract } from "@ioc:Adonis/Lucid/Orm"
import _, { Dictionary } from "lodash"

type iSubQuery<T extends LucidModel> = (query: ModelQueryBuilderContract<T>) => void
type iCondition<T extends LucidModel> = {
  [k in keyof Partial<InstanceType<T>>]: StrictValues[] | StrictValues
} & { subQuery?: iSubQuery<T> }
export class Repository<T extends LucidModel> {
  constructor(private staticSourceModel: T) {}

  find(primaryKey) {
    return this.staticSourceModel.find(primaryKey)
  }

  findBy(propKey, primaryKey) {
    return this.staticSourceModel.findBy(propKey, primaryKey)
  }

  findOrFail(primaryKey) {
    return this.staticSourceModel.findOrFail(primaryKey)
  }

  findByOrFail(propKey, primaryKey) {
    return this.staticSourceModel.findByOrFail(propKey, primaryKey)
  }

  firstOrCreate(
    searcPayloadh: Partial<ModelAttributes<InstanceType<T>>>,
    savePayload?: Partial<ModelAttributes<InstanceType<T>>> | undefined,
    options?: ModelAssignOptions | undefined
  ) {
    return this.staticSourceModel.firstOrCreate(searcPayloadh, savePayload, options)
  }

  query() {
    return this.staticSourceModel.query()
  }

  condition: Dictionary<StrictValues | StrictValues[] | ((query: ModelQueryBuilderContract<T, InstanceType<T>>) => void) | undefined>
  where(condition: iCondition<T>) {
    this.condition = _.pickBy(condition)
    return this
  }
  offset
  perPage
  paginate(body: { page?: number; perPage?: number }) {
    const { page = 1, perPage = 0 } = body
    this.offset = (page - 1) * perPage
    this.perPage = perPage
    return this
  }
  sortKey
  sortType
  sort(body: { sortKey?: string; sortType?: string }) {
    this.sortKey = body.sortKey
    this.sortType = body.sortType
    return this
  }

  getList(): ModelQueryBuilderContract<T> {
    const query = this.staticSourceModel.query()
    if (this.condition) {
      const { subQuery, ...conditions } = this.condition
      subQuery && (subQuery as (query: ModelQueryBuilderContract<T>) => void)(query)
      Object.keys(conditions).forEach((key) => {
        const target = this.condition[key]!
        target.constructor === Array ? query.whereIn(key, target as StrictValues[]) : query.where(key, target as StrictValues)
      })
    }
    if (typeof this.perPage != "undefined" && this.perPage > 0 && typeof this.offset != "undefined") {
      query.offset(this.offset).limit(this.perPage)
    }
    if (this.sortKey && this.sortType) {
      this.sortKey.constructor == Array
        ? this.sortKey.forEach((_x, i) => {
            query.orderBy(this.sortKey[i], this.sortType[i])
          })
        : query.orderBy(this.sortKey, this.sortType)
    }
    return query
  }

  getTotal(): Promise<number> {
    const query = this.staticSourceModel.query()
    if (this.condition) {
      const { subQuery, ...conditions } = this.condition
      subQuery && (subQuery as (query: ModelQueryBuilderContract<T>) => void)(query)
      Object.keys(conditions).forEach((key) => {
        const target = this.condition[key]!
        target.constructor === Array ? query.whereIn(key, target as StrictValues[]) : query.where(key, target as StrictValues)
      })
    }
    return query.getCount()
  }

  protected whereBuilder(_query: ModelQueryBuilderContract<T, InstanceType<T>>, _body: any) {}

  mergeSave(row: InstanceType<T>, body: Partial<ModelAttributes<InstanceType<T>>>) {
    this.trx && row.useTransaction(this.trx)
    return row.merge(body, true).save()
  }

  merge(row: InstanceType<T>, body: Partial<ModelAttributes<InstanceType<T>>>) {
    return row.merge(body, true)
  }

  save(row: InstanceType<T>) {
    this.trx && row.useTransaction(this.trx)
    return row.save()
  }

  create(body: Partial<ModelAttributes<InstanceType<T>>>, options?: ModelAssignOptions) {
    return this.staticSourceModel.create(body, options)
  }
  createMany(bodies: Partial<ModelAttributes<InstanceType<T>>>[], options?: ModelAssignOptions) {
    return this.staticSourceModel.createMany(bodies, options)
  }

  /**
   * update need primary key
   * */
  updateOrCreate(search: Partial<ModelAttributes<InstanceType<T>>>, bodies: Partial<ModelAttributes<InstanceType<T>>>, options?: ModelAssignOptions) {
    return this.staticSourceModel.updateOrCreate(search, bodies, options)
  }

  updateOrCreateManyByKey(
    key: keyof ModelAttributes<InstanceType<T>>,
    bodies: Partial<ModelAttributes<InstanceType<T>>>[],
    options?: ModelAssignOptions
  ) {
    // return this.staticSourceModel.updateOrCreateManyByKey(key, bodies, options)
    return Promise.all([
      this.staticSourceModel.updateOrCreateMany(
        key,
        bodies.filter((body) => body[key]),
        options
      ),
      this.createMany(
        bodies.filter((body) => !body[key]),
        options
      ),
    ])
  }

  private trx?: TransactionClientContract

  useTransaction(trx: TransactionClientContract) {
    this.trx = trx
    return this
  }

  delete(value: number | string): Promise<number[]>
  delete(values: Array<number | string>): Promise<number[]>
  async delete(...args) {
    const query = this.query()
    this.trx && query.useTransaction(this.trx)
    if (["number", "string"].includes(typeof args[0])) {
      query.where("id", args[0])
    } else if (args[0].constructor == Array) {
      query.whereIn("id", args[0])
    }
    return query.delete()
  }

  deleteBy(propKey: string, value: number | string): Promise<number[]>
  deleteBy(propKey: string, operator: string, value: number | string): Promise<number[]>
  deleteBy(propKey: string, values: Array<number | string>): Promise<number[]>
  deleteBy(where: { [m: string]: string | number | Array<string | number> }): Promise<number[]>
  deleteBy(...args) {
    const query = this.query()
    this.trx && query.useTransaction(this.trx)
    if (typeof args[0] == "string" && ["number", "string"].includes(typeof args[0])) {
      query.where(args[0], args[1])
    } else if (typeof args[0] == "string" && args.length == 3) {
      query.where(args[0], args[1], args[2])
    } else if (typeof args[0] == "string" && args[1].constructor == Array) {
      query.whereIn(args[0], args[1])
    } else {
      Object.keys(args[0]).forEach((key) => {
        if (["number", "string"].includes(typeof args[0][key])) {
          query.where(key, args[0][key])
        } else {
          query.whereIn(key, args[0][key])
        }
      })
    }
    return query.delete()
  }
}
