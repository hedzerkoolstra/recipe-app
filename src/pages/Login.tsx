import { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth'

const Login = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyC4ABtTF8FBXSLLG1OKk_JtYKdIYFWKz5c',
    authDomain: 'recipeapp-431a0.firebaseapp.com',
    projectId: 'recipeapp-431a0',
    storageBucket: 'recipeapp-431a0.appspot.com',
    messagingSenderId: '67063921684',
    appId: '1:67063921684:web:5b5321058eac574ab0bb01',
  }

  firebase.initializeApp(firebaseConfig)

  const [loggedIn, setLoggedIn] = useState(false)

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:3000',
    // This must be true.
    handleCodeInApp: true,
    // iOS: {
    //   bundleId: 'com.example.ios'
    // },
    // android: {
    //   packageName: 'com.example.android',
    //   installApp: true,
    //   minimumVersion: '12'
    // },
    // dynamicLinkDomain: 'example.page.link'
  }

  const auth = getAuth()
  var email = 'hedzer@protonmail.com'

  const doLogin = () => {
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation')
      }
      // The client SDK will parse the code from the link for you.

      signInWithEmailLink(auth, email!, window.location.href)
        .then((result) => {
          // Clear email from storage.
          //   window.localStorage.removeItem('emailForSignIn')
          console.log('trigger')
          console.log(loggedIn)
          console.log(result)
          setLoggedIn(true)
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        })
    } else {
      console.log('not logged in')
      console.log(loggedIn)
    }
  }, [])

  return <div>{!loggedIn ? <button onClick={doLogin}>login</button> : <div>LoggedIn!</div>}</div>
}

export default Login
