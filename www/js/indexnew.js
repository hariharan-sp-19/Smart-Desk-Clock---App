
/*
index.js
*/

var connect = false;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.con();
    },
    con:function(){
      alert('trying to connect');
      cordova.plugins.CordovaMqTTPlugin.connect({
                url:"tcp://ec2-54-235-28-187.compute-1.amazonaws.com", //a public broker used for testing purposes only. Try using a self hosted broker for production.
                port:"1883",
                clientId:"prototype",
                success:function(s){
                    connect = true;
                    console.log(JSON.stringify(s));
                    alert('connected');
                    
                },
                error:function(e){
                    connect = false;
                  alert('error');
                    console.log(e);
                },
                onConnectionLost:function (){
                  connect = false;
                    alert('connection lost');
                }
            });
    }
};
app.initialize();