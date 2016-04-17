import { Router } from 'express';
import {call} from '../lib/tropo.js';
require('tropo-webapi-node');

let pending_requests = [];
const apostrophe = "'";

export default function() {

	let router = Router();
    let json;

	router.use(function(req, res, next) {
        // do logging
        console.log('Something is happening.');
        req.addListener('data', function(data){
            json = data.toString();
        });
        next();
    });

    router.post('/', function(req, res) {
        req.addListener('end', function(){

            let tropo = new TropoWebAPI();

            let session = (JSON.parse(json)).session.parameters;

            console.log(`Received request for ID ${(JSON.parse(json)).session.id}`);

            tropo.call(session.recipient_phone_number, null, null, session.initiator_phone_number);
            
            tropo.say(`. . . Hey ${session.recipient_name}. You have been invited by ${session.initiator_name} to ${session.event_name}. ${session.initiator_name}${apostrophe}s message to you is: ${session.message}.`);
    
            // Demonstrates how to use the base Tropo action classes.
            let say = new Say(`Would you like to join in? Press 1 or say yes to join, or say no or press 2 to decline.`);
            let choices = new Choices("yes(1, yes), no(2, no)");
        
            // Action classes can be passes as parameters to TropoWebAPI class methods.
            tropo.ask(choices, 3, true, null, (JSON.parse(json)).session.id, null, true, say, 5, null);
            tropo.on("continue", null, '/api/answer', true);
            tropo.on("incomplete", null, '/api/noanswer', true);
            tropo.on("hangup", null, "/api/error", true);
            tropo.on("error", null, "/api/error", true);

            res.writeHead(200, {'Content-Type': 'application/json'});   
            res.end(TropoJSON(tropo));

            // Create and populate new request object
            let new_request = {
                id: (JSON.parse(json)).session.id,
                initiator_phone_number: session.initiator_phone_number,
                event_id: session.event_id,
                recipient_id: session.recipient_id
            };

            // Push the new request into the pending array
            pending_requests.push(new_request);
        });
    });

    router.route('/answer')

    .post(function(req, res) {
        req.addListener('end', function() {
            let tropo = new TropoWebAPI();

            // Create a new instance of the Session object and give it the JSON delivered from Tropo.
            console.log(json);
            let result = Result(json);
            let id = result.sessionId;
            for (let i = 0; i < pending_requests.length; i++) {
                if (pending_requests[i].id == id) {
                    console.log(`Received ${result.value} response for ID ${id}`);
                    pending_requests[i].response = result.value;
                }
            }

            tropo.say("Thank you for you response. Have a great day!");

            res.writeHead(200, {'Content-Type': 'application/json'});   
            res.end(TropoJSON(tropo));
        });
    });

    router.route('/noanswer')

    .post(function(req, res) {
        req.addListener('end', function() {
            let tropo = new TropoWebAPI();
            console.log(json);
            let result = Result(json);
            let id = result.sessionId;
            for (let i = 0; i < pending_requests.length; i++) {
                if (pending_requests[i].id == id) {
                    console.log(`Received ${result.value} response for ID ${id}`);
                    pending_requests[i].response = "no";
                }
            }

            tropo.say("You have not given a response, so we cannot confirm your interest. Have a great day!");

            res.writeHead(200, {'Content-Type': 'application/json'});   
            res.end(TropoJSON(tropo));
        });
    });

    router.route('/error')

    .post(function(req, res) {
        req.addListener('end', function() {
            console.log(json);
            let result = Result(json);
            let id = result.sessionId;
            for (let i = 0; i < pending_requests.length; i++) {
                if (pending_requests[i].id == id) {
                    console.log(`Received ${result.value} response for ID ${id}`);
                    pending_requests[i].response = "no";
                }
            }
        });
    });

    router.route('/call')

    // Handle new call request
    .post(function(req, res) {
        let data = "";
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            data = decodeURIComponent(data.replace(/\+/g,  " "));
            data = data.substring(1);
            let data_array = data.split('\n');
            for (let i = 0; i < data_array.length; i++) {
                try {
                    data = JSON.parse(data_array[i]);
                    call(data.username, 
                        data.user_number,
                        data.eventID, 
                        data.userID, 
                        data.name, 
                        data.number,
                        data.eventName, 
                        data.eventDesc);
                } catch (e) {
                    console.log(e);
                }
            } 
        });
    });


    router.route('/update')

    // Handle new update request
    .post(function(req, res) {
        /*Assume data is parsed into format: 
        let data = {
            initiator_phone_number: x
        };

        let i = 0;
        result = [];
        while (i < pending_requests.length) {
            if (pending_requests[i].initiator_phone_number == data.initiator_phone_number) {
                result.push({
                    event_id: pending_requests[i].event_id,
                    contact_id: pending_requests[i].contact_id,
                    response: pending_requests[i].response
                });
                pending_requests.splice(i, 1);
            } else {
                i++;
            }
        }
        res.end(JSON.stringify(result));*/
    });

    //call("Hussain", "14692699928", "1", "1", "Revanth", "19312848422", "HackDFW", "Let's go to HackDFW");
    //call("Revanth", "19312848422", "2", "2", "Hussain", "14692699928", "Six Flags", "Let's go to Six Flags");
	//call("Manu", "19312848422", "2", "2", "Hussain", "6825648880", "Let's go to Six Flags");

    return router;
}