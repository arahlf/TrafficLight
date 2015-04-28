Overview
========

Contains an Arduino sketch and a Node script used to hook up a modified [Lava Lite Traffic Light](http://www.amazon.com/Lava-Lite-1815-4-Traffic-Light/dp/B001ETWW0M) to a Jenkins CI server.  The traffic light was modified to have an embedded Arduino inside it.

How To Use
========

1. Upload arduino/trafficLight/trafficLight.ino sketch to Arduino
2. Start node script in jenkins folder: `node monitor.js jenkins_url`
