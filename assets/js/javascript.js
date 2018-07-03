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
var foodTable = $('#foodTable');
var waresTable = $('#waresTable');
var foodBuget = $('#foodBuget');
var waresBuget = $('#waresBuget');

var btnSubmit = $('#submit');

// Get a reference to the database service
const dbRoot = firebase.database().ref();

// Create references
const dbRefFoodBuget = dbRoot.child('foodBuget');
const dbRefWaresBuget = dbRoot.child('waresBuget');
const dbRefInfo = dbRoot.child('info');

var currentId = 0;
var totalFoodBuget = 0;
var totalWaresBuget = 0;

dbRefInfo.on('value', function(snap){
  foodBuget.empty();
  waresBuget.empty();

  currentId = snap.val().currentId;
  totalFoodBuget = snap.val().totalFoodBuget;
  totalWaresBuget = snap.val().totalWaresBuget;

  foodBuget.append(totalFoodBuget);
  waresBuget.append(totalWaresBuget);
});

dbRefFoodBuget.on('value', function(snap){
foodTable.empty();

  snap.forEach(function(snapshot){

    var day = snapshot.key.substring(8, 11);
    var mouth = snapshot.key.substring(5, 7);
    var year = snapshot.key.substring(0, 4);

    snapshot.forEach(function(childSnapshot){

      var key = childSnapshot.key;
      var val = childSnapshot.val();
      var order = val.order;
      var price = val.price;

      foodTable.append("<tr><th scope='row'>"+ year + "-" + mouth + "-" +  day + "</th><td>"
      + order + "</td><td>"
      + price + "</td><td class='text-center'><button type='button' class='btn btn-outline-danger' onclick='handleDelFood("+year+","+mouth+","+day+","+key+","+price+")'>x</button></td></tr>");

    });

  });
});

dbRefWaresBuget.on('value', function(snap){
waresTable.empty();

  snap.forEach(function(snapshot){

    var day = snapshot.key.substring(8, 11);
    var mouth = snapshot.key.substring(5, 7);
    var year = snapshot.key.substring(0, 4);
    snapshot.forEach(function(childSnapshot){

      var key = childSnapshot.key;
      var val = childSnapshot.val();
      var order = val.order;
      var price = val.price;

      waresTable.append("<tr><th scope='row'>"+ year + "-" + mouth + "-" +  day + "</th><td>"
      + order + "</td><td>"
      + price + "</td><td class='text-center'><button type='button' class='btn btn-outline-danger' onclick='handleDelWares("+year+","+mouth+","+day+","+key+","+price+")'>x</button></td></tr>");

    });

  });
});

function handleCreate(){
  var inputDate = document.getElementById('date');
  var inputOrder = document.getElementById('order');
  var inputPrice = document.getElementById('price');
  var inputType = document.getElementById('type');

  var iInputPrice = parseInt(inputPrice.value);
  var iTotalFoodBuget = parseInt(totalFoodBuget);
  var sumTotalFoodBuget = totalFoodBuget + iInputPrice;
  var iTotalWaresBuget = parseInt(totalWaresBuget);
  var sumTotalWaresBuget = totalWaresBuget + iInputPrice;

  var orderId = currentId + 1;

  if (inputType.value == 1) {

    var dbRef = dbRefFoodBuget.child(inputDate.value);
    dbRef.child(orderId).set({
      order: inputOrder.value,
      price: inputPrice.value,
    });

    dbRefInfo.update({
      currentId: orderId,
      totalFoodBuget: sumTotalFoodBuget
    });

  }
  else if (inputType.value == 2) {

    var dbRef = dbRefWaresBuget.child(inputDate.value);
    dbRef.child(orderId).set({
      order: inputOrder.value,
      price: inputPrice.value,
    });

    dbRefInfo.update({
      currentId: orderId,
      totalWaresBuget: sumTotalWaresBuget
    });
  }
  else {
    alert('test');
  }
  window.location.replace("https://tickstudiu.github.io/income-firebase-github-page/salary.html");
}

function handleDelFood(year , mouth , day, key, price, type) {
  if (mouth < 10) {
    mouth = '0' + mouth;
  }

  if (day < 10) {
    day = '0' + day;
  }

  var iPrice = parseInt(price);
  var iTotalFoodBuget = parseInt(totalFoodBuget);
  var sumTotalFoodBuget = totalFoodBuget - iPrice;

  var path = 'foodBuget/'+ year +'-'+ mouth +'-'+ day + '/' + key;;
  var target = firebase.database().ref(path);
  target.remove().then(function(){
    dbRefInfo.update({
      totalFoodBuget: sumTotalFoodBuget,
    });
    console.log("remove done");
  }).catch(function(error){
    console.log("remove failed: " + error.message);
  })
}

function handleDelWares(year , mouth , day, key, price, type) {
  if (mouth < 10) {
    mouth = '0' + mouth;
  }

  if (day < 10) {
    day = '0' + day;
  }

  var iPrice = parseInt(price);
  var iTotalWaresBuget = parseInt(totalWaresBuget);
  var sumTotalWaresBuget = totalWaresBuget - iPrice;

  var path = 'waresBuget/'+ year +'-'+ mouth +'-'+ day + '/' + key;;
  var target = firebase.database().ref(path);
  target.remove().then(function(){
    dbRefInfo.update({
      totalWaresBuget: sumTotalWaresBuget,
    });

    console.log("remove done");
  }).catch(function(error){
    console.log("remove failed: " + error.message);
  })
}
