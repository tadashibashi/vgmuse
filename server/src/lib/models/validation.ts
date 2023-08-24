import {Model, HydratedDocument} from "mongoose";

/**
 * Generates a validator enforcing that a field in a model be unique.
 * @param fieldName - name of the field in the model to validate
 * @param scope - optional fieldnames to add to the query: e.g. passing ["_id"]
 *                   will cause the search to be unique to that user instead of all users.
 */
export function enforceUnique<T>(fieldName: keyof T & string, scope?: (keyof T)[]) {
    return async function(this: HydratedDocument<T>, v: T[keyof T & string]) {

        // only check when this field has been modified
        if (!this.isModified(fieldName))
            return true;

        const ctor = this.constructor as Model<any>;

        const queryObj: Partial<T> = {};

        if (scope)
            scope.forEach(field => queryObj[field] = this[field]);
        queryObj[fieldName] = v;

        const models = await ctor.find(queryObj);
        return models.length === 0 || models[0]._id.equals(this._id);
    }
}
