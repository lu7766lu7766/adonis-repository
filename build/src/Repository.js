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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const lodash_1 = __importDefault(require("lodash"));
class Repository {
    constructor(staticSourceModel) {
        this.staticSourceModel = staticSourceModel;
    }
    find(primaryKey) {
        return this.staticSourceModel.find(primaryKey);
    }
    findBy(propKey, primaryKey) {
        return this.staticSourceModel.findBy(propKey, primaryKey);
    }
    findOrFail(primaryKey) {
        return this.staticSourceModel.findOrFail(primaryKey);
    }
    findByOrFail(propKey, primaryKey) {
        return this.staticSourceModel.findByOrFail(propKey, primaryKey);
    }
    firstOrCreate(searcPayloadh, savePayload, options) {
        return this.staticSourceModel.firstOrCreate(searcPayloadh, savePayload, options);
    }
    query() {
        return this.staticSourceModel.query();
    }
    where(condition) {
        this.condition = lodash_1.default.pickBy(condition);
        return this;
    }
    paginate(body) {
        const { page = 1, perPage = 0 } = body;
        this.offset = (page - 1) * perPage;
        this.perPage = perPage;
        return this;
    }
    sort(body) {
        this.sortKey = body.sortKey;
        this.sortType = body.sortType;
        return this;
    }
    getList() {
        const query = this.staticSourceModel.query();
        if (this.condition) {
            const _a = this.condition, { subQuery } = _a, conditions = __rest(_a, ["subQuery"]);
            subQuery && subQuery(query);
            Object.keys(conditions).forEach((key) => {
                const target = this.condition[key];
                target.constructor === Array ? query.whereIn(key, target) : query.where(key, target);
            });
        }
        if (typeof this.perPage != "undefined" && this.perPage > 0 && typeof this.offset != "undefined") {
            query.offset(this.offset).limit(this.perPage);
        }
        if (this.sortKey && this.sortType) {
            this.sortKey.constructor == Array
                ? this.sortKey.forEach((_x, i) => {
                    query.orderBy(this.sortKey[i], this.sortType[i]);
                })
                : query.orderBy(this.sortKey, this.sortType);
        }
        return query;
    }
    getTotal() {
        const query = this.staticSourceModel.query();
        if (this.condition) {
            const _a = this.condition, { subQuery } = _a, conditions = __rest(_a, ["subQuery"]);
            subQuery && subQuery(query);
            Object.keys(conditions).forEach((key) => {
                const target = this.condition[key];
                target.constructor === Array ? query.whereIn(key, target) : query.where(key, target);
            });
        }
        return query.getCount();
    }
    whereBuilder(_query, _body) { }
    mergeSave(row, body) {
        this.trx && row.useTransaction(this.trx);
        return row.merge(body, true).save();
    }
    merge(row, body) {
        return row.merge(body, true);
    }
    save(row) {
        this.trx && row.useTransaction(this.trx);
        return row.save();
    }
    create(body, options) {
        return this.staticSourceModel.create(body, options);
    }
    createMany(bodies, options) {
        return this.staticSourceModel.createMany(bodies, options);
    }
    /**
     * update need primary key
     * */
    updateOrCreate(search, bodies, options) {
        return this.staticSourceModel.updateOrCreate(search, bodies, options);
    }
    updateOrCreateManyByKey(key, bodies, options) {
        // return this.staticSourceModel.updateOrCreateManyByKey(key, bodies, options)
        return Promise.all([
            this.staticSourceModel.updateOrCreateMany(key, bodies.filter((body) => body[key]), options),
            this.createMany(bodies.filter((body) => !body[key]), options),
        ]);
    }
    useTransaction(trx) {
        this.trx = trx;
        return this;
    }
    delete(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.query();
            this.trx && query.useTransaction(this.trx);
            if (["number", "string"].includes(typeof args[0])) {
                query.where("id", args[0]);
            }
            else if (args[0].constructor == Array) {
                query.whereIn("id", args[0]);
            }
            return query.delete();
        });
    }
    deleteBy(...args) {
        const query = this.query();
        this.trx && query.useTransaction(this.trx);
        if (typeof args[0] == "string" && ["number", "string"].includes(typeof args[0])) {
            query.where(args[0], args[1]);
        }
        else if (typeof args[0] == "string" && args.length == 3) {
            query.where(args[0], args[1], args[2]);
        }
        else if (typeof args[0] == "string" && args[1].constructor == Array) {
            query.whereIn(args[0], args[1]);
        }
        else {
            Object.keys(args[0]).forEach((key) => {
                if (["number", "string"].includes(typeof args[0][key])) {
                    query.where(key, args[0][key]);
                }
                else {
                    query.whereIn(key, args[0][key]);
                }
            });
        }
        return query.delete();
    }
}
exports.Repository = Repository;
