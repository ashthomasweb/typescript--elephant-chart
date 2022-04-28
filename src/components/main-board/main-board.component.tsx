// main-board.component.tsx

import { useContext } from 'react'
import { MainContext } from '../../context/main/MainState'
import Note from '../../components/note/note.component'
import UserInterface from '../user-interface/user-interface.component'
import { trashBoxDisplay, trashHandler } from '../../methods/trashHandlers'
import { zIndexDrag } from '../../methods/num-finders'

import '../main-board/main-board.styles.scss'

type Props = {
  currentUser: any
}

const MainBoard = (props: Props): JSX.Element => {
  const {
    state: { mouseOffset, notes, boardObj },
    dispatch,
  } = useContext(MainContext)

  const getMousePos = (e: any): void => {
    // const rect: any = e.target.getBoundingClientRect()
    const mouseOffset: object = {
      left: e.clientX - parseFloat(getComputedStyle(e.target.parentNode).left),
      top: e.clientY - parseFloat(getComputedStyle(e.target.parentNode).top),
    }
    dispatch({ type: 'SET_MOUSE_OFFSET', payload: mouseOffset })
  }

  const getPosition = (
    parent: any,
    position: string,
    mouse: number
  ): number => {
    return mouse - mouseOffset[position]
  }

  const dragNote = (e: any): void => {
    const parent: object = e.currentTarget.parentElement.getBoundingClientRect()
    let newLeft: number = getPosition(parent, 'left', e.clientX)
    let newTop: number = getPosition(parent, 'top', e.clientY)
    let noteData: { [key: string]: string | number } = {
      left: `${newLeft}px`,
      top: `${newTop}px`,
      id: e.target.id,
      zIndex: zIndexDrag(notes)
    }
    dispatch({ type: 'SET_NOTE_DATA', payload: noteData })
    trashBoxDisplay(e)
  }

  const onDrop = async (e: any) => {
    let newNotes: any[] = await trashHandler(e, [...notes], dispatch)
    dispatch({ type: 'SET_ALL_NOTES', payload: newNotes})
  }

  

  return (
      <div id='backing'
      className='board__backing'
      style={{backgroundColor: boardObj.backgroundColor}}
      onDrop={onDrop}
      >
      <UserInterface currentUser={props.currentUser} />
        {notes.map(({ id, ...noteProps }: { id: number; noteProps: [] }) => (
          <Note
            id={id}
            key={id}
            dragNote={dragNote}
            getMousePos={getMousePos}
            noteData={noteProps}
          />
        ))}
      </div>
  )
}

export default MainBoard

// END of document
