import { Grid, Button, Slider , Typography, Tooltip} from '@material-ui/core';
import React from 'react';
// import GoogleMapReact from 'google-map-react';
// import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

// const AnyReactComponent = ({ text }) => <div>{text}</div>;
import ReactMapboxGl, {  Marker } from 'react-mapbox-gl';
// import markerUrl from "./logo192.png";
const json_file = require("../../jsons/pretty.json");
// console.log({ lat: json_file[0].multi_geo[0].geocode.lat, lng: json_file[0].multi_geo[0].geocode.lng })
// console.log(json_file);
const Map = ReactMapboxGl({
    accessToken:
      'pk.eyJ1IjoicmFqdmFzaGlzaHRoYSIsImEiOiJja3FjaDhkYzEwMzc0MnZwZWtkNng2enhtIn0.IKLqZwQQogWEiC7K1g8t8w'
  });



class HomePage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            points :[],
            i :0,
            curr :{ lat: json_file[0].multi_geo[0].geocode.lat, lng: json_file[0].multi_geo[0].geocode.lng, dir:json_file[0].hd , speed:0},
            disabled:true,
            started:false,
            total:0,
            fixed:1000,
            speed:1000,
            speed_num:1
        }
      }
    
    alterAnimation = ()=>{
        if(!this.state.started){
            clearInterval(this.interval);
            this.interval = setInterval(() =>{
                this.setState({
                    curr: this.state.i <  this.state.total? this.state.points[this.state.i]:this.state.curr,
                    i : this.state.i +1,
                });
                if(this.state.i >= this.state.total){
                    clearInterval(this.interval);
                    return;
                }
            } , this.state.speed);
            this.setState({
                started:!this.state.started
            })
        }
        else{
            clearInterval(this.interval);
            this.setState({
                started:!this.state.started
            })
        }
    }
    timeout = (delay) =>{
        return new Promise( res => setTimeout(res, delay) );
    }
    resetAnimation =()=>{
        this.setState({
            disabled:true,
            curr :{ lat: json_file[0].multi_geo[0].geocode.lat, lng: json_file[0].multi_geo[0].geocode.lng, dir:json_file[0].hd , speed:0},
            i:0
        },()=>{
            this.setState({
                disabled:false
            })
        })
    }
    getData = async () => {
        let loc_array = [];
        let total = 0;
        for(const temp of json_file){
            if(temp.multi_geo){
                let loc_temp = temp.multi_geo.map((each,i)=>({lat:each.geocode.lat,lng:each.geocode.lng, dir:temp.hd, speed:temp.multi_sp[i].sp}));
                total += 10;
                loc_array.push(...loc_temp);

            }
        }
        await this.timeout(3000);
        console.log(loc_array);
        this.setState({
            points: loc_array,
            curr: loc_array.length>0?loc_array[0]:this.state.curr,
            disabled:false,
            total:total
        })
        
    }
    changeSpeed=(e,num)=>{
        let temp = this.state.started;
        console.log(num);
        this.setState({
            speed:this.state.fixed/num,
            started:false,
            speed_num:num
        },()=>{
            if(temp)
            this.alterAnimation();
        })
    }
    valueText=(text)=>{
        return `speed-${text}`
    }
    componentDidMount() {
        this.getData();
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render(){
        return(
            <div style={{ height: '100vh', width: '100%' }}>
                <Map
                    // eslint-disable-next-line 
                    style="mapbox://styles/mapbox/streets-v9"
                    containerStyle={{
                        height: '90vh',
                        width: '100vw'
                    }}
                    center={[this.state.curr.lng, this.state.curr.lat]}
                    zoom={[17]}
                    >
                    <Marker
                        coordinates={[this.state.curr.lng, this.state.curr.lat]}
                        anchor="bottom">
                            <Tooltip  arrow={true} title={<React.Fragment>
                                    <Grid container direction="column">
                                        <Typography style={{color:"white"}}>
                                            Car speed : {this.state.curr.speed}
                                        </Typography>
                                        <Typography style={{color:"white"}}>
                                            Car direction : {this.state.curr.dir}
                                        </Typography>
                                    </Grid>
                                </React.Fragment>}>
                                <img src="https://www.freeiconspng.com/uploads/car-top-view-icon-3.png" width="50px" height="60px" alt="Car Top View Icons No Attribution"
                                style={{
                                    transform:`rotate(${this.state.curr.dir}deg)`
                                }} />
                            </Tooltip>
                    </Marker>
                </Map>
                <Grid container direction="row" style={{padding:"10px 5px 0px 5px"}}>
                    <Grid item container spacing={4} xs={6}>
                        <Grid item>
                            <Button disabled={this.state.disabled} onClick={this.alterAnimation} color={this.state.started?"secondary":"primary"} variant="contained">
                                {this.state.started?"Stop Animation":"Start Animation"}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button disabled={this.state.disabled} onClick={this.resetAnimation} variant="contained">
                                Reset Animation
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={this.getData} variant="contained">
                                Load Data
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item container xs={6}>
                        <Grid item xs={6}>
                            <Typography id="speed_selector">
                                Speed selector in unit/second.
                            </Typography>
                            <Slider
                                // defaultValue={1}
                                value={this.state.speed_num}
                                aria-labelledby="speed_selector"
                                valueLabelDisplay="auto"
                                getAriaValueText={this.valueText}
                                step={1}
                                marks
                                min={1}
                                max={5}
                                onChangeCommitted={this.changeSpeed}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default HomePage;