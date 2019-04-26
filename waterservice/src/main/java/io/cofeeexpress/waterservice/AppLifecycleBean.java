package io.cofeeexpress.waterservice;

import javax.enterprise.context.ApplicationScoped;

import com.instana.opentracing.InstanaTracer;

import io.opentracing.Tracer;

@ApplicationScoped
public class AppLifecycleBean {

    private static final Tracer tracer = new InstanaTracer();

}
