import React from 'react'

class ModeBar extends React.Component {
  render() {
    return (
      <div id="mode-bar">
        <p>Currently in {this.props.viewInfo.editing ? "Editing" : "Viewing"} mode</p>
        <button onClick={this.props.toggleEdit}>Toggle</button>
      </div>
    )
  }
}

export default ModeBar