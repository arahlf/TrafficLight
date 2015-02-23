package com.arahlf.trafficlightremote;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.util.ArrayList;
import java.util.List;


public class MainActivity extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final RequestQueue queue = Volley.newRequestQueue(this);

        final ListView commandListView = (ListView) findViewById(R.id.commandListView);

        final String API_URL = "http://192.168.1.3:8080/trafficlight";

        final List<Command> commands = new ArrayList<>();
        commands.add(Command.build("Light Red", "light", "on", "lamp", "red"));
        commands.add(Command.build("Light Yellow", "light", "on", "lamp", "yellow"));
        commands.add(Command.build("Light Green", "light", "on", "lamp", "green"));
        commands.add(Command.build("Flash Red", "light", "flashing", "lamp", "red"));
        commands.add(Command.build("Flash Yellow", "light", "flashing", "lamp", "yellow"));
        commands.add(Command.build("Flash Green", "light", "flashing", "lamp", "green"));
        commands.add(Command.build("Lights Off", "light", "off"));

        final ArrayAdapter<Command> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, commands);

        commandListView.setAdapter(adapter);

        commandListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                if (_selectedListItemView != null) {
                    _selectedListItemView.setBackgroundColor(getResources().getColor(android.R.color.transparent));
                }

                view.setBackgroundColor(getResources().getColor(R.color.accent_material_dark));

                _selectedListItemView = view;

                JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, API_URL, commands.get(position).getParams(), null, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e(this.getClass().getName(), "Error sending command: " + error.getMessage());
                    }
                });

                queue.add(request);
            }
        });
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private View _selectedListItemView;
}
