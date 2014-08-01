exports.reporter = function(notifier){
    return {
        reportRunnerStarting: function(runner){
            notifier.started();
        },
        reportRunnerResults: function(runner){
            notifier.finished();
        },
        reportSuiteResults: function(suite){
        },
        reportSpecStarting: function(spec){
        },
        reportSpecResults: function(spec){
            var identifier = org.jasmine.Identifier.identifier(spec.suite.id, spec.id);
            if(spec.results().passed()){
                notifier.pass(identifier, spec.getFullName());
            }else{
                var failures = spec.results().getItems().map(function(item){
                    if(item.trace.stack){
                        var stack = org.jasmine.Failure$Stack.stack(item.trace.stack);
                        return org.jasmine.Failure.failure(identifier, stack);
                    }else{
                        return org.jasmine.Failure.failure(identifier);
                    }
                });

                var builder = com.google.common.collect.ImmutableSet.builder();
                failures.forEach(function(failure) { builder.add(failure); });
                notifier.fail(identifier, spec.getFullName(), builder.build());
            }
        },
        log: function(str){
        }
    }
}
