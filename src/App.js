import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import ExpenseTable from './ExpenseTable';
import CategoryTable from './CategoryTable';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={ExpenseTable}/>
          <Route path='/categories' component={CategoryTable}/>
        </Switch>
      </div>
    );
  }
}

export default App;
