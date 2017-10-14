// this is the main js file
//variables
var createNewWishlistButton = document.getElementById('createNewWistlist')
// create a reference on wishlist
var wishRef = firebase.database().ref('wishlists')



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

// a function to retrieve wishlists and save them in an object
function retrieveData(reference){
  var outputObject = {};
  var i = 0;
  reference.once('value').then(function(data){
    data.forEach(function(childData){

      var wishlistKey = Object.keys(data.val())[i];
      outputObject[wishlistKey] = childData.val();
      i++;
    })
  })

  return outputObject;
}

// create divs for each wish list
function createDivsForEachWishlist(listObject){


  for(key in listObject){

    // make sure the list item is not in hisotry or saved
    if((!listObject[key].saved) && (!listObject[key].inHistory)){

      var newWishlistDiv = document.createElement('div');
      newWishlistDiv.id = "list"+key;
      newWishlistDiv.class = "mainWishlistDivs"
      newWishlistDiv.innerHTML = listObject[key].time+", "+listObject[key].strength+", "+listObject[key].content+"."
      document.body.appendChild(newWishlistDiv);
    }
  }
}


// remove a list according to id
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

var listObjects = retrieveData(wishRef);

window.onload = function(){
  console.log(1)
  createDivsForEachWishlist(wishRef);
}
