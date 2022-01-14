import React, { Component, useState } from 'react'

import '../MapComponents/Map.css';
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { Map, View } from "ol";
import Overlay from 'ol/Overlay';
import XYZ from 'ol/source/XYZ';
import { ScaleLine, MousePosition, defaults as defaultControls } from 'ol/control';
import { format } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { Image as ImageLayer, Tile as TileLayer, Vector } from 'ol/layer';
import TileWMS from 'ol/source/TileWMS'
import ImageWMS from 'ol/source/ImageWMS'
import Moment from 'moment';
import ReactDOM from 'react-dom';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import ForecastTable from './ForecastTable';
import LegendPanel from './LegendPanel';
let startDate = "", sdate = "";
let frameRate = 0.5; // frames per second
let animationId = null, imdlayer, MahaDist, minimumDate;
var view = "", map;
let rain_class1, rain_class2, rain_class3, rain_class4, rain_class5, maxrainfall;
var geojson;
var propertyName;
class Forecast extends Component {

	constructor(props) {
		super(props);

		this.state = {
			todate: "",
			mindate: "",
			minimumdate: "",
			maxdate: "",
			rain1: "",
			rain2: "",
			rain3: "",
			rain4: "",
			rain5: "",
			maxrainfall: "",
			tempmax1: "",
			tempmax2: "",
			tempmax3: "",
			tempmax4: "",
			tempmin1: "",
			tempmin2: "",
			tempmin3: "",
			tempmin4: "",
			pname: "",
		}

		// latLong = '&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;';
		this.scaleLineControl = new ScaleLine({
			units: 'metric',
			type: 'scalebar',
			bar: true,
			steps: 4,
			minWidth: 150
		});
		this.mouse = new MousePosition({
			projection: 'EPSG:4326',
			coordinateFormat: function (coordinate) {
				return format(coordinate, "&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;", 4);
			}
		});

		var topo = new TileLayer({
			title: 'Topo Map',
			type: 'base',
			visible: true,
			source: new XYZ({
				attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
					'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
				url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
					'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
				crossOrigin: 'Anonymous',
			})
		});

		this.pocraDistrict = new TileLayer({
			title: "Base Layer",
			source: new TileWMS({
				url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				params: {
					'LAYERS': 'PoCRA_Dashboard:District',
					'TILED': true,
				}
			})
		});

		view = new View({
			zoom: 7,
			center: transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857'),
		});


		map = new Map({
			// overlays: [this.overlay],
			target: null,
			view: view,
			controls: defaultControls().extend([this.mouse, this.scaleLineControl]),
			layers: [topo]
		});



		// map.addOverlay(overlay);
		this.closer = document.getElementById('popup-closer');
		this.setTime = this.setTime.bind(this);
		this.stop = this.stop.bind(this);
		this.play = this.play.bind(this);
		this.loadForecastMap = this.loadForecastMap.bind(this);
		this.changeMap = this.changeMap.bind(this);
		this.nextTime = this.nextTime.bind(this);
		this.next = this.next.bind(this);
		this.prevTime = this.prevTime.bind(this);
		this.prev = this.prev.bind(this);
		this.resetTime = this.resetTime.bind(this);
		this.reset = this.reset.bind(this);
		// this.renderAuthButton=this.renderAuthButton.bind(this);

	}


