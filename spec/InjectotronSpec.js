require('../lib/Injectotron');

describe("Injectotron", function() {
    var container;

    beforeEach(function() {
       container = new Injectotron();
    });

    describe("register(name, dependencies, prototype)", function() {
        it("throws if any argument is missing or a bad type", function() {
            var badArgs = [
                [],
                ['Name'],
                ['Name', ['Dependency1', 'Dependency2']],
                ['Name', function() {}],
                [1, ['Dependency1', 'Dependency2'], function() {}],
                ['Name', [1, 2], function() {}],
                ['Name', ['Dependency1', 'Dependency2'], 'should be a function']
            ];

            badArgs.forEach(function(args) {
                expect(function() {
                    container.register.apply(container, args);
                }).toThrow();
            });
        });
    });

    describe("get(name)", function() {
        it("returns undefined if name was not registered", function() {
            expect(container.get('notDefined')).toBeUndefined();
        });

        it("returns the result of executing the registered function", function() {
            var name = 'MyName',
                returnedFromRegisteredFunction = 'something';

            container.register(name, [], function() {
                return returnedFromRegisteredFunction;
            });

            expect(container.get(name)).toBe(returnedFromRegisteredFunction);
        });

        it("supplies dependencies to the registered function", function() {
            var main = "main",
                mainFunc,
                dep1 = "dep1",
                dep2 = "dep2";

            container.register(main, [dep1, dep2], function(dep1Func, dep2Func) {
                return function() {
                    return dep1Func() + dep2Func();
                }
            });
            container.register(dep1,[],function() {
                return function() {
                    return 1;
                };
            });
            container.register(dep2,[],function() {
                return function() {
                    return 2;
                };
            });
            mainFunc = container.get(main);
            expect(mainFunc()).toBe(3);
        });
    });
});
