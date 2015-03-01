package com.arahlf.trafficlightremote;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by arahlf on 2/22/15.
 */
public class Command {

    public static Command build(String name, String... paramList) {
        if (paramList.length % 2 != 0) {
            throw new IllegalArgumentException("Cannot have odd number of params to make key/value pairs.");
        }

        JSONObject params = new JSONObject();

        for (int i = 0; i < paramList.length; i+= 2) {
            try {
                params.put(paramList[i], paramList[i + 1]);
            } catch (JSONException e) {
                throw new IllegalArgumentException(e);
            }
        }

        return new Command(name, params);
    }

    public String getName() {
        return _name;
    }

    public JSONObject getParams() {
        return _params;
    }

    @Override
    public String toString() {
        return _name;
    }

    private Command(String name, JSONObject params) {
        _name = name;
        _params = params;
    }

    private final String _name;
    private final JSONObject _params;
}
