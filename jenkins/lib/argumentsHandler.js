
function ArgumentsHandler(args) {
    this._args = args;
}

ArgumentsHandler.prototype.hasSpecifiedArgument = function(argument) {
    return this._args.indexOf(argument) > -1;
}

ArgumentsHandler.prototype.getArgumentValue = function(argument) {
    var index = this._args.indexOf(argument);

    if (index > -1 && index + 1 < this._args.length) {
        return this._args[index + 1];
    }

    throw new Error('No value specified for argument ' + argument);
}

ArgumentsHandler.prototype.getLastArgumentValue = function() {
    return this._args[this._args.length - 1];
}

module.exports = ArgumentsHandler;
