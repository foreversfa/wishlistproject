// this is the main js file

// add a new wishlist to data base
function addNewWishList(time, strength, content) {
    var wishListData = {
        time: time,
        strength: strength,
        content: content,
        // default saved is false
        saved: false
    }
    var newWishListKey = firebase.database().ref().child('wishlists').push().key;
    var updates = {};
    updates['/wishlists/' + newWishListKey] = wishListData;
    return firebase.database().ref().update(updates)
}

// Here is how to retrieve data from firebase
// create a reference on wishlist
var wishRef = firebase.database().ref('wishlists')
wishRef.on('value', function(snapshot) {
    snapshot.forEach(function(childsnapshot) {
        console.log(childsnapshot.val())
    })
})
