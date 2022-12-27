var express = require('express');
var mongoose = require('mongoose');
var Dentist = require('./model/dentist');
var dentistsController = require("./controller/dentists");
var mqtt = require("mqtt");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })


// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Dentistimo:QsyJymgvpYZZeJPc@cluster0.hnkdpp5.mongodb.net/?retryWrites=true&w=majority'; 
var port = process.env.PORT || 3000;
// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
}); 

const options = {
  host: '45fb8d87df7040eb8434cea2937cfb31.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'Team5@Broker',
  password: 'Team5@Broker'
}

const client = mqtt.connect(options)

  // let topic = "dentist/";
  let topic = "dentist/getAllDentists"


  client.on("message", function (topic, message) {
    console.log(String.fromCharCode.apply(null, message)); 
  });

  client.on("message", (topic, payload) => {
    console.log('Received message here:', topic, payload.toString());
    //console.log(payload.toString());
  });
  
  
  client.on("connect", () => {
    console.log("Connected!");
  });
  

  client.on("error", (error) => {
    console.log("Error:", error);
  });
  
  
  client.subscribe("dentists");
/*   client.subscribe("dentist/getdentistbyId");
  client.publish("message1", 'yup this message one');

  if (topic == "dentist/getAllDentists") {
    Dentist.find(function (err, dentists) {
      if (err) {
        return next(err);
      }
      let dentistsJson = JSON.stringify(dentists);
      client.publish("dentist/getAllDentists", dentistsJson, { qos: 1, retain: true },
        (error) => {
          if (error) {
            console.error(error);
          }
        }
      );
    });
  } 
  if (topic == "dentist/getdentistbyId") {
      Dentist.findOne({ _id: payload.toString() }).exec(function (err, dentists) {
          if (err) {
              return next(err);
          }
          let dentistsJson = JSON.stringify(dentists);
          client.publish(
              "ui/dentist/getdentistbyId",
              dentistsJson,
              { qos: 1, retain: true },
              (error) => {
                  if (error) {
                      console.error(error);
                  }
              }
          );
      });
  } 

  /*function getDentist(topic, payload, next) {

   if (topic == "dentist/getdentistbyId") {
      Dentist.findOne({ _id: payload.toString() }).exec(function (err, dentists) {
          if (err) {
              return next(err);
          }
          let dentistsJson = JSON.stringify(dentists);
          client.publish(
              "ui/dentist/getdentistbyId",
              dentistsJson,
              { qos: 1, retain: true },
              (error) => {
                  if (error) {
                      console.error(error);
                  }
              }
          );
      });
  } else if (topic == "dentist/getAllDentists") {
    Dentist.find(function (err, dentists) {
      if (err) {
        return next(err);
      }
       console.log("Dental Clinic", dentists);

       let dentistsJson = JSON.stringify(dentists);
       client.publish("dentist/getAllDentists", dentistsJson, { qos: 1, retain: true },
         (error) => {
           if (error) {
             console.error(error);
           }
              }
          );
      });
  }
} */
 
client.subscribe('dentist/get-AllDentists', function () {
  // When a message arrives, print it to the console
  client.on('message', function (topic, message) {

    console.log("Received this lovely " + message + "  on " + topic + " all den")
    
    if (topic == "dentist/get-AllDentists") {
      Dentist.find(function (err, dentists) {
        if (err) {
          return next(err);
        }
        let dentistsJson = JSON.stringify(dentists);
        client.publish("ui/dentist/getAllDentists", dentistsJson, 1 ,
          (error) => {
            if (error) {
              console.error(error);
            }
            console.log("sent to ui!" )
            //console.log("sent to ui!" + dentistsJson);
          }
        );
      });
    } else if (topic == "dentist/getdentistbyId") {
      Dentist.findOne({ _id: message.toString() }).exec(function (err, dentists) {
        /* if (err) {
          return next(err);
        } */
          let dentistsJson = JSON.stringify(dentists);
          client.publish(
              "ui/dentist/getdentistbyId",
              dentistsJson, 1,
              (error) => {
                  if (error) {
                      console.error(error);
                  }
                  console.log("sent to ui for this 1!" + dentistsJson);
              }
          );
      });
    } 

})
}) 

client.subscribe('dentist/getdentistbyId', function () {
  // When a message arrives, print it to the console
  client.on('message', function (topic, message) {

    console.log("Received this lovely " + message + "  on " + topic + " all den")
    
    if (topic == "dentist/getdentistbyId") {
      Dentist.find(
        { _id: message.toString() },
        function (err, dentists) {
    
        /* if (err) {
          return next(err);
        } */
          let dentistsJson = JSON.stringify(dentists);
          client.publish(
              "ui/dentist/getdentistbyId",
              dentistsJson, 2,
              (error) => {
                  if (error) {
                      console.error(error);
                  }
                  console.log("sent to ui for this 1!" + dentistsJson);
              }
          );
      });
    } 

})
}) 



client.subscribe("dentist/getdentistbyId");

/* if (topic == "dentist/getdentistbyId") {
  Dentist.findOne({ _id: payload.toString() }).exec(function (err, dentists) {
      if (err) {
          return next(err);
      }
      let dentistsJson = JSON.stringify(dentists);
      client.publish(
          "ui/dentist/getdentistbyId",
          dentistsJson,
          { qos: 1, retain: true },
          (error) => {
              if (error) {
                  console.error(error);
              }
          }
      );
  });
}  */
/* client.subscribe('dentist/getdentistbyId', function () {
  // When a message arrives, print it to the console
  client.on('message', function (topic, message) {

    console.log("Received this lovely " + message + "  on " + topic + " this 0ne found")
    
    if (topic == "dentist/getdentistbyId") {
      Dentist.findOne({ _id: message.toString() }).exec(function (err, dentists) {
          if (err) {
              return next(err);
          }
          let dentistsJson = JSON.stringify(dentists);
          console.log("sent to ui!" + dentistsJson);
          client.publish(
              "ui/dentist/getdentistbyId",
              dentistsJson,
              { qos: 1, retain: false },
              (error) => {
                  if (error) {
                      console.error(error);
                  }
                  console.log("sent to ui!" + dentistsJson);
              }
          );
      });
  }  

})
}) */









