import React, { Component } from 'react'
import { auth, createNewUserProfile, getUserRef, getUserBoards } from './firebase/firebase.utils'
import './App.css'
import MainBoard from './components/main-board/main-board.component'

type MyProps = {
  currentUser: null
}

type MyState = {
  [currentUser: string]: any
}

class App extends Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props)
    this.state = {
    }
  }

  unsubscribeFromAuth: any = null

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        createNewUserProfile(userAuth, null)
        const userRef: any = await getUserRef(userAuth)
        userRef.onSnapshot((snapShot: any) => {
          this.setState(
            {
              currentUser: {
                auth: userAuth,
                id: snapShot.id,
                ...snapShot.data(),
              },
            }
          )
        })
      } else if (userAuth == null) {
        this.setState({ currentUser: userAuth })
      }
      getUserBoards(userAuth)
    })

    window.addEventListener('mousedown', (e: any) => {
      if (e.target.id === 'backing') {
        let board = e.target
        let initialClientX = e.clientX
        let initialClientY = e.clientY
        let initialScrollX = board.scrollLeft
        let initialScrollY = board.scrollTop
        let logPosition = (e: any) => {
          let xFromOrigin = e.clientX - initialClientX
          let yFromOrigin = e.clientY - initialClientY
          board.scrollTo(
            initialScrollX - xFromOrigin,
            initialScrollY - yFromOrigin
            )
        }
        window.addEventListener('mousemove', logPosition)
        window.addEventListener('mouseup', (e) => {
          window.removeEventListener('mousemove', logPosition)
        })
      }
    })

    function setZoom() {
      let zoom = window.devicePixelRatio * 1.1
      let ui = ['.options-frame', '.header', '.pad-frame', '.trash-frame']
      ui.forEach((item: any) => {
        document.querySelector(item).style.zoom = `calc(100% / ${zoom})`
      })
      document.querySelector('#board__backing')?.scrollTo(3460, 1211)
    }
    window.addEventListener('DOMContentLoaded', () => setZoom() )
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth()
  }

  render() {
    return (
      <div>
        <MainBoard currentUser={this.state?.currentUser}/>
      </div>
    )
  }
}

export default App

// END of document
