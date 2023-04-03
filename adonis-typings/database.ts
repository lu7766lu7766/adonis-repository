import { StrictValues } from "@ioc:Adonis/Lucid/Database"

declare module "@ioc:Adonis/Lucid/Orm" {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    getTotal(): Promise<number>
    exists(): Promise<boolean>
    pager({ page, perPage }: { page?: number; perPage?: number }): ModelQueryBuilderContract<Model, Result>
    sort({
      sortKey,
      sortType,
    }: {
      sortKey?: string | string[]
      sortType?: "asc" | "desc" | ("asc" | "desc")[]
    }): ModelQueryBuilderContract<Model, Result>
    condiction(
      condiction: { [k in keyof Partial<Result>]: StrictValues | StrictValues[] } & {
        subQuery?: (query: ModelQueryBuilderContract<Model, Result>) => void
      }
    ): ModelQueryBuilderContract<Model, Result>
  }
}
