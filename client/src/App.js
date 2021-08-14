import React from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'

import Join from './components/Join.js'
import Main from './components/Main.js'

const App = () =>{
    return(
    <Router>
        <Route path='/' exact component={Join}/>
        <Route path='/main' component={Main}/>
    </Router>
    )
}

export default App
