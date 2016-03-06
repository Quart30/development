
$(function () {

    getDate();
    $(startTime);
    $(fetchAppointments);
    //$(table);
    //$(poll);
});

function dateToString(date) {
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var month = date.getMonth();
    var day = date.getDate();
    var dateOfString = (('' + month).length < 2 ? '' : '') + monthNames[month] + ' ';
    dateOfString += (('' + day).length < 2 ? '0' : '') + day + ' ';
    dateOfString += date.getFullYear();
    return dateOfString;


}

<<<<<<< HEAD
function getDate(){
	var currentdate = new Date();
	var datetime = '';
	datetime += dateToString(currentdate);
=======
function getDate() {
    var currentdate = new Date();
    var datetime = '';
    datetime += dateToString(currentdate);
>>>>>>> a9dae80535778e732c79b0fcfd5aa3ade9b55b48


    var $header = $('<h1/>');
    $header.append(datetime);
    $('#currentDate').replaceWith($header);

}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var dn = 'AM';
    if (h > 12) {
        dn = 'PM';
        h = h - 12;
    }

    if (h == 12) {
        dn = 'PM';
    }

    if (h == 0) {
        h = 12; //12 AM previously appeared as 00:XX:YY
    }

    m = prependZero(m);
    s = prependZero(s);
    $('#txt').html('Current Time: ' + h + ':' + m + ':' + s + ' ' + dn);
    setTimeout(function () {
        startTime();
    }, 500);
}

function prependZero(i) {
    return i < 10 ? '0' + i : i; // add zero in front of numbers < 10
}

var appointmentsList = {};

//we can thank Chrome and other browsers for messing with JavaScript's Date object
function correctDate(date) {
    //the model: 2016-03-03T09:51:00.496Z
    //substr idx 012345678901234567890123
    var d = date.toString();
    var year = Number(d.substr(0, 4));
    var month = Number(d.substr(5, 2)) - 1;
    var day = Number(d.substr(8, 2));
    var hours = Number(d.substr(11, 2)) - 8;
    var minutes = Number(d.substr(14, 2));
    var seconds = Number(d.substr(17, 2));
    var milliseconds = Number(d.substr(20, 3));

    return new Date(year, month, day, hours, minutes, seconds, milliseconds);
}

/**
 * This function will make the GET request when the dashboard is first loaded.
 * Try not to call it except on page load/refresh.
 */
function fetchAppointments() {
    $.get('/api/employee/' + eid + '/appointments/today', function (data) {
        console.log("Fetching appointments. Size = " + data.length);
        appointmentsList = {};
        for (var i = 0; i < data.length; i++) {
            //thanks Chrome...
            parseAppointmentData(data[i], function(apptId, columns) {
                appointmentsList[apptId] = columns;
            });
        }
        drawTable();
    });
}

/**
 * Takes an Appointment object, extracts its fields, and appends it to the end of
 * the table.
 * @param data the Appointment object
 * @param callback the function that handles the output columns. First parameter is
 * the appointment id. Second parameter is the columns to be displayed in the table
 */
function parseAppointmentData(data, callback) {
    if (data.state === 'done') {
        return;
    }

    //browsers like to mess with JavaScript's Date object...
    data.date = correctDate(data.date);

    //var $img = $('<img id="Image" src="http://placehold.it/50x50" />');
    var imgSource = data.image ? data.image : "http://placehold.it/50x50";
    var $img = $('<img id="Image" src="' + imgSource + '" />');

    if (data.state === 'checkedIn' || data.state === 'roomed') {

        var url = '/viewform/' + data._id;
        var $form = $('<a href="' + url + '" onclick="window.open(\'' + url + '\', \'newwindow\', \'width=600, height=400\'); return false;" >View Forms</a>');

        if (data.state === 'checkedIn') {
            var $check = $('<input type="checkbox">').data('appid', data._id);
            $check.change(function () {
                var $appid = $(this).data('appid');

                $.ajax({
                    url: '/api/appointments/' + $appid + '/state',
                    type: 'PUT'
                });
            });

            cols = [0, data.fname + ' ' + data.lname, $form, data.date, data.state, $check, $img, ""];
        }

        else if (data.state === 'roomed') {
            $btn = $('<button class="btn btn-primary"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span></button>');
            var x = data._id;
            $btn.click(function () {
                $.ajax({
                    url: '/api/appointments/' + x + '/state',
                    type: 'PUT',
                });
            });

            cols = [0, data.fname + ' ' + data.lname, $form, data.date, data.state, $btn, $img, ""];

        }
    }

    else {
        cols = [0, data.fname + ' ' + data.lname, $btn = false, data.date, data.state, $btn = false, $img, ""];
    }

    callback(data._id, cols);
}

