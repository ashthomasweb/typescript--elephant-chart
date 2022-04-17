import { createContext, useReducer } from 'react'
import { mainReducer } from './MainReducer'
import { initialArray } from '../../assets/initial-array.js'

// interface ContextState {

// }
export const MainContext = createContext()



const MainState = (props) => {
  const initialState = {
    user: 'Ash',
    mouseOffset: {
      left: 0,
      top: 0,
    },
    newNote: {
      id: 1,
      left: '',
      top: '',
      width: '120px',
      height: '200px',
      noteText: '',
      // zIndex: 0,
      // trayText: '',
      // isTrayDisplay: false,
      // trayWidth: '150px',
      // trayHeight: '200px',
      // border: 'none',
      // noteBColor: '#f2ecb3',
      // isMatBoard: false,
      // isNew: true,
      // noteGroup: [],
      // matOffsetX: 0,
      // matOffsetY: 0,
      // isChecked: false,
      // iframe: false
    },
    notes: initialArray
  }

  // id: 1,
  // width: '',
  // height: '',
  // top: '',
  // left: '',
  // zIndex: 0,
  // mouseOffsetX: 0, // removed
  // mouseOffsetY: 0, // removed
  // noteText: '',
  // trayText: '',
  // isTrayDisplay: false,
  // trayWidth: '150px',
  // trayHeight: '200px',
  // border: 'none',
  // noteBColor: '#f2ecb3',
  // isMatBoard: false,
  // isNew: true,
  // noteGroup: [],
  // matOffsetX: 0,
  // matOffsetY: 0,
  // isChecked: false,
  // iframe: false


  const [state, dispatch] = useReducer(mainReducer, initialState)
  let value = { state, dispatch }

  return (
    <MainContext.Provider value={value}>{props.children}</MainContext.Provider>
  )
}

export default MainState

// END of document