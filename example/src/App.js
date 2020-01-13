import React, { Component } from 'react'

import Dynamic from 'r-dynamic'

export default class App extends Component {
  render () {
    return (
      <div>
        <Dynamic $as='p' $for={5}>
          <span>test</span>
        </Dynamic>
      </div>
    )
  }
}
