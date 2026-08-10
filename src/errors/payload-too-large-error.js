export class PayloadTooLargeError extends Error{
    constructor(message){
        super(message);
        this.name = 'PayloadTooLargeError'
    }
}