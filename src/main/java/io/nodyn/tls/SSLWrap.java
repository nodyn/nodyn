package io.nodyn.tls;

import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.handler.ssl.SslHandler;
import io.netty.util.concurrent.Future;
import io.netty.util.concurrent.GenericFutureListener;
import io.nodyn.CallbackResult;
import io.nodyn.NodeProcess;
import io.nodyn.async.AsyncWrap;
import io.nodyn.crypto.SecureContext;
import io.nodyn.stream.StreamWrap;

import javax.net.ssl.SSLEngine;
import javax.net.ssl.SSLPeerUnverifiedException;
import java.security.cert.Certificate;
import java.security.cert.CertificateEncodingException;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @author Bob McWhirter
 */
public class SSLWrap extends AsyncWrap {

    private SSLEngine sslEngine;
    private StreamWrap stream;
    private SecureContext context;
    private boolean requestCert;
    private boolean rejectUnauthorized;
    private AtomicBoolean started = new AtomicBoolean(false);
    private boolean isServer;

    public SSLWrap(NodeProcess process) {
        super(process);
    }

    public void init(StreamWrap stream, SecureContext context, final boolean isServer) throws Throwable {
        this.stream = stream;
        this.context = context;
        this.isServer = isServer;
        try {
            this.sslEngine = context.getSSLEngine();
        } catch (Throwable t) {
            this.process.getNodyn().handleThrowable(t);
            return;
        }
        if (isServer) {
            start(isServer);
        }
    }

    public void start() throws Exception {
        start(false);
    }

    public void start(final boolean isServer) throws Exception {

        this.sslEngine.setUseClientMode(!isServer);

        SslHandler sslHandler = new SslHandler(this.sslEngine);
        Future<Channel> handleshake = sslHandler.handshakeFuture();
        handleshake.addListener(new GenericFutureListener<Future<? super Channel>>() {
            @Override
            public void operationComplete(Future<? super Channel> future) throws Exception {
                if (future.isSuccess()) {
                    emit("handshakedone", CallbackResult.EMPTY_SUCCESS);
                    if (isServer) {
                        emit("newsession", CallbackResult.createSuccess("foo", "bar"));
                    }
                } else {
                    emit("handshakedone", CallbackResult.EMPTY_SUCCESS);
                }
            }
        });

        if (stream.getPipeline().get("debug") != null) {
            stream.getPipeline().addAfter("debug", "ssl", sslHandler);
        } else {
            stream.getPipeline().addFirst(sslHandler);
        }
        started.set(true);
        emit("handshakestart", CallbackResult.EMPTY_SUCCESS);

    }


    public void receive(ByteBuf buf) {
        this.stream.getPipeline().fireChannelRead(buf);
        this.stream.getPipeline().fireChannelReadComplete();
    }

    public Certificate getPeerCertificate() throws SSLPeerUnverifiedException, CertificateEncodingException {
        try {
            return this.sslEngine.getSession().getPeerCertificates()[0];
        } catch (SSLPeerUnverifiedException e) {
            return null;
        }
    }

    public boolean started() {
        return started.get();
    }

    public String getServername() {
        return this.sslEngine.getPeerHost();
    }

    public void setServername() {
        if (started()) {
            this.process.getNodyn().handleThrowable(new Exception("Already started"));
            return;
        } else if (isServer) {
            return;
        }
        // TODO: hrm
        // this.sslEngine;
    }

    public String getNegotiatedProtocol() {
        return this.sslEngine.getSession().getProtocol();
    }

    public void setVerifyMode(boolean requestCert, boolean rejectUnauthorized) {
        if (this.sslEngine != null) {
            // if it's null, it's on the client, and it doesn't really matter, does it?
            this.sslEngine.setWantClientAuth(requestCert);
            this.sslEngine.setNeedClientAuth(rejectUnauthorized);
        }
    }

}
