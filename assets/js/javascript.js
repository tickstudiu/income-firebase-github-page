// Initialize Firebase
var config = {
  apiKey: "AIzaSyDGePr4Qm4cicTkOyCAnysO1d6TCSCiIhw",
  authDomain: "income-3e585.firebaseapp.com",
  databaseURL: "https://income-3e585.firebaseio.com",
  projectId: "income-3e585",
  storageBucket: "income-3e585.appspot.com",
  messagingSenderId: "1009016464962"
};
firebase.initializeApp(config);

// Get elements
var box = $('#box');
var btnSubmit = $('#submit');

// Get a reference to the database service
const dbRoot = firebase.database().ref();

// Create references
const dbRefIncome = dbRoot.child('income');

dbRefIncome.on('value', function(snap){
box.empty();

  snap.forEach(function(snapshot){

    var day = snapshot.key.substring(8, 11);
    var mouth = snapshot.key.substring(5, 7);
    var year = snapshot.key.substring(0, 4);

    snapshot.forEach(function(childSnapshot){

      var val = childSnapshot.val();

      var order = val.order;
      var price = val.price;

      box.append("<tr><th scope='row'>"+ year + "-" + mouth + "-" +  day + "</th><td>" + order + "</td><td>" + price + "</td></tr>");

    });

  });
});

btnSubmit.on('click', function(){
  var inputDate = document.getElementById('date');
  var inputOrder = document.getElementById('order');
  var inputPrice = document.getElementById('price');

  dbRefIncome.child(inputDate.value).push({
    order: inputOrder.value,
    price: inputPrice.value
  })

  window.location.replace("https://tickstudiu.github.io/income-firebase-github-page/salary.html");
});