	componentDidMount() {

		map.setTarget("map");
		this.loadMap1();
		this.getForecastData();
		const overlay = new Overlay({
			element: ReactDOM.findDOMNode(this).querySelector('#popup'),
			positioning: 'center-center',
			stopEvent: false
		});

		map.addOverlay(overlay);

		map.on('click', evt => {
			overlay.setPosition(undefined)
			const coordinate = evt.coordinate;

			var viewResolution = (view.getResolution());
			var url = imdlayer.getSource().getFeatureInfoUrl(
				evt.coordinate,
				viewResolution,
				'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
			);
			if (url) {
				fetch(url)
					.then((response) => {
						// console.log(response.text());
						return response.text();
					})
					.then((html) => {
						var jsondata = JSON.parse(html);
						if (jsondata.features[0]) {
							if (jsondata.features[0].properties) {
								var popupContent = overlay.element.querySelector('#popup-content');
								popupContent.innerHTML = '';
								popupContent.innerHTML = '<table id="customers" className="table table-bordered" style="border:1px solid black;width: 100%;color:black"><tr ><td style="background-color:skyblue;text-align:center;font-weight:bold;" colspan=2 >IMD Weather Forecast Attribute Information</td></tr><tr><td style="text-align: left">District </td><td style="text-align: left">' + jsondata.features[0].properties.dtnname + '</td></tr><tr><td style="text-align: left">Taluka </td><td style="text-align: left">' + jsondata.features[0].properties.thnname + '</td></tr><tr><td style="text-align: left">Forecast Date </td><td style="text-align: left">' + jsondata.features[0].properties.forecast_date + '</td></tr><tr><td style="text-align: left">Rainfall (mm) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.rainfall_mm) + '</td></tr><tr><td style="text-align: left">Maximum Temprature &#8451; </td><td style="text-align: left ">' + parseFloat(jsondata.features[0].properties.temp_max_deg_c) + '</td></tr><tr><td style="text-align: left">Minimum Temprature &#8451; </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.temp_min_deg_c) + '</td></tr><tr><td style="text-align: left">Wind Speed(m/s) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.wind_speed_ms) + '</td></tr><tr><td style="text-align: left">Wind Direction</td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.wind_direction_deg) + '</td></tr><tr><td style="text-align: left">Humidity 1 (%) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.humidity_1) + '</td></tr><tr><td style="text-align: left">Humidity 2 (%)</td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.humidity_2) + '</td></tr><tr><td style="text-align: left">Cloud Cover </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.cloud_cover_octa) + '</td></tr><tr></table>';
								// overlay.addOverlay(this.popup);
								overlay.setPosition(coordinate);
							}
						}
					});
			}
		})

	}


	async getForecastData() {
		const response = fetch("http://gis.mahapocra.gov.in/weatherservices/meta/getforecastdate")
			.then(response => response.json())
			.then(data => {
				this.setState(prev => ({
					todate: data.forecast[0].today,
					mindate: data.forecast[0].mindate,
					minimumdate: data.forecast[0].mindate,
					maxdate: data.forecast[0].maxdate,
					rain1: data.forecast[0].rain_class1,
					rain2: data.forecast[0].rain_class2,
					rain3: data.forecast[0].rain_class3,
					rain4: data.forecast[0].rain_class4,
					rain5: data.forecast[0].rain_class5,
					maxrainfall: data.forecast[0].maxrainfall,
					tempmax1: data.forecast[0].temp_max1,
					tempmax2: data.forecast[0].temp_max2,
					tempmax3: data.forecast[0].temp_max3,
					tempmax4: data.forecast[0].temp_max4,
					tempmin1: data.forecast[0].temp_min1,
					tempmin2: data.forecast[0].temp_min2,
					tempmin3: data.forecast[0].temp_min3,
					tempmin4: data.forecast[0].temp_min4,
					pname: "rainfall_mm",
				}));
				this.loadForecastMap(data.forecast[0].mindate);
				// this.onFitMapHandler();

			});

	}

	source = new VectorSource({
		url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=District&outputFormat=application/json',
		format: new GeoJSON(),
	});

	onFitMapHandler() {

		if (geojson) {
			map.removeLayer(geojson);
		}

		var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=District&outputFormat=application/json";
		geojson = new VectorLayer({
			title: "Taluka",
			source: new VectorSource({
				url: url,
				format: new GeoJSON()
			}),
		});
		// const feature = geojson.getSource().getFeatures();
		// console.log(feature);
		map.getView().fit(geojson.getSource().getExtent())
		// const polygon = feature.getGeometry()
		// geojson.getSource().on('addfeature', function () {
		//     //alert(geojson.getSource().getExtent());
		//     map.getView().fit(
		//         geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
		//     );
		// });
		map.addLayer(geojson);

	}

