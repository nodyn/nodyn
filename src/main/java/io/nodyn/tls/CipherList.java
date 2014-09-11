package io.nodyn.tls;

import java.util.*;

/**
 * @author Bob McWhirter
 */
public class CipherList {

    private Set<Cipher> supported = new HashSet<>();
    private List<Cipher> ciphers = new ArrayList<>();
    private Set<Cipher> blacklisted = new HashSet<>();

    public CipherList(String[] supported, String spec) {
        for (int i = 0; i < supported.length; ++i) {
            this.supported.add(Cipher.getByTLSName(supported[i]));
        }
        init(spec);
    }

    public String[] toArray() {
        String[] ciphers = new String[this.ciphers.size()];
        for (int i = 0; i < ciphers.length; ++i) {
            ciphers[i] = this.ciphers.get(i).name;
        }
        return ciphers;
    }

    protected void init(String spec) {
        StringTokenizer tokens = new StringTokenizer(spec, ":");

        while (tokens.hasMoreTokens()) {
            initSegment(tokens.nextToken());
        }
    }

    protected void initSegment(String segment) {
        if (segment.startsWith("+")) {
            processPlus(segment.substring(1));
        } else if (segment.startsWith("-")) {
            processMinus(segment.substring(1));
        } else if (segment.startsWith("!")) {
            processBlacklist(segment.substring(1));
        } else {
            List<Cipher> matched = match(segment);
            matched.removeAll(this.blacklisted);
            matched.retainAll(this.supported);
            this.ciphers.addAll(matched);
        }
    }

    private String namesOf(List<Cipher> ciphers) {
        StringBuffer str = new StringBuffer();
        for ( Cipher each : ciphers ) {
            str.append( each.name ).append( " " );
        }
        return str.toString();
    }

    protected void processPlus(String segment) {
        List<Cipher> matched = match(segment);
        matched.retainAll(this.ciphers);
        this.ciphers.removeAll(matched);
        this.ciphers.addAll(matched);
    }

    protected void processMinus(String segment) {
        List<Cipher> matched = match(segment);
        this.ciphers.removeAll(matched);
    }

    protected void processBlacklist(String segment) {
        List<Cipher> matched = match(segment);
        this.ciphers.removeAll(matched);
        this.blacklisted.addAll(matched);
    }

    protected List<Cipher> match(String segment) {
        StringTokenizer tokens = new StringTokenizer(segment, "+");

        List<Cipher> matched = new ArrayList<>();

        boolean first = true;

        while (tokens.hasMoreTokens()) {
            String token = tokens.nextToken();
            if (first) {
                matched = Cipher.get(token);
                first = false;
            } else {
                matched.retainAll(Cipher.get(token));
            }
        }

        return matched;
    }

}
