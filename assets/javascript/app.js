// var trainNameTable = $("<td>").addClass("name");
// var trainDestination = $("<td>").addClass("dest");
// var trainFreq = $("<td>").addClass("freq");
// var trainArrival = $("<td>").addClass("arrival");
// var trainAway = $("<td>").addClass("away")
$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyCO_eZZUACTsm3W5SJIfJIL-IwnhfxiTTA",
        authDomain: "train-scheduler-caade.firebaseapp.com",
        databaseURL: "https://train-scheduler-caade.firebaseio.com",
        projectId: "train-scheduler-caade",
        storageBucket: "",
        messagingSenderId: "772754556304",
        appId: "1:772754556304:web:920c3d8f101cb72e4f1f15",
        measurementId: "G-S2KJTZ0X5Q"
    };
    // Initialize Firebase
    firebase.initializeApp(config);
    var database = firebase.database();


    $(document).on("click", "button", function(event) {
        event.preventDefault();

        var tName = $("#name-input").val().trim();
        var tDestination = $("#destination-input").val().trim();
        var tFrequency = $("#frequency-input").val().trim();
        var firstTime = moment($("#first-input").val().trim(), "HH:mm").format("hh:mm A");
        var newTrain = {
            name: tName,
            destination: tDestination,
            frequency: tFrequency,
            firstTime: firstTime
        };

        database.ref().push(newTrain);
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.frequency);
        console.log(newTrain.firstTime);
    });
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainFrequency = childSnapshot.val().frequency;
        var firstTrainTime = childSnapshot.val().firstTime;
        console.log(trainName);
        console.log(trainDestination);
        console.log(trainFrequency);
        console.log(firstTrainTime);





        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = trainFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestination),
            $("<td>").text(trainFrequency),
            $("<td>").text(firstTrainTime));
        $("<td>").text(tMinutesTillTrain);
        $(".train-schedule").append(newRow);
    });
});