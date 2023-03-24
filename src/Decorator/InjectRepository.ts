import { LucidModel } from "@ioc:Adonis/Lucid/Orm"
import { Repository } from "../Repository"

export function InjectRepository<T extends LucidModel>(model: T) {
  return (target: Object, propKey: string, index?: number) => {
    if (typeof index === "undefined") {
      Object.defineProperty(target, propKey, {
        value: new Repository(model),
        writable: false,
      })
      return
    }

    const params = Reflect.getMetadata("design:paramtypes", target) || []
    params[index] = new Repository(model)
    Reflect.defineMetadata("design:paramtypes", params, target, propKey)
  }
}
