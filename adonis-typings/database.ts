declare module "@ioc:Adonis/Lucid/Database" {
  interface DatabaseQueryBuilderContract<Result> {
    getCount(): Promise<number>
    exists(): Promise<boolean>
  }
}

declare module "@ioc:Adonis/Lucid/Orm" {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    getCount(): Promise<number>
    exists(): Promise<boolean>
  }
}