	loadForecastMap = (forecatdate) => {

		let viewMap = map.getView();
		let extent = viewMap.calculateExtent(map.getSize());
		//hold the current resolution
		let res = viewMap.getResolution();
		//if you use older versions of ol3 use `fitExtent` istead of `fit`
		viewMap.fit(extent, map.getSize());
		//apply the resolution back 
		view.setResolution(res);
		// ((document.getElementById("mapselect")||{}).value)||"";
		let elevalue = ((document.getElementById("mapselect") || {}).value) || "";
		if (imdlayer) {
			map.removeLayer(imdlayer);
		}
		if (this.pocraDistrict) {
			map.removeLayer(this.pocraDistrict);
		}


		if (elevalue === "rainfall") {
			this.propname = "rainfall_mm";
			this.label = "Rainfall";
			rain_class2 = this.state.rain2;
			rain_class3 = this.state.rain3;
			rain_class4 = this.state.rain4;
			rain_class5 = this.state.rain5;
			propertyName = this.propname;
			this.state = {
				...this.state
			}

		} else if (elevalue === "mintemprature") {
			this.propname = "temp_min_deg_c";
			this.label = "Minimum Temprature";

			rain_class2 = this.state.tempmin1;
			rain_class3 = this.state.tempmin2;
			rain_class4 = this.state.tempmin3;
			rain_class5 = this.state.tempmin4;
			this.state = {
				...this.state
			}
		} else if (elevalue === "maxtemprature") {
			this.propname = "temp_max_deg_c";
			this.label = "Maximum Temprature";
			this.state = {
				...this.state
			}
			rain_class2 = this.state.tempmax1;
			rain_class3 = this.state.tempmax2;
			rain_class4 = this.state.tempmax3;
			rain_class5 = this.state.tempmax4;
			propertyName = this.propname;
		}
		console.log("propname:" + this.propname + ";title:" + rain_class2 + ";rain1:" + (parseInt(rain_class2)) + ";rain2:" + (parseInt(rain_class2) + 0.1) + ";rain3:" + (parseInt(rain_class3)) + ";rain4:" + (parseInt(rain_class3) + 0.1) + ";rain5:" + (parseInt(rain_class4)) + ";rain6:" + (parseInt(rain_class4) + 0.1))

		var indate = "forecast_date IN('" + Moment(forecatdate).format('YYYY-MM-DD') + "')";
		imdlayer = new ImageLayer({
			title: "IMD Forecast",
			source: new ImageWMS({
				attributions: ['&copy; IMD Forecast'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA:ForecastView',
					'TILED': true,
					'env': "propname:" + this.propname + ";title:" + rain_class2 + ";rain1:" + (parseInt(rain_class2)) + ";rain2:" + (parseInt(rain_class2) + 0.1) + ";rain3:" + (parseInt(rain_class3)) + ";rain4:" + (parseInt(rain_class3) + 0.1) + ";rain5:" + (parseInt(rain_class4)) + ";rain6:" + (parseInt(rain_class4) + 0.1),
					'CQL_FILTER': indate
				},
			})
		});

		map.addLayer(imdlayer);
		map.addLayer(this.pocraDistrict);



		// const resolution = map.getView().getResolution();
		// // this.updateLegend(resolution);
		// let graphicUrl = imdlayer.getSource().getLegendUrl(resolution);
		// // console.log(graphicUrl)
		// let img = document.getElementById('legend');
		// img.src = graphicUrl;

	}

	setTime() {
		var edate = Moment(this.state.maxdate).format('DD-MM-YYYY')
		startDate = new Date(this.state.mindate);
		startDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
		sdate = Moment(startDate).format('DD-MM-YYYY');
		this.setState({
			mindate: startDate
		});
		this.loadForecastMap(Moment(startDate).format('YYYY-MM-DD'));
		if (sdate == edate) {
			this.stop();
			this.reset();
		} else {

		}

	}

	resetTime() {

		var edate = Moment(this.state.maxdate).format('DD-MM-YYYY')

		startDate = new Date(this.state.todate);
		startDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
		sdate = Moment(startDate).format('DD-MM-YYYY');
		this.setState({
			mindate: startDate
		});
		this.loadForecastMap(Moment(startDate).format('YYYY-MM-DD'));
		this.stop();
	}
	reset() {
		this.stop();
		animationId = window.setInterval(this.resetTime, 2000 / frameRate);
	}

	stop() {
		if (animationId !== null) {
			window.clearInterval(animationId);
			animationId = null;
		}

	};

	play() {
		this.stop();
		animationId = window.setInterval(this.setTime, 4000 / frameRate);

	};
	nextTime() {
		console.log(this.state)
		var enddate = new Date(this.state.maxdate);
		var end = new Date(enddate.getTime() + 24 * 60 * 60 * 1000);
		var edate = Moment(end).format('DD-MM-YYYY')
		startDate = new Date(this.state.mindate);
		startDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
		sdate = Moment(startDate).format('DD-MM-YYYY');
		if (sdate == edate) {
			console.log("stop loop")
			this.stop();
		} else {
			this.setState({
				mindate: startDate
			});
			this.loadForecastMap(Moment(startDate).format('YYYY-MM-DD'));
		}

		this.stop();
	}

