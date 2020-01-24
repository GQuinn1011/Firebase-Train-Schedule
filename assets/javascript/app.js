$(document).ready(function(){

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
    setInterval(function() {
        $("#current-time").html(moment(moment()).format("hh:mm:ss A"));
    }, 1000);


    $(document).on("click", "#add-train", function(event) {
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
        if (($("#name-input").val() === "") && ($("#destination-input").val() === "") && ($("#frequency-input").val() === "") && ($("#first-input").val() === "")) {
            alert("Complete all fields");
            return false;
        };
        database.ref().push(newTrain);
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.frequency);
        console.log(newTrain.firstTime);
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#frequency-input").val("");
        $("#first-input").val("");


    });
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainFrequency = childSnapshot.val().frequency;
        var firstTrainTime = childSnapshot.val().firstTime;
        var key = childSnapshot.key;
        console.log(key);
        console.log(trainName);
        console.log(trainDestination);
        console.log(trainFrequency);
        console.log(firstTrainTime);





        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTrainTime, "hh:mm A").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

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
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestination),
            $("<td>").text(trainFrequency),
            $("<td>").text(firstTrainTime),
            $("<td>").text(tMinutesTillTrain),
            $("<td><button class='arrival fas fa-trash-alt' data-key=" + key + "></td>"));
        $(".train-schedule").append(newRow);
    });
    $(document).on("click", ".arrival", function() {
        keyref = $(this).attr("data-key");
        database.ref().child(keyref).remove();
        window.location.reload();
      });
      setInterval(function(){
          window.location.reload();
      },60000);
    });