import Container from 'react-bootstrap/Container'

import Button from 'react-bootstrap/Button'
import WeatherTable from '../weather/Weather'

import React, { Component } from 'react'
import './App.css'

interface AppProps {
  description: string,
  title: string
}

class App extends Component<AppProps> {
  render() {
    return (
      <Container className="body-content">
        <h2 className="title">{this.props.title}</h2>
        <p>Welcome to {this.props.description}</p>
        <hr className="divider"></hr>
        <Button variant="link" href="https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes">Country Codes</Button>
        <WeatherTable />
        <hr className="divider"></hr>
        <p style={{ textAlign: "right" }}><em>Powered by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" >Open Weather</a></em></p>
      </Container>
    )
  }
}

export default App
