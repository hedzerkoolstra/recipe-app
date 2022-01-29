import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthenticationStatus, setUserId } from '../store/slice'
import { Box, Button, FormControl, Input, InputLabel, Typography } from '@mui/material'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth'

const Login = () => {
  const isAuthenticated = useSelector(({ slice: state }: any) => state.isAuthenticated)

  const dispatch = useDispatch()

  const [appIsPending, setAppIsPending] = useState<boolean>(true)
  const [userEmail, setUserEmail] = useState<string>('')
  const [didSubmit, setDidSubmit] = useState<boolean>(false)

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: process.env.REACT_APP_BASE_URL!,
    handleCodeInApp: true,
  }

  const auth = getAuth()

  const doLogin = () => {
    sendSignInLinkToEmail(auth, userEmail, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', userEmail)
        setDidSubmit(true)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href) && !isAuthenticated) {
      // Get the email if available.
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        // User opened the link on a different device.
        email = window.prompt('Please provide your email for confirmation')
      }
      signInWithEmailLink(auth, email!, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn')
          dispatch(setAuthenticationStatus(true))
          setAppIsPending(false)
        })
        .catch((error) => {
          console.log(error)
          setAppIsPending(false)
        })
    }
  }, [auth, dispatch, isAuthenticated])

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user?.emailVerified) {
        dispatch(setAuthenticationStatus(true))
        dispatch(setUserId(user.uid))
        setAppIsPending(false)
      } else {
        firebase.auth().signOut()
        setAppIsPending(false)
      }
    })
  }, [dispatch])

  return !appIsPending ? (
    <Box
      sx={{
        width: 300,
        margin: 'auto',
        marginTop: '5rem',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        backgroundColor: 'white',
      }}
    >
      {!didSubmit ? (
        <FormControl>
          <InputLabel htmlFor="my-input">Enter email address to access app</InputLabel>
          <Input
            onChange={(v) => setUserEmail(v.target.value)}
            id="my-input"
            aria-describedby="my-helper-text"
          />

          <Button
            sx={{
              marginTop: '2rem',
            }}
            variant="contained"
            onClick={doLogin}
          >
            Submit
          </Button>
        </FormControl>
      ) : (
        <Typography>Go to your Inbox to confirm</Typography>
      )}
    </Box>
  ) : (
    <></>
  )
}

export default Login
