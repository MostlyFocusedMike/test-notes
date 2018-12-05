import React from 'react'
import marked from 'marked'

class MDPreview extends React.Component {
  constructor() {
    super() 
    this.state = {
      markdown: ""
    }
  }

  renderWelcome() {
    return "# hello there \n ## start adding markdown to get started"
  }

  render() {
    const { title, text } = this.props.note;
    const md = text || this.renderWelcome();
    const markdown = marked(md)
    return (
      <div id="md-preview">
        <h1>Preview of: {title}</h1>
        <div dangerouslySetInnerHTML={{__html: markdown}}></div>
      </div>
    )
  }
}

export default MDPreview