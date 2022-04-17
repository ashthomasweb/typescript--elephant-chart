// MainReducer.js

import { indexFinder } from '../../methods/num-finders'

export const mainReducer = (state, action) => {
    switch (action.type) {
        case "TOG_USER":
            let user = state.user === 'Ash' ? 'Dave' : 'Ash'
            return {
                ...state,
                user: user
            }
        case "SET_MOUSE_OFFSET":
            let mouseOffset = {
                left: action.payload.left,
                top: action.payload.top
            }
            return {
                ...state,
                mouseOffset: mouseOffset
            }
        case "SET_NOTE_POSITION":
            let note = state.notes.filter((item) => item.id === Number(action.payload.id))[0]
            let notes = [ ...state.notes]
            note = {
                ...note,
                left: action.payload.left,
                top: action.payload.top
            }
            notes[indexFinder(notes, note.id)] = note
            return {
                ...state,
                notes
            }
        case "SET_CURRENT_USER":
            let currentUser = action.payload
            return {
                ...state,
                currentUser: currentUser
            }   
        case "SET_ALL_NOTES":
            {
            let notes = [...action.payload]
            return {
                ...state,
                notes: notes
            }
        }
        case "ONCHANGE_TEXT":
            {
                let newNote = {...state.newNote}
                newNote.noteText = action.payload
                return {
                    ...state,
                    newNote: newNote
                }
            }
        default:
            return state
    }
}

// END of document