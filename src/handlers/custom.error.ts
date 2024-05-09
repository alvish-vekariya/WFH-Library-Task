import { injectable } from "inversify";

@injectable()
export class customError extends Error{
    data : object;
    constructor(message:string, data: object){
        super(message);
        this.data = data;
    }
}