import React, { Component } from 'react'

import IWeather from '../../@types/weather'
import './Single.css'

import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'

interface SingleProps {
    kelvinToCelcius: (k: number) => number,
    kelvinToFahrenheit: (k: number) => number,
    weather?: IWeather,
    units: 'imperial' | 'metric',
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

class Single extends Component<SingleProps> {
    metersSecToMPH(wind: number) {
        return ((wind * 2.237) * 100) / 100
    }
    mmToIn(mm: number) {
        return mm / 25.4
    }
    timestampDateTime(timestamp: number) {
        var d = new Date(timestamp * 1000)
        var month = months[d.getUTCMonth()]
        var day = ('0' + d.getUTCDate()).slice(-2)
        var hour = ('0' + d.getUTCHours()).slice(-2)
        var minute = ('0' + d.getUTCMinutes()).slice(-2)
        return `${hour}:${minute} ${day} ${month} ${d.getUTCFullYear()} UTC`
    }
    timestampTime(timestamp: number) {
        var d = new Date(timestamp * 1000)
        var hour = ('0' + d.getUTCHours()).slice(-2)
        var minute = ('0' + d.getUTCMinutes()).slice(-2)
        return `${hour}:${minute} UTC`
    }
    render() {
        if (this.props.weather) {
            let utcOffset = this.props.weather.timezone / 3600
            let conditionCards = this.props.weather.weather.map(condition => {
                return (
                    <Card key={condition.id} style={{ width: '150px' }}>
                        <div id="card-img">
                            <Image src={`http://openweathermap.org/img/w/${condition.icon}.png`} width='50' roundedCircle />
                        </div>
                        <Card.Body>
                            <Card.Title>{condition.main}</Card.Title>
                            <Card.Text>{condition.description}</Card.Text>
                        </Card.Body>
                    </Card>
                )
            })

            let lat: number = this.props.weather.coord.lat, lon: number = this.props.weather.coord.lon
            let lati = (lat < 0) ? <p>Latitude: {Math.abs(lat)}&deg; S</p> : <p>Latitude: {lat}&deg; N</p>
            let long = (lon < 0) ? <p>Longitude: {Math.abs(lon)}&deg; W</p> : <p>Longitude: {lon}&deg; E</p>

            let cloudiness: string | number = this.props.weather.clouds.all
            cloudiness = (cloudiness) > 90 ? 'Overcast' : cloudiness > 50 ? 'Mostly Cloudy' : cloudiness > 25 ? 'Some Clouds' : cloudiness > 0 ? 'Few Clouds' : 'No Clouds'
            let windDir = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][Math.round(this.props.weather.wind.deg / 22.5)]
            let min_temp = this.props.weather.main.temp_min, max_temp = this.props.weather.main.temp_max, main_temp = this.props.weather.main.temp,
                wind_speed: number | string = this.props.weather.wind.speed
            main_temp = (this.props.units === 'metric') ? this.props.kelvinToCelcius(main_temp) : this.props.kelvinToFahrenheit(main_temp)
            min_temp = (this.props.units === 'metric') ? this.props.kelvinToCelcius(min_temp) : this.props.kelvinToFahrenheit(min_temp)
            max_temp = (this.props.units === 'metric') ? this.props.kelvinToCelcius(max_temp) : this.props.kelvinToFahrenheit(max_temp)
            wind_speed = (this.props.units === 'metric') ? wind_speed + ' m/s' : this.metersSecToMPH(wind_speed) + ' mph'

            let r = this.props.weather.rain, s = this.props.weather.snow
            let rain = (r && r["3h"]) ? (this.props.units === 'metric') ? r["3h"] + ' mm in the 3 last hours' : this.mmToIn(r["3h"]) + ' in. in the 3 last hours' :
                (r && r["1h"]) ? (this.props.units === 'metric') ? r["1h"] + ' mm in the last hour' : this.mmToIn(r["1h"]) + ' in. in the last hour' : "No rain in the past 3 hours"
            let snow = (s && s["3h"]) ? (this.props.units === 'metric') ? s["3h"] + ' mm in the 3 last hours' : this.mmToIn(s["3h"]) + ' in. in the 3 last hours' :
                (s && s["1h"]) ? (this.props.units === 'metric') ? s["1h"] + ' mm in the last hour' : this.mmToIn(s["1h"]) + ' in. in the last hour' : "No snow in the past 3 hours"

            return (
                <React.Fragment>
                    <div className="row">
                        <h3 id="single"> <Badge pill variant="info">{main_temp}&deg;</Badge> {this.props.weather.name}, {this.props.weather.sys.country} </h3>
                        <b>&nbsp;UTC{utcOffset}</b>
                    </div>
                    <br />
                    <div className="row">
                        {conditionCards}
                    </div>
                    <br />
                    <div className="row">
                        <p className="col offset-sm">{this.timestampDateTime(this.props.weather.dt)}</p>
                        <div className="col">
                            <h3>Geocoordinates</h3>
                            {lati}
                            {long}
                        </div>
                        <div className="col">
                            <h3>Sunrise &amp; Sunset</h3>
                            <p>Rise: {this.timestampTime(this.props.weather.sys.sunrise)}</p>
                            <p>Set: {this.timestampTime(this.props.weather.sys.sunset)}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h3>Temperatures</h3>
                            <div className="row col-md-12" id="condition-description">
                                <p>Low: {min_temp}&deg;&nbsp;&nbsp;</p>
                                <p>High: {max_temp}&deg;</p>
                            </div>
                        </div>
                        <div className="col">
                            <h3>Rain</h3>
                            <div id="condition-description">
                                <p>{rain}</p>
                            </div>
                        </div>
                        <div className="col">
                            <h3>Snow</h3>
                            <div id="condition-description">
                                <p>{snow}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h3>Cloudiness</h3>
                            <div id="condition-description">
                                <p>{cloudiness} ({this.props.weather.clouds.all}%)</p>
                            </div>
                        </div>
                        <div className="col">
                            <h3>Wind</h3>
                            <div id="condition-description">
                                <p>{wind_speed} {windDir} ({this.props.weather.wind.deg}&deg;)</p>
                            </div>
                        </div>
                        <div className="col">
                            <h3>Pressure &amp; Humidity</h3>
                            <div id="condition-description">
                                <p>Pressure: {this.props.weather.main.pressure} hPa</p>
                                <p>Humidity: {this.props.weather.main.humidity}%</p>
                            </div>
                        </div>
                    </div>
                    <hr className="divider"></hr>
                </React.Fragment >
            )
        } else {
            return (
                <React.Fragment>
                    <h3 id="single">Choose an Entry for More Details</h3>
                </React.Fragment>
            )
        }
    }
}

export default Single
