/// <reference types="@adonisjs/lucid" />
/// <reference types="@adonisjs/lucid" />
/// <reference types="@adonisjs/lucid" />

declare module "@ioc:Adonis/Repository" {
  import { StrictValues, TransactionClientContract } from "@ioc:Adonis/Lucid/Database"
  import { LucidModel, ModelAssignOptions, ModelAttributes, ModelQueryBuilderContract } from "@ioc:Adonis/Lucid/Orm"
  import { Dictionary } from "lodash"
  type iSubQuery<T extends LucidModel> = (query: ModelQueryBuilderContract<T>) => void
  type iCondition<T extends LucidModel> = {
    [k in keyof Partial<InstanceType<T>>]: StrictValues[] | StrictValues
  } & {
    subQuery?: iSubQuery<T>
  }
  class Repository<T extends LucidModel> {
    private staticSourceModel
    constructor(staticSourceModel: T)
    find(primaryKey: any): Promise<InstanceType<T> | null>
    findBy(propKey: any, primaryKey: any): Promise<InstanceType<T> | null>
    findOrFail(primaryKey: any): Promise<InstanceType<T>>
    findByOrFail(propKey: any, primaryKey: any): Promise<InstanceType<T>>
    firstOrCreate(
      searcPayloadh: Partial<ModelAttributes<InstanceType<T>>>,
      savePayload?: Partial<ModelAttributes<InstanceType<T>>> | undefined,
      options?: ModelAssignOptions | undefined
    ): Promise<InstanceType<T>>
    query(): ModelQueryBuilderContract<T, InstanceType<T>>
    condition: Dictionary<StrictValues | StrictValues[] | ((query: ModelQueryBuilderContract<T, InstanceType<T>>) => void) | undefined>
    where(condition: iCondition<T>): this
    offset: any
    perPage: any
    paginate(body: { page?: number; perPage?: number }): this
    sortKey: any
    sortType: any
    sort(body: { sortKey?: string; sortType?: string }): this
    getList(): ModelQueryBuilderContract<T>
    getTotal(): Promise<number>
    protected whereBuilder(_query: ModelQueryBuilderContract<T, InstanceType<T>>, _body: any): void
    mergeSave(row: InstanceType<T>, body: Partial<ModelAttributes<InstanceType<T>>>): Promise<InstanceType<T>>
    merge(row: InstanceType<T>, body: Partial<ModelAttributes<InstanceType<T>>>): InstanceType<T>
    save(row: InstanceType<T>): Promise<InstanceType<T>>
    create(body: Partial<ModelAttributes<InstanceType<T>>>, options?: ModelAssignOptions): Promise<InstanceType<T>>
    createMany(bodies: Partial<ModelAttributes<InstanceType<T>>>[], options?: ModelAssignOptions): Promise<InstanceType<T>[]>
    /**
     * update need primary key
     * */
    updateOrCreate(
      search: Partial<ModelAttributes<InstanceType<T>>>,
      bodies: Partial<ModelAttributes<InstanceType<T>>>,
      options?: ModelAssignOptions
    ): Promise<InstanceType<T>>
    updateOrCreateManyByKey(
      key: keyof ModelAttributes<InstanceType<T>>,
      bodies: Partial<ModelAttributes<InstanceType<T>>>[],
      options?: ModelAssignOptions
    ): Promise<[InstanceType<T>[], InstanceType<T>[]]>
    private trx?
    useTransaction(trx: TransactionClientContract): this
    delete(value: number | string): Promise<number[]>
    delete(values: Array<number | string>): Promise<number[]>
    deleteBy(propKey: string, value: number | string): Promise<number[]>
    deleteBy(propKey: string, operator: string, value: number | string): Promise<number[]>
    deleteBy(propKey: string, values: Array<number | string>): Promise<number[]>
    deleteBy(where: { [m: string]: string | number | Array<string | number> }): Promise<number[]>
  }
  function InjectRepository<T extends LucidModel>(model: T): (target: Object, propKey: string, index?: number) => void

  export { InjectRepository, Repository }
}
