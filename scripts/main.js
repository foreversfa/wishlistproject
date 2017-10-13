// this is the main js file
//variables
var createNewWishlistButton = document.getElementById('createNewWistlist')
// add a new wishlist to data base
function addNewWishList(time, strength, content) {
    var wishListData = {
        time: time,
        strength: strength,
        content: content,
        // default saved is false
        saved: false,
        inHistory: false
    }
    var newWishListKey = firebase.database().ref().child('wishlists').push().key;
    var updates = {};
    updates['/wishlists/' + newWishListKey] = wishListData;
    return firebase.database().ref().update(updates)
}

// Here is how to retrieve data from firebase
// create a reference on wishlist
var wishRef = firebase.database().ref('wishlists')
// wishRef.on('value', function(snapshot) {
//     snapshot.forEach(function(childsnapshot) {
//         console.log(childsnapshot.val())
//     })
// })

// a function to retrieve wishlists and save them in an object
function retrieveData(reference){
  var outputObject = {};
  var i = 0;
  reference.on('value',function(data){
    data.forEach(function(childData){
      var wishlistKey = Object.keys(data.val())[i];
      outputObject[wishlistKey] = childData.val();
      i++;
    })
  })
  return outputObject;
}

// a function to filter saved lists and save them in an array

function removeList(listId){
  wishRef.child(listId).remove();
}

//bind buttons
//save the new wishlist by user to database
window.addEventListener('load',function(){
  createNewWishlistButton.addEventListener('click',function(){
    addNewWishList(document.getElementById('time').value,document.getElementById('strength').value,document.getElementById('content').value)
  })
})
