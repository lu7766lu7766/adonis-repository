/// <reference types="@adonisjs/lucid" />
import { LucidModel } from "@ioc:Adonis/Lucid/Orm";
export declare function InjectRepository<T extends LucidModel>(model: T): (target: Object, propKey: string, index?: number) => void;
