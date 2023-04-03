declare module "@ioc:Adonis/Lucid/Database" {
  interface DatabaseQueryBuilderContract<Result> {
    getTotal(): Promise<number>
    exists(): Promise<boolean>
    pager({ page, perPage }: { page: number; perPage: number }): DatabaseQueryBuilderContract<Result>
    sort({ sortKey, sortType }: { sortKey: string | string[]; sortType: "asc" | "desc" | ("asc" | "desc")[] }): DatabaseQueryBuilderContract<Result>
    condiction(
      condiction: { [k: string]: StrictValues | StrictValues[] } & { subQuery?: (params: any) => void }
    ): DatabaseQueryBuilderContract<Result>
  }
}

declare module "@ioc:Adonis/Lucid/Orm" {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    getTotal(): Promise<number>
    exists(): Promise<boolean>
  }
}
