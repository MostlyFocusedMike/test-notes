import React from "react"
import {Switch, Route} from "react-router-dom"
import Note from '../components/Note'

const Routes = (props) => {
  const {viewInfo, toggleEdit} = props
  return (
    <Switch>
      <Route 
        exact path="/" 
        render={(props) => <Note {...props} viewInfo={viewInfo} toggleEdit={toggleEdit}/>}
      />
      <Route 
        exact path="/notes/:fileName" 
        render={(props) => <Note {...props} viewInfo={viewInfo} toggleEdit={toggleEdit}/>}
      />
      <Route 
        exact path="*" 
        render={(props) => <Note {...props} viewInfo={viewInfo} toggleEdit={toggleEdit}/>}
      />
    </Switch>
  )
}

export default Routes