package com.example.waterservice;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.concurrent.TimeUnit;

public class WaterResource {

    @GET
    @Path("/dispense")
    @Produces("text/plain")
    public String dispense() throws Exception {
        TimeUnit.MILLISECONDS.sleep(400);
        if (Math.random() <= 0.3) {
            return "false";
        } else {
            return "true";
        }
    }
}
