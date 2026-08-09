export class UnsupportedMediaTypeError extends Error{
    constructor(message){
        super(message);
        this.name = 'UnsuportedMediaTypeError';
    }
}