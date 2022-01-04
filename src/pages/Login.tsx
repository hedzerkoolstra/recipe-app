import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthenticationStatus } from '../store/slice'
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
  const isAuthenticated = useSelector(({ slice: state }: any) => state.isAuthenticated)

  const dispatch = useDispatch()
  const firebaseConfig = {
    apiKey: 'AIzaSyC4ABtTF8FBXSLLG1OKk_JtYKdIYFWKz5c',
    authDomain: 'recipeapp-431a0.firebaseapp.com',
    projectId: 'recipeapp-431a0',
    storageBucket: 'recipeapp-431a0.appspot.com',
    messagingSenderId: '67063921684',
    appId: '1:67063921684:web:5b5321058eac574ab0bb01',
  }

  firebase.initializeApp(firebaseConfig)
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

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
    if (isSignInWithEmailLink(auth, window.location.href) && !isAuthenticated) {
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation')
      }
      signInWithEmailLink(auth, email!, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn')
          console.log('onInit')
          dispatch(setAuthenticationStatus(true))
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [auth, dispatch, isAuthenticated])

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user?.emailVerified) {
        console.log('onChange')
        dispatch(setAuthenticationStatus(true))
      } else {
        firebase.auth().signOut()
      }
    })
  }, [dispatch])

  return <div>{<button onClick={doLogin}>login</button>}</div>
}

export default Login
