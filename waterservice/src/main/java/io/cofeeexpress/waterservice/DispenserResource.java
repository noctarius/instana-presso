package io.cofeeexpress.waterservice;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/dispense")
public class DispenserResource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String dispense() throws InterruptedException {
        Thread.sleep(400);
        if (Math.random() <= 0.3) {
            return "false";
        } else {
            return "true";
        }
    }
}