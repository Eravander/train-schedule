var config = {
  apiKey: key,
  authDomain: "my-project-3fe61.firebaseapp.com",
  databaseURL: "https://my-project-3fe61.firebaseio.com",
  projectId: "my-project-3fe61",
  storageBucket: "my-project-3fe61.appspot.com",
  messagingSenderId: "587215791534"
};

firebase.initializeApp(config);

database = firebase.database();

$("#submitButton").on("click", function(event){
  event.preventDefault();

  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  trainTime = $("#first-train-time").val().trim();
  frequency = $("#frequency").val().trim();

  database.ref().push({
    trainName: trainName,
    destination: destination,
    trainTime: trainTime,
    frequency : frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP,
  });

})

database.ref().on("child_added", function(snapshot){
  var sv = snapshot.val();

  console.log(sv.trainName);
  console.log(sv.destination);
  console.log(sv.trainTime);
  console.log(sv.frequency);

  //Variable to figure out the converted train time
  var trainTimeConverted = moment(sv.trainTime, "hh:mm").subtract(1, "years");
	
  //Declaring a time difference variable
  var timeDifference = moment().diff(moment(trainTimeConverted), "minutes");
	
  var frequencyMinutes = sv.frequency;
  
  var minutesAway = Math.abs(timeDifference % frequencyMinutes);

  var minutesToNextTrain = frequencyMinutes - minutesAway

  var nextArrival = moment().add(minutesToNextTrain, "minutes").format("hh:mm A");

  var row = $('#my-table > tbody:last-child').append('<tr>' + '<td>' + sv.trainName + '</td>' + '<td>' + sv.destination + '</td>' + '<td>' + sv.frequency + '</td>' + '<td>' + nextArrival + '</td>' + '<td>' + minutesToNextTrain + '</td>')

}, function(errorObject){
  console.log("Errors: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(childSnapshot){
  var sv = childSnapshot.val();

  console.log(sv.trainName);
  console.log(sv.destination);
  console.log(sv.trainTime);
  console.log(sv.frequency);

});