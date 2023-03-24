"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectRepository = void 0;
const Repository_1 = require("../Repository");
function InjectRepository(model) {
    return (target, propKey, index) => {
        if (typeof index === "undefined") {
            Object.defineProperty(target, propKey, {
                value: new Repository_1.Repository(model),
                writable: false,
            });
            return;
        }
        const params = Reflect.getMetadata("design:paramtypes", target) || [];
        params[index] = new Repository_1.Repository(model);
        Reflect.defineMetadata("design:paramtypes", params, target, propKey);
    };
}
exports.InjectRepository = InjectRepository;
