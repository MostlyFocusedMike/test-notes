const notesUrl = "http://localhost:8100"

class NotesAdapter {
  static getOne(route) {
    return fetch(`${notesUrl}/notes/${route}`).then(r=>r.json())
  }

  static create(title) {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(title)
    }
    return fetch(`${notesUrl}/notes`, options)
      .then(r => r.json())
      .catch(console.log)
  }

  static update(note) {
    let options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    }
    console.log('Note in update:', note)
    return fetch(`${notesUrl}/notes/${note.title}`, options)
      .then(r => r.json())
  }


  static reload(route) {
    let options = {
      method: 'PUT',
    }
    return fetch(`${notesUrl}/reload`, options)
      .then(r=>r.text())
  }
}

export default NotesAdapter