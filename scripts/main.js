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
// function retrieveData(reference){
//   var outputObject = {};
//   var i = 0;
//   reference.once('value').then(function(data){
//     data.forEach(function(childData){
//
//       var wishlistKey = Object.keys(data.val())[i];
//       outputObject[wishlistKey] = childData.val();
//       i++;
//     })
//     return outputObject;
//   })
// }

// a function retrieve wishlist data and return a promise
function getWishlistPromise(reference){
  var outputObject = {}
  var i = 0;
  return reference.once('value').then(function(data){
    data.forEach(function(childData){
      var wishlistKey = Object.keys(data.val())[i];
      outputObject[wishlistKey] = childData.val();
      i++;
    })
    return outputObject;
  })
}

// create divs for each wish list
function createDivsForEachWishlist(listObject){

  for(key in listObject){

    // make sure the list item is not in hisotry or saved
    if((!listObject[key].saved) && (!listObject[key].inHistory)){

      var newWishlistDiv = document.createElement('div');
      newWishlistDiv.id = "list"+key;
      newWishlistDiv.className = "mainWishlistDivs"
      newWishlistDiv.innerHTML = '<p>'+listObject[key].time+",</p> "+
                                 '<p>'+listObject[key].strength+",</p>"+
                                 '<p>'+listObject[key].content+".</p>"
      document.getElementById('wishlist-container').appendChild(newWishlistDiv);
    }
  }
}


// remove a list according to id
function removeList(listId){
  wishRef.child(listId).remove();
}

getWishlistPromise(wishRef).then(function(data){
  createDivsForEachWishlist(data);
})

//bind buttons
//save the new wishlist by user to database
window.addEventListener('load',function(){
  // add event listern to create button
  // createNewWishlistButton.addEventListener('click',function(){
    // addNewWishList(document.getElementById('time').value,document.getElementById('strength').value,document.getElementById('content').value)
  // })

})

// var listObjects = retrieveData(wishRef);
//
// window.onload = function(){
//   console.log(1)
//   createDivsForEachWishlist(listObjects);
// }
