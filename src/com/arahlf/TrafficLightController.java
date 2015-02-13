package com.arahlf;

/**
 * Created by arahlf on 2/12/15.
 */
public interface TrafficLightController {

    public void light(Signal signal);

    public void flash(Signal signal);

    public void turnLightsOff();
}
