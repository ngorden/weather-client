import React, { Component } from 'react'

import { Map, Marker, TileLayer, Popup } from 'react-leaflet'

import './Map.css'
import IWeather from '../../@types/weather'

import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet'

interface MapProps {
    center: [number, number],
    conditions: IWeather[],
}


interface MapState {
    center: [number, number],
    zoom: number
}

class LeafletMap extends Component<MapProps, MapState> {
    constructor(props: any) {
        super(props)

        this.state = {
            center: this.props.center,
            zoom: 10
        }
    }
    render() {
        let markers = this.props.conditions.map(condition => {
            return (
                <Marker key={condition._id} position={[condition.coord.lat, condition.coord.lon]} >
                    <Popup>
                        The weather here: {condition.weather[0].description}
                    </Popup>
                </Marker >
            )
        })
        return (
            <div id="myMap" >
                <Map center={this.state.center} zoom={this.state.zoom}>
                    <TileLayer
                        key='bf84f11f5b96d1'
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url='https://{s}-tiles.locationiq.com/v2/obk/r/{z}/{x}/{y}.png?key=bf84f11f5b96d1'
                    />
                    {markers}
                </Map>
            </div >
        )
    }
}

export default LeafletMap