//no longer need table(), but I'll keep it around just in case
/*
function table() {

    var cols, $btn;
    $.get('/api/employee/' + eid + '/appointments/today', function (data) {
        console.log("Number of appointments: " + data.length);

        var count = 0;
        //empties the table
        $('#tblBody').empty();

        //for loop to reload the table
        for (var i = 0; i < data.length; i++) {

            if (data[i].state == 'done') {
                continue;
            }

            var $img = $('<img id="Image" src="http://placehold.it/50x50" />');
            count++;

            var appTime = getAppDate(data[i].date);


            if (data[i].state === 'checkedIn' || data[i].state === 'roomed') {

                var url = '/viewform/' + data[i]._id;
                var $form = $('<a href="' + url + '" onclick="window.open(\'' + url + '\', \'newwindow\', \'width=600, height=400\'); return false;" >View Forms</a>');

                if (data[i].state === 'checkedIn') {
                    var $check = $('<input type="checkbox">').data('appid', data[i]._id);
                    $check.change(function () {
                        var $appid = $(this).data('appid');

                        $.ajax({
                            url: '/api/appointments/' + $appid + '/state',
                            type: 'PUT'
                        });
                    });

                    cols = [count, data[i].fname + ' ' + data[i].lname, $form, appTime, data[i].state, $check, $img, ""];
                }

                else if (data[i].state === 'roomed') {
                    $btn = $('<button class="btn btn-primary"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span></button>');
                    var x = data[i]._id;
                    $btn.click(function () {
                        $.ajax({
                            url: '/api/appointments/' + x + '/state',
                            type: 'PUT',
                        });
                    });

                    cols = [count, data[i].fname + ' ' + data[i].lname, $form, appTime, data[i].state, $btn, $img, ""];

                }
            }

            else {
                cols = [count, data[i].fname + ' ' + data[i].lname, $btn = false, appTime, data[i].state, $btn = false, $img, ""];
            }

            insRow(cols);
        }//end of for loop

    });//end of $get()
}//end of table()
*/

//function poll() {
//    setTimeout(function(){
//        table();
//
//        poll();
//    },1000);//checks every 1000 millisecond
//}




//function to get the appointment's time in a formatted string
function getAppDate(date) {
    //old implementation
    /*//parsing to get time
    var fhours = appDate.getHours();
    var appTime;
    if (fhours / 12 < 1) {
        var hours = ('0' + appDate.getHours()).slice(-2); //returns 0-
        var minutes = ('0' + appDate.getMinutes()).slice(-2); //returns 0-59
        appTime = hours + ':' + minutes + ' AM';
    }
    else {
        var pmHours = appDate.getHours() % 12;


        if (pmHours === 0) {
            pmHours = 12;
        }

        var hoursPM = ('0' + pmHours).slice(-2); //returns 0-
        var minutesPM = ('0' + appDate.getMinutes()).slice(-2); //returns 0-59
        appTime = hoursPM + ':' + minutesPM + ' PM';
    }

    return appTime;*/

    var ampm = 'AM';
    var hours = date.getHours();
    if (hours >= 12) {
        ampm = 'PM';
        if (hours > 12) {
            hours -= 12;
        }
    }

    if (hours == 0)
        hours += 12;

    var minutes = prependZero(date.getMinutes());

    return hours + ':' + minutes + ' ' + ampm;
}

// JQuery Insert Row
function insRow(cols) {
    var $row = $('<tr/>'); // Create a row

    // Loop through data
    for (var i = 0; i < cols.length; i++) {
        var $col;

        if (i === cols.length - 1 && cols[4] == "checkedIn") {
            $col = $('<td/style="background-color:#00FF00;width:1px">'); // Create a column
        } else {
            $col = $('<td/>');
        }

        //the date column
        if (i == 3) {
            $col.append(getAppDate(cols[i])); // Append column data to column
        }
        else {
            $col.append(cols[i]);
        }

        $row.append($col); // Append column to row
    }

    $('#tblBody').append($row); // Append to top of element using prepend
}

function drawTable() {
    $('#tblBody').empty();

    var sorted = [];
    for (var key in appointmentsList) {
        var value = appointmentsList[key];
        sorted.push(value);
    }

    sorted.sort(function(a, b) {
        return a[3].getTime() - b[3].getTime();

    });

    for (var i = 0; i < sorted.length; i++) {
        var columns = sorted[i];
        columns[0] = i + 1; //this is the number shown in the first column of the table
        insRow(columns);
    }
}
