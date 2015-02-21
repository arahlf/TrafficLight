package com.arahlf;

/**
 * Created by arahlf on 2/12/15.
 */
public interface TrafficLightController {

    public void light(Lamp lamp);

    public void flash(Lamp lamp);

    public void turnOff();
}
