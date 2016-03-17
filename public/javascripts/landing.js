/**
 * Created by Sachi on 3/17/16.
 */

function landingPageView() {
//    alert("create account");
    // Configure an instance for your project
    var client = new Keen({
        projectId: "56dccd4ac1e0ab4d24f6c62e",
        writeKey: "347629feb542cb08d47167810add3966c3c8b37c429f3a74961ad481b025f9ed7710e865db5ee8beeb84fb109092e82882e3c4f2d2c26f8b0c429c51a4b60478944074ffc09968f1239f058f3576498478f660f45e8ce3b76b40559e4886a0e9"
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


