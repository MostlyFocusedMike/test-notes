import React from "react"
import marked from "marked"

class TableOfContents extends React.Component {
  constructor() {
    super() 
    this.initState = {
      sections: []
    }
    this.state = this.initState
  }

  loadContents() {
    if (this.props.text) {
      let sections = marked(this.props.text).match(/<h1.+>.+</g).map(text => {
        let match = text.match(/<h1 id="(.+)">(.+)</)
        return {
          link: match[1],
          text: match[2]
        }
      })
      this.setState({ sections })
    }
  }

  componentDidMount() {
    this.loadContents()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.loadContents()
    }
  }
  render() {
    return (
      <div id="table-of-contents"> 
        <p>Table of contents</p>
        {
          this.state.sections.map(section => <a href={`#${section.link}`}>{section.text}</a>)
        }
      </div>

    )
  }
}

export default TableOfContents