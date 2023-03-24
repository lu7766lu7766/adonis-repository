"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
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
class ClassValidatorProvider {
    constructor(app) {
        this.app = app;
    }
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
            this.bindExtend();
        });
    }
    /**
     * Bind the class validator to the IOC.
     */
    bindExtend() {
        const DB = this.app.container.use("Adonis/Lucid/Database");
        const { DatabaseQueryBuilder, ModelQueryBuilder } = DB;
        DatabaseQueryBuilder.macro("getCount", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.count("* as total").first();
                return (res === null || res === void 0 ? void 0 : res.total.valueOf()) || 0;
            });
        });
        ModelQueryBuilder.macro("getCount", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield this.count("* as total").first();
                return (res === null || res === void 0 ? void 0 : res.$extras.total.valueOf()) || 0;
            });
        });
        DatabaseQueryBuilder.macro("exists", function () {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.getCount()) > 0;
            });
        });
        ModelQueryBuilder.macro("exists", function () {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.getCount()) > 0;
            });
        });
    }
}
exports.default = ClassValidatorProvider;
ClassValidatorProvider.needsApplication = true;
