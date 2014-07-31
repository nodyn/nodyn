package io.nodyn.cli;

import com.google.common.collect.Lists;
import io.nodyn.Nodyn;
import io.nodyn.NodynConfig;
import org.dynjs.Config;
import org.jasmine.Executor;
import org.jasmine.Notifier;
import org.jasmine.SpecScanner;

import java.util.List;

import static com.google.common.collect.Lists.newArrayList;
import static com.google.common.collect.Sets.newTreeSet;

/**
 * @author lanceball
 */
public class Runtime {
    private final List<String> specs;
    private final ClassLoader parentClassLoader;
    private final Config.CompileMode compileMode;

    private Runtime(Iterable<String> specs, Config.CompileMode compileMode, ClassLoader parentClassLoader) {
        this.parentClassLoader = parentClassLoader;
        this.specs = newArrayList(newTreeSet(specs));
        this.compileMode = compileMode;
    }

    public void execute(Notifier notifier) {
        NodynConfig config = new NodynConfig(parentClassLoader);
        config.setCompileMode(this.compileMode);
        Nodyn nodyn = new Nodyn(config);
        Executor executor = (Executor) nodyn.newRunner().withSource("var executor = require('specRunner'); executor").evaluate();
        executor.execute(specs, notifier);
        //nodyn.start(nodyn.newRunner().withSource("executor.run()"));
    }

    public static class Builder {
        private Iterable<String> specs = Lists.newArrayList();
        private Config.CompileMode compileMode = Config.CompileMode.JIT;
        private ClassLoader classLoader;

        public Builder() {
            this.specs = Lists.newArrayList();
            this.compileMode = Config.CompileMode.JIT;
            this.classLoader = Thread.currentThread().getContextClassLoader();
        }

        public Builder scan(String pattern) {
            this.specs = new SpecScanner().findSpecs(pattern);
            return this;
        }

        public Builder specs(String... specs) {
            return specs(Lists.newArrayList(specs));
        }

        public Builder specs(Iterable<String> specs) {
            this.specs = Lists.newArrayList(specs);
            return this;
        }

        public Builder noCompile() {
            this.compileMode = Config.CompileMode.OFF;
            return this;
        }

        public Builder forceCompile() {
            this.compileMode = Config.CompileMode.FORCE;
            return this;
        }

        public Builder jitCompile() {
            this.compileMode = Config.CompileMode.JIT;
            return this;
        }

        public Builder classLoader(ClassLoader classLoader) {
            this.classLoader = classLoader;
            return this;
        }

        public Runtime build() {
            return new Runtime(specs, compileMode, classLoader);
        }
    }

}
