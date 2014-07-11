package io.nodyn.cli;

import org.jasmine.cli.Formatter;
import org.jasmine.cli.ProgressFormatter;
import org.jasmine.cli.DocumentationFormatter;

/**
 * @author lanceball
 */
public enum OutputFormat {
    DOC {
        @Override
        public Formatter formatter() {
            return new DocumentationFormatter();
        }
    },

    PROGRESS {
        @Override
        public Formatter formatter() {
            return new ProgressFormatter();
        }
    };

    public abstract Formatter formatter();
}
