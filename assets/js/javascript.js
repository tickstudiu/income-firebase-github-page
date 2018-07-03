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
const dbRefInfo = dbRoot.child('info');
var currentId = 0;

dbRefInfo.on('value', function(snap){
  currentId = snap.val().currentId;
});

dbRefIncome.on('value', function(snap){
box.empty();

  snap.forEach(function(snapshot){

    var day = snapshot.key.substring(8, 11);
    var mouth = snapshot.key.substring(5, 7);
    var year = snapshot.key.substring(0, 4);

    snapshot.forEach(function(childSnapshot){

      var key = childSnapshot.key;
      console.log(key);
      var val = childSnapshot.val();
      var order = val.order;
      var price = val.price;

      box.append("<tr><th scope='row'>"+ year + "-" + mouth + "-" +  day + "</th><td>"
      + order + "</td><td>"
      + price + "</td><td class='text-center'><button type='button' class='btn btn-outline-danger' onclick='handleDel("+year+","+mouth+","+day+","+key+")'>x</button></td></tr>");

    });

  });
});

btnSubmit.on('click', function(){
  var inputDate = document.getElementById('date');
  var inputOrder = document.getElementById('order');
  var inputPrice = document.getElementById('price');
  var orderId = currentId + 1;

  var dbRef = dbRefIncome.child(inputDate.value);
  dbRef.child(orderId).set({
    order: inputOrder.value,
    price: inputPrice.value
  });

  dbRefInfo.set({
    currentId: orderId
  });

  window.location.replace("https://tickstudiu.github.io/income-firebase-github-page/salary.html");
});

function handleDel(y , m , d, k) {
  if (m < 10) {
    m = '0' + m;
  }

  if (d < 10) {
    d = '0' + d;
  }

  var path = 'income/' + y +'-'+ m +'-'+ d + '/' + k;
  console.log(k);
  var target = firebase.database().ref(path);
  target.remove().then(function(){
    console.log("remove done");
  }).catch(function(error){
    console.log("remove failed: " + error.message);
  })
}
