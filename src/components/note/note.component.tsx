// note.component.tsx

import { useContext, useRef } from 'react'
import { MainContext } from '../../context/main/MainState'
import { indexFinder } from '../../methods/num-finders'
import { getGroupIds } from '../../methods/find-group'

import check from '../../assets/check.png'
import './note.styles.scss'

const Note = (props: any) => {
  const { state: { notes }, dispatch } = useContext(MainContext)

  const currentNote: any = useRef(null)
  const currentTray: any = useRef(null)

  let noteData = props.noteData

  let notePosition = {
    // package style properties for easy CSS assignment
    left: noteData.left,
    top: noteData.top,
    // width: noteData.width, // this is what needs to be set, currently 'fit-content', which works, but not for IE
    zIndex: noteData.zIndex,
    outline: noteData.isUpdate ? '5px solid green' : 'none',
  }

  let noteStyle = {
    width: noteData.width,
    height: noteData.height,
    backgroundColor: noteData.noteBColor,
  }

  function noteClickHandler(e: any) {
    noteData.isMatBoard && !noteData.isNew && findMatGroup(e.target.parentElement.id)
    props.getMousePos(e)
  }

  async function findMatGroup(id: any) {
    let noteGroup = await getGroupIds(id, notes)
    let newNotes = [...notes]
    newNotes[indexFinder(notes, id)].noteGroup = noteGroup
    assignMatOffset(id, noteGroup, newNotes)
  }

  function assignMatOffset(id: any, noteGroup: any[], notes: any[]) {
    let mat = notes[indexFinder(notes, id)]
    noteGroup.forEach((itemID: any) => {
      let note = notes[indexFinder(notes, itemID)]
      note.matOffsetX = parseFloat(mat.left) - parseFloat(note.left)
      note.matOffsetY = parseFloat(mat.top) - parseFloat(note.top)
    })
    dispatch({ type: 'SET_ALL_NOTES', payload: notes })
  }

  async function toggleUpdateMode(e: any) {
    let el = e.currentTarget
    await dispatch({
      type: 'TOG_UPDATE_MODE',
      payload: e.currentTarget.parentElement.id,
    })
    el.focus()
  }

  function updateNote(e: any) {
    dispatch({
      type: 'ONCHANGE_NOTETEXT',
      payload: {
        text: e.target.innerText,
        id: e.currentTarget.parentElement.id,
      },
    })
  }

  function resizeHandler(e: any) {
    let dimensions = currentNote.current.getBoundingClientRect()
    dispatch({
      type: 'ONRESIZE_NOTE',
      payload: {
        id: e.target.parentElement.id,
        width: dimensions.width,
        height: dimensions.height,
      },
    })
  }

  function updateTray(e: any) {
    dispatch({
      type: 'ONCHANGE_TRAYTEXT',
      payload: { text: e.target.value, id: props.id },
    })
  }

  function resizeTray(e: any) {
    let dimensions = currentTray.current.getBoundingClientRect()
    dispatch({
      type: 'ONRESIZE_TRAY',
      payload: {
        id: props.id,
        width: dimensions.width,
        height: dimensions.height,
      },
    })
  }

  function clickHandler(e: any) {
    let id = e.target.parentElement.id
    dispatch({
      type: 'TOG_TRAY',
      payload: { id: id, tray: noteData.isTrayDisplay },
    })
  }

  return (
    <div
      className='note-wrapper'
      style={notePosition}
      onMouseUp={resizeHandler}
      id={props.id}
      >
      <img
        className='note-check'
        src={check}
        style={{ opacity: `${props.noteData.isChecked ? '1' : '0.1'}` }}
        alt='checkmark'
        onClick={() =>
          dispatch({
            type: 'TOG_NOTE_CHECKED',
            payload: { id: props.id, isChecked: props.noteData.isChecked },
          })
        }
        />
      <div
        className='note-menu'
        data-tray={`tray-${noteData.id}`}
        onMouseDown={clickHandler}
        />
      <div
        ref={currentNote}
        className={`note-base isMat-${noteData.isMatBoard}`}
        onDragStart={(e) =>
          e.dataTransfer.setDragImage(new Image(), -9000, -9000)
        }
        draggable
        onDrag={props.dragNote}
        onMouseDown={noteClickHandler}
        onDoubleClick={toggleUpdateMode}
        style={noteStyle}
        contentEditable={noteData.isUpdate ? 'true' : 'false'}
        onBlur={(e) => updateNote(e)}
        suppressContentEditableWarning
        >
        {noteData.noteText}
      </div>
      <div
        className={`note-tray ${
          noteData.isTrayDisplay ? 'slide-out' : 'slide-in'
        }`}
        style={{
          backgroundColor: `${noteData.noteBColor}`,
          display: `${noteData.isTrayDisplay ? 'block' : 'none'}`,
        }}
        onDrag={(e) => e.preventDefault()}
        id={`tray-${noteData.id}`}
        >
        <textarea
          className={`tray-text ${
            noteData.isTrayDisplay ? 'slide-out' : 'slide-in'
          }`}
          ref={currentTray}
          style={{
            width: `${noteData.trayWidth}`,
            height: `${noteData.trayHeight}`,
            display: `${noteData.isTrayDisplay ? 'block' : 'none'}`,
          }}
          suppressContentEditableWarning
          contentEditable='true'
          onMouseUp={(e) => resizeTray(e)}
          onChange={(e) => updateTray(e)}
          value={noteData.trayText}></textarea>
      </div>
    </div>
  )
}

export default Note

// END of document
