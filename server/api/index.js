import { Router } from 'express';
import {call} from '../lib/tropo.js';
require('tropo-webapi-node');

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
            console.log("Creating Tropo");
            let tropo = new TropoWebAPI();

            // Create a new instance of the Session object and give it the JSON delivered from Tropo.
            let session = (JSON.parse(json)).session.parameters;

            tropo.call(`${session.recipient_phone_number}`);
            
            tropo.say(`Hey ${session.recipient_name}. You have been invited by ${session.initiator_name} to ${session.message}.`);
    
            // Demonstrates how to use the base Tropo action classes.
            let say = new Say(`Would you like to join in? Press 1 or say yes to join, or say no or press 2 to decline.`);
            let choices = new Choices("yes(1, yes), no(2, no)");
        
            // Action classes can be passes as parameters to TropoWebAPI class methods.
            tropo.ask(choices, 3, false, null, "foo", null, true, say, 5, null);
            tropo.on("continue", null, '/api/answer', true);
            tropo.on("incomplete", null, '/api/noanswer', true);

            res.writeHead(200, {'Content-Type': 'application/json'});   
            res.end(TropoJSON(tropo));
            console.log("Sent Tropo: \n");
            console.log(TropoJSON(tropo));
        });
    });

    router.route('/answer')

    .post(function(req, res) {
        req.addListener('end', function() {
            let tropo = new TropoWebAPI();

            // Create a new instance of the Session object and give it the JSON delivered from Tropo.
            let result = Result(json);

            tropo.say("Thank you for you response");

            console.log(result);

            res.writeHead(200, {'Content-Type': 'application/json'});   
            res.end(TropoJSON(tropo));
        });
    });

    router.route('/noanswer')

    .post(function(req, res) {
        req.addListener('end', function() {
            let tropo = new TropoWebAPI();

            res.writeHead(200, {'Content-Type': 'application/json'});   
            res.end(TropoJSON(tropo));
        });
    });

    router.route('/call')

    // scan a URL
    .post(function(req, res) {

        /*// Create a new instance of the Session object and give it the JSON delivered from Tropo.
        let session = Session(json);

        //call based on json data

        let request = req.body.request;
        request = JSON.parse(request);
        let initiator_name = request.initiator_name;
        let message = request.message;
        let recipients = request.recipients;
        for ()*/
    });

    call("Manu", "Harshit", "16822304080", "Let's go to HackDFW");

    return router;
}