	next() {
		this.stop();
		animationId = window.setInterval(this.nextTime, 1000);
	};
	prevTime() {
		var edate = Moment(this.state.maxdate).format('DD-MM-YYYY')
		startDate = new Date(this.state.mindate);
		startDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
		sdate = Moment(startDate).format('DD-MM-YYYY')
		var md = new Date(this.state.minimumdate);
		if (startDate < md) {
			startDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
			this.stop();
		} else if (sdate == edate) {
			this.stop();
		} else {
			this.setState({
				mindate: startDate
			});
			this.loadForecastMap(Moment(startDate).format('YYYY-MM-DD'));
			// updateInfo();
			this.stop();
		}

		this.stop();
	}

	prev() {

		this.stop();
		animationId = window.setInterval(this.prevTime, 1000);
	};

	changeMap() {
		this.loadForecastMap(this.state.mindate)

		if (this.propname == "rainfall_mm") {
			this.setState({
				pname: "rainfall_mm"
			})
		} else if (this.propname == "temp_min_deg_c") {
			this.setState({
				pname: "temp_min_deg_c"
			})
		} else if (this.propname == "temp_max_deg_c") {
			this.setState({
				pname: "temp_max_deg_c"
			})
		}
	}
	loadMap1() {

		if (geojson) {
			map.removeLayer(geojson);
		}

		var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=District&outputFormat=application/json";
		geojson = new Vector({
			title: "Taluka",
			source: new VectorSource({
				url: url,
				format: new GeoJSON()
			}),
		});
		geojson.getSource().on('addfeature', function () {
			//alert(geojson.getSource().getExtent());
			map.getView().fit(
				geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
			);
		});


		map.addLayer(geojson);
		// this.getCategoryApplicationCount({
		// 	target: { value: 'All' }

		// });
	}


	render() {

		return (

			<div>
				<div className="content-wrapper">
					{/* Content Header (Page header) */}
					<section className="content-header">
						<div className="container-fluid">
							<div className="row mb-2">
								<div className="col-sm-6">
									<label style={{ paddingTop: 9, color: "rgb(248, 112, 33)" }}>IMD Weather Forecast (  {Moment(this.state.minimumdate).format('DD-MM-YYYY')} - {Moment(this.state.maxdate).format('DD-MM-YYYY')} )</label>
								</div>
								<div className="col-sm-6 float-sm-right" style={{backgroundColor: 'grey',}}>
									<ol className="breadcrumb float-sm-right">
										<li className="nav-item dropdown">
											<div className="form-group" style={{ padding: 5 }}>
												<select className="form-control" id="mapselect" onChange={this.changeMap}>
													<option value="rainfall">Rainfall</option>
													<option value="mintemprature">Minimum Temprature</option>
													<option value="maxtemprature">Maximum Temprature</option>
												</select>
											</div>
										</li>
										<li className="nav-item dropdown">
											<div className="form-group" style={{ padding: 5 }}>
												<label>Forecast on Date: {Moment(this.state.mindate).format('DD-MM-YYYY')}</label>
											</div>
										</li>
										<li className="nav-item dropdown">
											<a className="nav-link" onClick={this.prev}>
												<i class="fas fa-backward" title={"Privious"}  ></i>
											</a>
										</li>
										<li className="nav-item dropdown">
											<a className="nav-link" onClick={this.play}>
												<i class="fas fa-play" title={"Play"} ></i>
											</a>
										</li>
										<li className="nav-item dropdown">
											<a className="nav-link" onClick={this.stop}>
												<i class="fas fa-pause" title={"Pause"}></i>
											</a>
										</li>
										<li className="nav-item dropdown">
											<a className="nav-link" onClick={this.next}>
												<i class="fas fa-forward" title={"Next"}></i>
											</a>
										</li>
										<li className="nav-item dropdown">
											<a className="nav-link" onClick={this.reset}>
												<i class="far fa-sync-alt"></i>
											</a>
										</li>
									</ol>
								</div>
							</div>
						</div>{/* /.container-fluid */}
					</section>
					{/* Main content */}
					<section className="content" style={{ marginTop: -36 }}>
						{/* Default box */}
						<div className="card card-solid">
							<div className="card-body">
								<div className="row">
									<div className="col-12 col-sm-12" id="map" style={{ height: "60vh", width: "100%" }}>
									</div>
									<div id="popup" className="ol-popup">
										<a href="#" id="popup-closer" className="ol-popup-closer" />
										<div id="popup-content" />
									</div>

									<div id={"legend"} className="box stack-top">
										<LegendPanel props={this.state} />
									</div>

									{/* Legend:
									<div><img id="legend" /></div> */}
								</div>


							</div>

							{/* /.card-body */}
						</div>
						<ForecastTable todate={this.state.todate} />
						{/* /.card */}
					</section>

					{/* /.content */}
				</div>

			</div>
		)
	}
}



export default Forecast;