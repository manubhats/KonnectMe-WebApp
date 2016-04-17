$( document ).ready(function() {
    var recipients = 1;
    var phone_number;
    $("#add").on('click', function() {
    	if (recipients < 3) {
    		recipients++;
    		var to_add = '<div id="'+recipients+'"><input class="form-control" id="recipientName'+recipients+'" placeholder="Your Guest\'s Name" type="text"><input class="form-control" id="recipientNumber'+recipients+'" placeholder="Your Guest\'s Phone Number" type="text"><input class="form-control" id="recipientEmail'+recipients+'" placeholder="Your Guest\'s Email" type="text"><hr/></div>';
    		$("#recipients").append(to_add);
    	}
    });

    $("#invite").on('click', function() {
    	$("input").prop("disabled", true);
    	var name = $("#inputName").val();
    	phone_number = $("#inputNumber").val();
    	var event_name = $("#eventName").val();
    	var event_description = $("#eventDescription").val();

    	var data = "=", obj;
    	obj = {
    		username: name, 
            user_number: phone_number,
            eventID: '1', 
            userID: '1', 
            name: $("#recipientName1").val(), 
            number: $("#recipientNumber1").val(),
            eventName: event_name, 
            eventDesc: event_description
    	};
    	data += JSON.stringify(obj) + '\n';
    	if ($("#2").length) {
    		obj = {
	    		username: name, 
	            user_number: phone_number,
	            eventID: '1', 
	            userID: '2', 
	            name: $("#recipientName2").val(), 
	            number: $("#recipientNumber2").val(),
	            eventName: event_name, 
	            eventDesc: event_description
	    	};
	    	data += JSON.stringify(obj) + '\n';
    		if ($("#3").length) {
    			obj = {
		    		username: name, 
		            user_number: phone_number,
		            eventID: '1', 
		            userID: '3', 
		            name: $("#recipientName3").val(), 
		            number: $("#recipientNumber3").val(),
		            eventName: event_name, 
		            eventDesc: event_description
		    	};
		    	data += JSON.stringify(obj) + '\n';
    		}
    	}

    	$.post(
    		"http://ec2-52-36-37-169.us-west-2.compute.amazonaws.com:8080/api/call/",
    		data,
    		null,
    		"text");
    });

	window.setInterval(function() {
	    $.post(
	    	"http://ec2-52-36-37-169.us-west-2.compute.amazonaws.com:8080/api/update/",
	    	"=" + phone_number,
	    	function (data, status, xhr) {
	    		console.log(data);
	    	},
	    	"text"
	    );
	}, 1000);
});