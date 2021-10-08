import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import routers from './config/routers.tsx'
import './css/global.css';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {
            routers.map(router => {
              return (
                <Route
                  key={router.path}
                  path={router.path}
                  component={router.component}
                >
                </Route>
              )
            })
          }
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
