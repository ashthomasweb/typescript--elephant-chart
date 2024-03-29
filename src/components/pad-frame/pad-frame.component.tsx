// pad-frame.component.tsx

import { useContext, useRef } from 'react'
import { MainContext } from '../../context/main/MainState'
import { newNoteGenerator } from '../../methods/new-note'
import '../pad-frame/pad-frame.styles.scss'

const PadFrame = (): JSX.Element => {
  const { state: { newNote, display, notes },
    dispatch,
  } = useContext(MainContext)

  const padFrameRef: any = useRef(null)

  // controlled input elements
  function changeInput(e: any) {
    dispatch({ type: 'ONCHANGE_PAD_TEXT', payload: {noteText: e.target.innerText} })
  }

  function resizeHandler(e: any) {
    let dimensions = padFrameRef.current.getBoundingClientRect()
    dispatch({ type: 'ONRESIZE_PAD', payload: { dimensions: {width: dimensions.width, height: dimensions.height}}})
  }

  function dragHandler(e: any) {
    e.dataTransfer.setDragImage(new Image(), -9000, -9000)
    let newNotes = newNoteGenerator(notes, newNote)
    dispatch({ type: 'SET_ALL_NOTES', payload: {notes: newNotes}})
  }

  function newDragHandler(e: any) {
    let board: any = document.getElementsByTagName('html')[0]
    let noteData: { [key: string]: string | number } = {
      left: e.clientX + board.scrollLeft,
      top: e.clientY + board.scrollTop,
      zIndex: 2147483647 // temp set while first drag is active, displays above interface, reset onDrop
    }
    dispatch({ type: "DRAG_NOTE_FROM_PAD", payload: {noteData: noteData} })
    padFrameRef.current.textContent = ''
  }

  return (
    <div
      className='pad-frame'
      onDrag={newDragHandler}
      onDragStart={dragHandler}
      onMouseUp={resizeHandler}
      draggable
      style={{ backgroundColor: newNote.noteBColor, zoom: `calc(100% / ${window.devicePixelRatio * display.uiZoom})` }}>
      <div id='input-text'
      ref={padFrameRef}
      contentEditable='true'
      onInput={changeInput}
      />
    </div>
  )
}

export default PadFrame

// END of document
