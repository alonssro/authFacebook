var ref = "usuarios"



function toggleSignIn() {
    if (!firebase.auth().currentUser) {
      // [START createprovider]
      var provider = new firebase.auth.FacebookAuthProvider();
      // [END createprovider]
      // [START addscopes]
      provider.addScope('user_birthday');
      // [END addscopes]
      // [START signin]
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // [START_EXCLUDE]
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
        // [END_EXCLUDE]
      });
      // [END signin]
    } else {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    }
    // [START_EXCLUDE]
    // [END_EXCLUDE]
  }

  function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user);
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;

        writeNewPost(uid, displayName, photoURL, email)
        // [START_EXCLUDE]

        // [END_EXCLUDE]
      } else {
        // User is signed out.
        // [START_EXCLUDE]
        firebase.auth().signOut();
        // [END_EXCLUDE]
      }
      // [START_EXCLUDE]
      // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('boton-login').addEventListener('click', toggleSignIn, false);
  }


  function logout(){
    firebase.auth().signOut()
    .then(function(response){
        console.log(response);
        console.log("desconectado");
    })
    .catch(function(error){
        console.log(error);
    });
    
}
  function writeNewPost(uid, displayName, photoURL, email) {
    // A post entry.
    var postData = {
      user: displayName,
      uid: uid,
      email: email,
      userPic: photoURL
    };

  
    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;
  
    // Write the new post's data simultaneously in the posts list and the user's post list.
  
    return firebase.database().ref(ref +"/"+ uid).set(postData)
    .catch(function(error){
        console.log(error)
      })
  }

  window.onload = function() {
    initApp();
  };