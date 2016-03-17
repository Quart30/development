/**
 * Created by Sachi on 3/17/16.
 */

function landingPageView() {
//    alert("create account");
    // Configure an instance for your project
    var client = new Keen({
        projectId: "56eb3c832fd4b1443854f4f7",
        writeKey: "e23084aefe33e2ee3cb38adf7dc37f17787ca0f6e87b01be6a4b54094126db45c19c3bce31fb331c42b8e63df6975c156ca58f140aa64d47ed2285c079cf97e59a9cfa93f3b4f47818bff87b20030e957d85ae684c4011c63738f3df39b9ee1d"
    });

// Create a data object with the properties you want to send
    var anonpageviews = {
        eventCollection: "anonpageviews",
        page: "createAccount",
        id: 1,
        keen: {
            timestamp: new Date().toISOString()
        }
    };

// Send it to the "purchases" collection
    client.addEvent("anonpageviews", anonpageviews, function(err, res){
        if (err) {
            // there was an error!
            alert("error: write");
        }
        else {
            // see sample response below
  //          alert("success: write");
        }
    });


}


