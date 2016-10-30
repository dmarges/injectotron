Injectotron = function() {
    this.registrations = [];
};

Injectotron.prototype.messages = {
    registerRequiresArgs: "The register function requires three arguments: A string, an array of strings and a function"
};

Injectotron.prototype.register = function(name, dependencies, func) {
    var ix;

    if(typeof name !== 'string' || !Array.isArray(dependencies) || typeof func !== 'function') {
      throw new Error(this.messages.registerRequiresArgs);
    }

    for(ix = 0; ix < dependencies.length; ++ix) {
        if(typeof dependencies[ix] !== 'string') {
            throw new Error(this.messages.registerRequiresArgs);
        }
    }

    this.registrations[name] = { dependencies: dependencies, func: func };
};

Injectotron.prototype.get = function(name) {
    var self = this,
        registration = this.registrations[name],
        dependencies = [];

    if(registration === undefined) {
      return undefined;
    }

    registration.dependencies.forEach(function(dependencyName) {
        var dependency = self.get(dependencyName);
        dependencies.push(dependency === undefined ? undefined : dependency);
    });

    return registration.func.apply(undefined, dependencies);
};