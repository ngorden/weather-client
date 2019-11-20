import React, { Component } from 'react'
import IWeather from '../../@types/weather'
import WeatherSingle from '../single/Single'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

import './Weather.css'

interface WeatherState {
    conditions: Array<IWeather>,
    location: { lat: number, lon: number },
    single?: IWeather,
    query: string,
    units: 'imperial' | 'metric'
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const units = {
    temperature: { m: 'C', i: 'F' }
}

class Weather extends Component<{}, WeatherState> {
    constructor(props: any) {
        super(props)


        this.state = {
            conditions: [{
                "coord": { "lon": 139, "lat": 35 },
                "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01n" }], "base": "stations",
                "main": { "temp": 289.92, "pressure": 1009, "humidity": 92, "temp_min": 288.71, "temp_max": 290.93 },
                "wind": { "speed": 0.47, "deg": 107.538 }, "clouds": { "all": 2 }, "dt": 1560350192,
                "sys": { "type": 3, "id": 2019346, "message": 0.0065, "country": "JP", "sunrise": 1560281377, "sunset": 1560333478 },
                "timezone": 32400, "id": 1851632, "name": "Shuzenji", "cod": 200, "_id": "1"
            }],
            location: { lat: Infinity, lon: Infinity },
            query: '',
            units: 'metric'
        }

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(pos => this.setState({
                location: {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                }
            }))
        }

        this.getGlobalForecast = this.getGlobalForecast.bind(this)
        this.getLocalForecast = this.getLocalForecast.bind(this)
        this.setSingle = this.setSingle.bind(this)
    }
    componentDidMount() {
        fetch('/api').then(value => value.json())
            .then(data => this.setState({ conditions: data }))
    }
    kelvinToCelcius(k: number) {
        return Math.round(((k - 273.15) * 100 + Number.EPSILON) / 100)
    }
    kelvinToFahrenheit(k: number) {
        return Math.round((((k - 273.15) * 9 / 5 + 32) * 100 + Number.EPSILON) / 100)
    }
    timestampToDate(timestamp: number) {
        var d = new Date(timestamp * 1000)
        var month = months[d.getUTCMonth()]
        var day = ('0' + d.getUTCDate()).slice(-2)
        return `${day} ${month} ${d.getUTCFullYear()}`
    }
    getGlobalForecast() {
        const forecastUri = `http://localhost:3001/api/weather/${this.state.query}`
        fetch(forecastUri)
            .then(data => data.json())
            .then(forecast => {
                this.setState({ query: '' })
                const conditions = [...this.state.conditions]
                conditions.push(forecast)
                this.setState({ conditions })
            })
    }
    getLocalForecast() {
        if (this.state.location.lat !== Infinity && this.state.location.lon !== Infinity) {
            fetch('/api/weather', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.location)
            })
                .then(res => res.json())
                .then(forecast => {
                    const conditions = [...this.state.conditions]
                    conditions.unshift(forecast)
                    this.setState({ conditions })
                })
        }
    }
    remove(id: string) {

    }
    setSingle(id: string) {
        this.setState({ single: this.state.conditions.find(condition => condition._id === id) })
    }
    render() {
        let conditionsList = (this.state.conditions) ?
            this.state.conditions.map(condition => {
                let temp_min = (this.state.units === 'metric') ? this.kelvinToCelcius(condition.main.temp_min) : this.kelvinToFahrenheit(condition.main.temp_min)
                let temp_max = (this.state.units === 'metric') ? this.kelvinToCelcius(condition.main.temp_max) : this.kelvinToFahrenheit(condition.main.temp_max)
                return (<tr key={condition._id}>
                    <td>{this.timestampToDate(condition.dt)}</td>
                    <td>{condition.name}</td>
                    <td>{condition.sys.country}</td>
                    <td>{condition.weather[0].description}</td>
                    <td>{temp_min}</td>
                    <td>{temp_max}</td>
                    <td id="btnDetails">
                        <Button key={condition._id} onClick={() => this.setSingle(condition._id)} href="#single" variant="link">Details</Button>
                    </td>
                </tr>)
            }) : [<tr>No Data</tr>]
        return (
            <React.Fragment>
                <div className="row col-md-12">
                    <div className="row col">
                        <Form inline>
                            <Form.Group>
                                <input className="form-control" type="text" placeholder="Miami, US"
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({ query: event.currentTarget.value })}
                                    value={this.state.query} />
                            </Form.Group>
                            <Form.Group>
                                <Button type="button" onClick={this.getGlobalForecast} variant="outline-success">Search</Button>
                            </Form.Group>
                        </Form>
                        <Button onClick={this.getLocalForecast} type="button" variant="outline-primary">Local Forecast</Button>
                    </div>
                    <div className="col" id="btn-group">
                        <ButtonGroup aria-label="Units">
                            <Button variant={this.state.units === 'imperial' ? 'primary' : 'light'} onClick={() => this.setState({ units: 'imperial' })}>&deg;F</Button>
                            <Button variant={this.state.units === 'metric' ? 'primary' : 'light'} onClick={() => this.setState({ units: 'metric' })}>&deg;C</Button>
                        </ButtonGroup>
                    </div>
                </div>
                <Table bordered striped>
                    <thead>
                        <tr>
                            <td>Date</td>
                            <td>Area</td>
                            <td>Country</td>
                            <td>Weather</td>
                            <td>Low (&deg;{this.state.units === 'imperial' ? units.temperature.i : units.temperature.m})</td>
                            <td>High (&deg;{this.state.units === 'imperial' ? units.temperature.i : units.temperature.m})</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {conditionsList}
                    </tbody>
                </Table>
                <hr className="divider"></hr>
                <WeatherSingle
                    kelvinToCelcius={this.kelvinToCelcius}
                    kelvinToFahrenheit={this.kelvinToFahrenheit}
                    units={this.state.units} weather={this.state.single} />
            </React.Fragment >
        )
    }
}

export default Weather
