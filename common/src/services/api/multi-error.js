

export default class MultiError {

    static name = "MultiSalesForceError";
    message;
    stack;
    errors;

    constructor(response) {
        if (!response.hasErrors) return;

        this.errors = response.results.filter(({statusCode}) => statusCode >= 400 && statusCode <= 500).map(({result}) => result);

        this.message = this.errors[0].message;
        this.stack = JSON.stringify(response);
    }
}
