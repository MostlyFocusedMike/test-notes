import React from 'react';
import './App.css';
import NotesDir from './components/NotesDir'
import Routes from './routes'

class App extends React.Component {
  constructor() {
    super()
    this.initState = {
      editing: false,
      local: false 
    }
    this.state = this.initState
  }

  toggleEdit = () => {
    this.setState((prevState) => ({
      editing: !prevState.editing
    }));
  }

  componentDidMount() {
    if (window.location.href.match("//localhost:")) {
      console.log('hello', window.location.href)
      this.setState({
        local: true,
        editing: true
      })
    }
  }

  render() {
    return (
      <div className="App">
        <NotesDir 
          viewInfo={this.state}
        />
        <Routes 
          viewInfo = {this.state} 
          toggleEdit = {this.toggleEdit}
        />
      </div>
    );
  }
}

export default App;
