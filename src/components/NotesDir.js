import React from 'react'
import NotesAdapter from '../adapters'
import NewNoteModal from './NewNoteModal'
import { Link } from "react-router-dom";

class NotesDir extends React.Component {
  constructor() {
    super() 
    this.state = {
      files: [],
      isNewFileModalVisibile: false,
    }
  }

  componentWillMount() {
    const files = require('../files.json')
    this.setState({files})
  }

  reload() {
    NotesAdapter.reload()
  }

  isEditMode() {
    return this.props.viewInfo.editing && this.props.viewInfo.local 
  }

  toggleNewFileModal = () => {
    console.log('hello')
    this.setState((prevState) => ({
      isNewFileModalVisibile: !prevState.isNewFileModalVisibile
    }));
  }

  render() {
    return (
      <div id="notes-dir">
        <h1>Files</h1>
        { this.isEditMode() ? <button onClick={this.toggleNewFileModal}>New File</button> : "" }
        { this.state.isNewFileModalVisibile ? <NewNoteModal toggleNewFileModal={this.toggleNewFileModal} /> : "" }
        { this.state.files.map((file, idx) =>  <Link to={`/notes/${file}`} key={idx}>{file}</Link>) }
        { this.isEditMode() ? <button onClick={this.reload}>Reload</button> : "" }
      </div>
    )
  }
}

export default NotesDir