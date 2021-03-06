// this is the main js file
//variables
var createNewWishlistButton;
var createButton = document.getElementById('create-button');
var listContainer = document.getElementById('wishlist-container');
var savedContainer = document.getElementById('saved-list-container');
// create a reference on wishlist
var wishRef = firebase.database().ref('wishlists');
var savedRef = firebase.database().ref('savedWishLists');

// add a new wishlist to data base
function addNewWishList(time, strength, content) {
    var wishListData = {
        time: time,
        strength: strength,
        content: content,
        // default saved is false
        saved: false,
        inHistory: false,
    }
    var newWishListKey = firebase.database().ref().child('wishlists').push().key;
    var updates = {};
    updates['/wishlists/' + newWishListKey] = wishListData;
    return firebase.database().ref().update(updates)
}

// Basic shuffle function
function shuffleArray(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// a function retrieve wishlist data and return a promise
function getWishlistPromise(reference) {
    var outputObject = {}
    var i = 0;
    return reference.once('value').then(function(data) {
        data.forEach(function(childData) {
            var wishlistKey = Object.keys(data.val())[i];
            outputObject[wishlistKey] = childData.val();
            i++;
        })
        return outputObject;
    })
}

// create divs for each wish list
function createDivsForEachWishlist(listObject) {
    // get keys of object
    var listObjectKeys = Object.keys(listObject)
    //randomize the keys
    var randomizedKeys = shuffleArray(listObjectKeys)
    for (var i = 0; i < randomizedKeys.length; i++) {

        // make sure the main list does not contain historical list and saved list
        if ((!listObject[randomizedKeys[i]].saved) && (!listObject[randomizedKeys[i]].inHistory)) {
            var newWishlistDiv = document.createElement('div');
            // ----------------------------------
            // create a cross for deleting
            var crossButton = document.createElement('div');
            crossButton.className = "cross-button";
            crossButton.innerHTML = '<img id="cross-button" src="/img/crossButton.png">'
            // ----------------------------------
            newWishlistDiv.id = randomizedKeys[i];
            newWishlistDiv.className = "general-list-style";
            newWishlistDiv.innerHTML = '<p>' + listObject[randomizedKeys[i]].time + ",</p> " +
                '<p>' + listObject[randomizedKeys[i]].strength + ".</p>";
            // document.getElementById('wishlist-container').appendChild(newWishlistDiv);
            var container = document.getElementById('wishlist-container')
            container.insertBefore(newWishlistDiv,container.childNodes[0])
            newWishlistDiv.appendChild(crossButton);
        }
    }
    var shuffleBotton = document.createElement('div');
    shuffleBotton.className = "general-list-style-button";
    shuffleBotton.innerHTML = '<div class="buttons-container">'+
        '<img id="shuffle-button" src="/img/shuffleSign.png">'+
    '</div>'
    var container1 = document.getElementById('wishlist-container')
    // Inserts the specified node before a reference node as a child of the current node. If referenceNode is null, then newNode is inserted at the end of the list of child nodes.
    container1.insertBefore(shuffleBotton,container1.childNodes[container1.childNodes])
    // =============================
    var newListButton = document.createElement('div');
    newListButton.className = "general-list-style-button";
    newListButton.innerHTML = '<div class="buttons-container">'+
        '<img id="create-button" src="/img/plusSign.png">'+
    '</div>'
    var container2 = document.getElementById('wishlist-container')
    // Inserts the specified node before a reference node as a child of the current node. If referenceNode is null, then newNode is inserted at the end of the list of child nodes.
    container2.insertBefore(newListButton,container2.childNodes[container2.childNodes])

}

// print saved lists on screen
// not in use anymore because of order issue.
function printSavedLists(listObject) {

    for (key in listObject) {

        if (listObject[key].saved) {
            var newSavedlistDiv = document.createElement('div');
            // ----------------------------------
            // create a cross for deleting
            var crossButton = document.createElement('div');
            crossButton.className = "cross-button";
            crossButton.innerHTML = '<img id="cross-button" src="/img/crossButton.png">'

            // ----------------------------------
            newSavedlistDiv.id = key;
            newSavedlistDiv.className = "general-list-style";
            newSavedlistDiv.innerHTML = "<p>" + listObject[key].time + ",</p> " +
                "<p>" + listObject[key].strength + ",</p>" +
                "<p>" + listObject[key].content + ".</p>"
            document.getElementById('saved-list-container').appendChild(newSavedlistDiv);
            newSavedlistDiv.appendChild(crossButton);
        }
    }
}

// open list by saving it. Save it to a new tree called "savedWishLists"
function saveTheList(id) {
    var savedTime = 0-(new Date()).getTime();
    return wishRef.child(id).once('value').then(function(data) {

        var toBeSaved = data.val();
        toBeSaved.saved = true;
        toBeSaved.savedTime = savedTime;
        savedRef.child(id).update(toBeSaved);
        wishRef.child(id).update({
            saved: true,
            inHistory: true
        });
    })
}

// add an empty list to the top when user click "create button"
function insertEmptyList() {
    var emptyList = document.createElement('div');
    emptyList.id = "toBeEditedWishlist";
    emptyList.className = "general-list-style";
    emptyList.innerHTML =
        '<form>' +
        '<div class="form-group">' +
        '<label>time:</label>' +
        '<input type="text" id="time" class="form-control">' +
        '<label>strength:</label>' +
        '<input type="text" id="strength" class="form-control">' +
        '<label>content:</label>' +
        '<input type="text" id="content" class="form-control">' +
        '<button type="button" id="createNewWistlist" value="create">Submit</button>' +
        '</div>' +
        '</form> ';
    var container = document.getElementById('wishlist-container');
    container.insertBefore(emptyList, container.childNodes[0]);

}
// retrieve data and display divs
function displayLists() {
    getWishlistPromise(wishRef).then(function(data) {
        createDivsForEachWishlist(data);
        // printSavedLists(data);
    }).then(function(){
      savedRef.orderByChild('savedTime').on('value', function(data) {
          // printSavedLists(data.val());
          // try not using json here.

          savedRef.orderByChild('savedTime').limitToFirst(5).on('value', function(data) {
              data.forEach(function(childData) {
                  var newSavedlistDiv = document.createElement('div');
                  // create a cross for deleting
                  var crossButton = document.createElement('div');
                  crossButton.className = "cross-button";
                  crossButton.innerHTML = '<img id="cross-button" src="/img/crossButton.png">'

                  // ----------------------------------
                  newSavedlistDiv.id = childData.key;
                  newSavedlistDiv.className = "general-list-style";
                  newSavedlistDiv.innerHTML = "<p>" + childData.val().time + ",</p> " +
                      "<p>" + childData.val().strength + ",</p>" +
                      "<p>" + childData.val().content + ".</p>"
                  document.getElementById('saved-list-container').appendChild(newSavedlistDiv);
                  newSavedlistDiv.appendChild(crossButton);
              })
          })
      })
    })

}

// refresh the page with updated data
function updateContainer() {
    while (listContainer.firstChild) {
        listContainer.removeChild(listContainer.firstChild);
    }
    while (savedContainer.firstChild) {
        savedContainer.removeChild(savedContainer.firstChild);

    }
    displayLists();
}


// remove a list according to id
function removeSavedList(listId) {
  return savedRef.child(listId).remove();
}

function putListInHistory(listId){
  return wishRef.child(listId).update({inHistory:true});
}

// run displayLists for the first time
displayLists();
//bind buttons
//save the new wishlist by user to database
document.addEventListener('click', function(event) {

    // add event listern to create-button
    if (event.target.id === 'create-button') {

        insertEmptyList();
    }
    // add event listern to submit new list button

    if (event.target.id === 'createNewWistlist') {
        addNewWishList(document.getElementById('time').value, document.getElementById('strength').value, document.getElementById('content').value);
        updateContainer();
    }

    if (event.target.id === 'shuffle-button') {
        updateContainer();
    }

    if (event.target.parentElement && event.target.parentElement.id === 'wishlist-container' && event.target.className != 'general-list-style-button') {
        console.log(event.target.parentElement)
        if (confirm("Do you want to save this wishlist?") == true) {
            saveTheList(event.target.id).then(function(){
              updateContainer();
            });

        } else {
            return;
        }

    }

    if (event.target.className === 'cross-button' ){
      if(event.target.parentElement.parentElement.id === "wishlist-container"){
        putListInHistory(event.target.parentElement.id).then(function(){
          updateContainer();
        })
      }
      else if(event.target.parentElement.parentElement.id === "saved-list-container"){
        removeSavedList(event.target.parentElement.id).then(function(){
          updateContainer();
        })
      }
    }





})
