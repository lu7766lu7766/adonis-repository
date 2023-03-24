import "reflect-metadata"
import { ApplicationContract } from "@ioc:Adonis/Core/Application"

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
  }

  /**
   * Bind the class validator to the IOC.
   */
  private bindExtend() {
    const DB = this.app.container.use("Adonis/Lucid/Database")
    const { DatabaseQueryBuilder, ModelQueryBuilder } = DB
    DatabaseQueryBuilder.macro("getCount", async function () {
      const res = await this.count("* as total").first()
      return res?.total.valueOf() || 0
    })
    ModelQueryBuilder.macro("getCount", async function () {
      const res = await this.count("* as total").first()
      return res?.$extras.total.valueOf() || 0
    })
    DatabaseQueryBuilder.macro("exists", async function () {
      return (await this.getCount()) > 0
    })
    ModelQueryBuilder.macro("exists", async function () {
      return (await this.getCount()) > 0
    })
  }
}
