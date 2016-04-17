import { Router } from 'express';

export default function() {

	let router = Router();

	router.use(function(req, res, next) {
        // do logging
        console.log('Something is happening.');
        next();
    });

    router.get('/', function(req, res) {
        res.json({ message: 'welcome to our api!' });
    });

    router.route('/call')

    // scan a URL
    .post(function(req, res) {
        let param = req.body.phone_number;
    });

    return router;
}