
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
        app.con();
    },
    con:function(){
      //alert('trying to connect');
      cordova.plugins.CordovaMqTTPlugin.connect({
                url:"tcp://ec2-54-235-28-187.compute-1.amazonaws.com", //a public broker used for testing purposes only. Try using a self hosted broker for production.
                port:"1883",
                clientId:"prototype",
                success:function(s){
                    connect = true;
                    console.log(JSON.stringify(s));
                    document.getElementById("activity").innerHTML = "Connected";
                    app.receivedEvent('deviceready');
                    //document.getElementById("connect").style.display = "none";
                 //   document.getElementById("disconnect").style.display = "block";
                  //  document.getElementById("activity").innerHTML += "--> Success: you are connected to, "+document.getElementById("url").value+":"+document.getElementById("port").value+"<br>"
                },
                error:function(e){
                    connect = false;
                  //  document.getElementById("activity").innerHTML += "--> Error: something is wrong,\n "+JSON.stringify(e)+"<br>";
                  //  document.getElementById("connect").style.display = "block";
                  //  document.getElementById("disconnect").style.display = "none";
                  //  alert("err!! something is wrong. check the console")
                    console.log(e);
                },
                onConnectionLost:function (){
                  connect = false;
                  document.getElementById("activity").innerHTML = "DisConnected";
                 //   document.getElementById("activity").innerHTML += "--> You got disconnected";
                 //   document.getElementById("connect").style.display = "block";
                 //   document.getElementById("disconnect").style.display = "none";
                }
            });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

 if (!connect) {
              alert("First establish connection then try to subscribe");
            } else {
              cordova.plugins.CordovaMqTTPlugin.subscribe({
                topic:"HacksterProjectTx",
                qos:0,
                success:function(s){
             //     document.getElementById("subscribe").style.display = "none";
             //alert('sub');
             //    document.getElementById("unsubscribe").style.display = "block";
              //    document.getElementById("activity").innerHTML += "--> Success: you are subscribed to the topic, "+"HacksterProjectTx"+"<br>"
                  //get your payload here
                  //Deprecated method
cordova.plugins.CordovaMqTTPlugin.listen("HacksterProjectTx",function (payload,params,topic,topic_pattern) {
                      //params will be an empty object if topic pattern is NOT used. 
                      //document.getElementById("activity").innerHTML += "--> Payload for"+topic+" topic: "+JSON.stringify(payload)+"<br>"
                      if(payload == "NIGHTM" || payload == "LIVINGM" || payload== "RGBM" || payload=="CABINM"||payload=="SURVEILLANCEM"){
                      alert(payload);
                    }
                    if(payload=="INTRUSION ALERT"){
                    cordova.plugins.notification.local.schedule({
  id         : 1,
  title      : 'SURVEILLANCE MODE',
  text       : 'INTRUSION ALERT',
  sound      : null,
  autoClear  : false,
  at         : new Date(new Date().getTime() + 1)
});
                  }
                  });
                },
                error:function(e){
                  //document.getElementById("activity").innerHTML += "--> Error: something is wrong when subscribing to this topic, "+e+"<br>";
                  //document.getElementById("subscribe").style.display = "block";
                  //document.getElementById("unsubscribe").style.display = "none";
                  //alert("err!! something is wrong. check the console")
                  alert('subscribe error')
                  console.log(e);
                }
            });
            }


/*        document.getElementById("disconnect").addEventListener('touchend',function(e){
            document.getElementById("connect").style.display = "block";
            document.getElementById("disconnect").style.display = "none";
            cordova.plugins.CordovaMqTTPlugin.disconnect({
              success:function(s){
                connect = false;
                document.getElementById("connect").style.display = "block";
                document.getElementById("disconnect").style.display = "none";
                document.getElementById("activity").innerHTML += "--> Success: you are now disconnected"+"<br>"
              },
              error:function(e){
                document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                document.getElementById("connect").style.display = "none";
                document.getElementById("disconnect").style.display = "block";
                //alert("err!! something is wrong. check the console")
                console.log(e);
              }
            });
        });
        document.getElementById("subscribe").addEventListener('touchend',function(ev){
            if (!connect) {
              alert("First establish connection then try to subscribe");
            } else {
              cordova.plugins.CordovaMqTTPlugin.subscribe({
                topic:document.getElementById("topic_sub").value,
                qos:0,
                success:function(s){
                  document.getElementById("subscribe").style.display = "none";
                  document.getElementById("unsubscribe").style.display = "block";
                  document.getElementById("activity").innerHTML += "--> Success: you are subscribed to the topic, "+document.getElementById("topic_sub").value+"<br>"
                  //get your payload here
                  //Deprecated method
                  document.addEventListener(document.getElementById("topic_sub").value,function (e) {
                      e.preventDefault();
document.getElementById("activity").innerHTML += "--> Payload for"+e.topic+" topic: "+JSON.stringify(e.payload)+"<br>"
                  });
cordova.plugins.CordovaMqTTPlugin.listen(document.getElementById("topic_sub").value,function (payload,params,topic,topic_pattern) {
                      //params will be an empty object if topic pattern is NOT used. 
                      document.getElementById("activity").innerHTML += "--> Payload for"+topic+" topic: "+JSON.stringify(payload)+"<br>"
                  })
                },
                error:function(e){
                  document.getElementById("activity").innerHTML += "--> Error: something is wrong when subscribing to this topic, "+e+"<br>";
                  document.getElementById("subscribe").style.display = "block";
                  document.getElementById("unsubscribe").style.display = "none";
                  //alert("err!! something is wrong. check the console")
                  console.log(e);
                }
              });
            }
        });
        document.getElementById("unsubscribe").addEventListener('touchend',function(ev){
            cordova.plugins.CordovaMqTTPlugin.unsubscribe({
              topic:document.getElementById("topic_sub").value,
              success:function(s){
                document.removeEventListener(document.getElementById("topic_sub").value);
                document.getElementById("unsubscribe").style.display = "none";
                document.getElementById("subscribe").style.display = "block";
                document.getElementById("activity").innerHTML += "--> Success: you are unsubscribed to the topic, "+document.getElementById("topic_sub").value+"<br>"
                document.getElementById("topic_sub").value = "";
              },
              error:function(e){
                document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                document.getElementById("subscribe").style.display = "block";
                document.getElementById("unsubscribe").style.display = "none";
                //alert("err!! something is wrong. check the console")
                console.log(e);
              }
            });
        });
        document.getElementById("publish").addEventListener('touchend',function(ev){
          if (!connect) {
            alert("First establish connection then try to publish")
          } else {
            cordova.plugins.CordovaMqTTPlugin.publish({
              topic:document.getElementById("topic_pub").value,
              payload:document.getElementById("payload").value,
              qos:0,
              retain:false,
              success:function(s){
                document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
              },
              error:function(e){
                document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                //alert("err!! something is wrong. check the console")
                console.log(e);
              }
            });
          }
        });*/
        document.getElementById("sur").addEventListener('touchend',function(ev){
          if (!connect) {
            alert("First establish connection then try to publish")
          } else {
            cordova.plugins.CordovaMqTTPlugin.publish({
              topic:'HacksterProjectRx',
              payload:'SURVEILLANCEM',
              qos:0,
              retain:false,
              success:function(s){
               // document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
              },
              error:function(e){
               // document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                //alert("err!! something is wrong. check the console")
                console.log(e);
              }
            });
          }
        });
                document.getElementById("cab").addEventListener('touchend',function(ev){
          if (!connect) {
            alert("First establish connection then try to publish")
          } else {
            cordova.plugins.CordovaMqTTPlugin.publish({
              topic:'HacksterProjectRx',
              payload:'CABINM',
              qos:0,
              retain:false,
              success:function(s){
               // document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
              },
              error:function(e){
               // document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                //alert("err!! something is wrong. check the console")
                console.log(e);
              }
            });
          }
        });
             document.getElementById('n').addEventListener('touchend',function(ev){
          if (!connect) {
            alert("First establish connection then try to publish")
          } else {
            cordova.plugins.CordovaMqTTPlugin.publish({
              topic:'HacksterProjectRx',
              payload:'NIGHTM',
              qos:0,
              retain:false,
              success:function(s){
             //   document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
              },
              error:function(e){
               // document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                //alert("err!! something is wrong. check the console")
                console.log(e);
              }
            });
          }
        });
                  document.getElementById('rgb').addEventListener('touchend',function(ev){
          if (!connect) {
            alert("First establish connection then try to publish")
          } else {
            cordova.plugins.CordovaMqTTPlugin.publish({
              topic:'HacksterProjectRx',
              payload:'RGBM',
              qos:0,
              retain:false,
              success:function(s){
              //  document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
              },
              error:function(e){
               // document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                //alert("err!! something is wrong. check the console")
                console.log(e);
              }
            });
          }
        });
                       document.getElementById("liv").addEventListener('touchend',function(ev){
          if (!connect) {
            alert("First establish connection then try to publish")
          } else {
            cordova.plugins.CordovaMqTTPlugin.publish({
              topic:'HacksterProjectRx',
              payload:'LIVINGM',
              qos:0,
              retain:false,
              success:function(s){
              //  document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
              },
              error:function(e){
               // document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                //alert("err!! something is wrong. check the console")
                console.log(e);
              }
            });
          }
        });
                       document.getElementById('hexrgbsend').addEventListener('click',function(ev){
                        var json = hexToRgb(document.getElementById('chosen-value').value);
                        //alert(JSON.stringify(json));
                        var str = 'RGB:'+json.r+","+json.g+","+json.b+".";
                        //alert(str);
                         if (!connect) {
            alert("First establish connection then try to publish")
          } else {
            cordova.plugins.CordovaMqTTPlugin.publish({
              topic:'HacksterProjectRx',
              payload:str,
              qos:0,
              retain:false,
              success:function(s){
              //  document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
              },
              error:function(e){
               // document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                //alert("err!! something is wrong. check the console")
                console.log(e);
              }
            });
          }
                       });

        console.log('Received Event: ' + id);
    },
    append:function (id,s) {
      // it is just a string append function. Nothing to do with the MQTT functions
      var node = document.createElement("p");                 // Create a <li> node
      var textnode = document.createTextNode(s);         // Create a text node
      node.appendChild(textnode);                              // Append the text to <li>
      document.getElementById(id).appendChild(node);     // Append <li> to <ul> with id="myList"
    },
sendcolormqtt:function(x){
var json = hexToRgb(x);
                        //alert(JSON.stringify(json));
                        var str = 'RGB:'+json.r+","+json.r+","+json.b+".";
                        //alert(str);
                         if (!connect) {
            alert("First establish connection then try to publish")
          } else {
            cordova.plugins.CordovaMqTTPlugin.publish({
              topic:'HacksterProjectRx',
              payload:str,
              qos:0,
              retain:false,
              success:function(s){
              //  document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+document.getElementById("topic_sub").value+"<br>";
              },
              error:function(e){
               // document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
                //alert("err!! something is wrong. check the console")
                console.log(e);
              }
            });
          }
}
};
app.initialize();