package io.nodyn.cli;

/**
 * @author lanceball
 */
public enum CompileMode {
    OFF {
        @Override
        public Runtime.Builder apply(Runtime.Builder builder) {
            return builder.noCompile();
        }
    },
    FORCE {
        @Override
        public Runtime.Builder apply(Runtime.Builder builder) {
            return builder.forceCompile();
        }
    },
    JIT {
        @Override
        public Runtime.Builder apply(Runtime.Builder builder) {
            return builder.jitCompile();
        }
    };

    public abstract Runtime.Builder apply(Runtime.Builder builder);

}
