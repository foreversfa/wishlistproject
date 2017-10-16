// this is the main js file
//variables
var createNewWishlistButton;
var createButton = document.getElementById('create-button');
var listContainer = document.getElementById('wishlist-container');
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

// Basic shuffle function
function shuffleArray(o){
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

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
  // get keys of object
  var listObjectKeys = Object.keys(listObject)
  //randomize the keys
  var randomizedKeys = shuffleArray(listObjectKeys)
  for(var i=0;i<randomizedKeys.length;i++){

    // make sure the main list does not contain historical list and saved list
    if((!listObject[randomizedKeys[i]].saved) && (!listObject[randomizedKeys[i]].inHistory)){
      var newWishlistDiv = document.createElement('div');
      newWishlistDiv.id = randomizedKeys[i];
      newWishlistDiv.className = "mainWishlistDivs";
      newWishlistDiv.innerHTML = '<p>'+listObject[randomizedKeys[i]].time+",</p> "+
                                     '<p>'+listObject[randomizedKeys[i]].strength+",</p>"+
                                     '<p>'+listObject[randomizedKeys[i]].content+".</p>";
      document.getElementById('wishlist-container').appendChild(newWishlistDiv);
    }
  }
}
  // for(key in listObject){
  //
  //   // make sure the list item is not in hisotry or saved
  //   if((!listObject[key].saved) && (!listObject[key].inHistory)){
  //
  //     var newWishlistDiv = document.createElement('div');
  //     newWishlistDiv.id = "list"+key;
  //     newWishlistDiv.className = "mainWishlistDivs"
  //     newWishlistDiv.innerHTML = '<p>'+listObject[key].time+",</p> "+
  //                                '<p>'+listObject[key].strength+",</p>"+
  //                                '<p>'+listObject[key].content+".</p>"
  //     document.getElementById('wishlist-container').appendChild(newWishlistDiv);
  //   }
  // }


// add an empty list to the top when user click "create button"
function insertEmptyList(){
  var emptyList = document.createElement('div');
  emptyList.id = "toBeEditedWishlist";
  emptyList.className = "mainWishlistDivs";
  emptyList.innerHTML =
  '<form>'+
    '<div class="form-group">'+
    '<label>time:</label>'+
    '<input type="text" id="time" class="form-control">'+
    '<label>strength:</label>'+
    '<input type="text" id="strength" class="form-control">'+
    '<label>content:</label>'+
    '<input type="text" id="content" class="form-control">'+
    '<button type="button" id="createNewWistlist" value="create">Submit</button>'+
    '</div>'+
  '</form> ';
  var container = document.getElementById('wishlist-container');
  container.insertBefore(emptyList,container.childNodes[0]);

}
// retrieve data and display divs
function displayLists(){
  getWishlistPromise(wishRef).then(function(data){
    createDivsForEachWishlist(data);
  })
}

// refresh the page with updated data
function updateContainer(){
  while(listContainer.firstChild){
    listContainer.removeChild(listContainer.firstChild);
  }
  displayLists();
}


// remove a list according to id
function removeList(listId){
  wishRef.child(listId).remove();
}

// run displayLists for the first time
displayLists();
//bind buttons
//save the new wishlist by user to database
document.addEventListener('click',function(event){

  // add event listern to create-button
  if(event.target.id === 'create-button'){
    insertEmptyList();
  }
  // add event listern to submit new list button

  if(event.target.id === 'createNewWistlist'){
    addNewWishList(document.getElementById('time').value,document.getElementById('strength').value,document.getElementById('content').value);
    updateContainer();
  }

  if(event.target.id === 'shuffle-button'){
    updateContainer();
  }



})
