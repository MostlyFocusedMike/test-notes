import React from 'react'
import NotesAdapter from '../adapters'
import { Redirect } from 'react-router'

class NewNoteModal extends React.Component {
  constructor() {
    super() 
    this.initState = {
      title: "",
      redirectNewFile: false,
    }
    this.state = this.initState
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    NotesAdapter.create(this.state)
      .then((res) => {
        if (res.msg) {
          alert(res.msg)
        } else {
          this.sleep(100).then(() => { // I give up trying to solve the race condition for now.
            this.setState({redirectNewFile: true})
          })
        }
      })
  }

  componentDidUpdate =() => {
    if (this.state.redirectNewFile) {
      this.setState({
        redirectNewFile: false
      })
    }
  }

  render() {
    if (this.state.redirectNewFile) {
      // whole page hard reloads on file creation, so we need to immediately redirect to the new file
      return <Redirect to={`/notes/${this.state.title}`}/>;
    }
    return (
      <div id="new-file-modal">
        <h1>I am the new file modal</h1>
        <form onSubmit={this.handleSubmit}>
          <label>File Name</label>
          <input type="text" name="title" onChange={this.handleChange} />
          <p>Warning: creating a new file will destroy any unsaved changes. Be sure to save your current file</p>
          <button onClick={this.props.toggleNewFileModal}>Cancel</button>
          <button>Create</button>
        </form>
      </div> 
    )
  }
}

export default NewNoteModal