/// <reference types="@adonisjs/application/build/adonis-typings" />
import "reflect-metadata";
import { ApplicationContract } from "@ioc:Adonis/Core/Application";
export default class ClassValidatorProvider {
    protected app: ApplicationContract;
    static needsApplication: boolean;
    constructor(app: ApplicationContract);
    boot(): Promise<void>;
    /**
     * Bind the class validator to the IOC.
     */
    private bindExtend;
}
