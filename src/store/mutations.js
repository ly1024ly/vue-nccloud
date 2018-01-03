import {
  USER_INFO,
  FOCUS_MACHINE,
  MQTT
} from './mutation-types.js'
import NcMqttClient from '../mqtt/mqttEchart.js';
var mqtt = require('mqtt')
const NCMQTTURL = "wss://mqtt.nccloud.weihong.com.cn";
const NCMQTTPORT = Number(8883);


export default {
	[USER_INFO](state,user){
    state.user = user;
  },
  [FOCUS_MACHINE](state,machine){  
    state.focMachine = machine;
  },
  [MQTT](state,arr){
    function fn(a,b,c,d){
     console.log(a + " " + b + " " + c + " " +d)
    };
    var productionMqtt = new NcMqttClient("ly1024", "ly1024", function(_1, _2, _3, _4) {
      console.log("111111111111111")
      fn(_1, _2, _3, _4)  
      console.log(_1, _2, _3, _4)     
    });
    console.log(productionMqtt)

    console.log(arr)
    productionMqtt.connect(arr)
   
}

}