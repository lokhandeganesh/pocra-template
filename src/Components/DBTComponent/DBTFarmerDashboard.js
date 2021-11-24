import React, { Component } from 'react'
import '../MapComponents/Map.css';
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import { Feature, Map, View } from "ol";
import Overlay from 'ol/Overlay';
import XYZ from 'ol/source/XYZ';
import { ScaleLine, MousePosition, defaults as defaultControls } from 'ol/control';
import { format } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { Image as ImageLayer, Tile as TileLayer, Vector } from 'ol/layer';
import TileWMS from 'ol/source/TileWMS'
import ImageWMS from 'ol/source/ImageWMS'
import ReactDOM from 'react-dom';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import "./DBTDashboard.css"
import DBTPieChart from './DBTPieChart';
import Point from 'ol/geom/Point';
import { Fill, Stroke, RegularShape, Circle, Icon, Text, Style } from 'ol/style';
import LegendPanelDashboard from './LegendPanelDashboard';
import select from "select2";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';	



var view = "", map;
let pocraDBTLayer;
var featurelayer; var a = new Array();
var thing;
var geojson, talukaLayer,villageLayer;
var vectorSource = new VectorSource({});
var imgSource = new ImageWMS({});
let infoTable;
var overlay
export default class DBTFarmerDashboard extends Component {

	constructor(props) {
		super(props)
		this.state = {

			total: 0,
			headerLabel: "",
			graphCountLabel: "",
			graphLabel: "",
			lat: 0,
			lon: 0,
			no_of_application: 0,
			applicationCount: 0,
			districtName: "",
			classValues: {
				appl_1: 0,
				appl_2: 0,
				appl_3: 0,
				appl_4: 0,
				appl_5: 0,
				legendLabel: "No of Applications",
				legendLabelPoint: false,
			},
			

			activity: [
				[]
			],
			district: [
				[]
			],
			taluka: [
				[]
			],
			village: [
				[]
			],

			genderSelect: [
				{ value: 'm', label: 'Male' },
				{ value: 'f', label: 'Female' },
				{ value: 'o', label: 'Other' },
			],
			social_category: [
				{ value: 'sc', label: 'SC' },
				{ value: 'st', label: 'ST' },
				{ value: 'other', label: 'Other' },
			],
			farm_type: [
				{ value: 'sc', label: 'Land Less' },
				{ value: 'st', label: 'Marginal' },
				{ value: 'other', label: 'Small' },
			],
			gender: {

			},
			farmerType: {

			},
			category: {

			}


		}

		// scale line control
		this.scaleLineControl = new ScaleLine({
			units: 'metric',
			type: 'scalebar',
			bar: true,
			steps: 2,
			minWidth: 80,
			text: 'S'
		});

		// mouse position control
		this.mouse = new MousePosition({
			projection: 'EPSG:4326',
			coordinateFormat: function (coordinate) {
				return format(coordinate, "&nbsp;&nbsp; Lat : {y}, &nbsp;&nbsp; Long: {x} &nbsp;&nbsp;", 6);
			},
			placeholder: '&nbsp;&nbsp; '
		});
		// topo layer
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

		// pocra district layer
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


		// view for map

		view = new View({
			zoom: 7.2,
			center: transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857'),
		});
		// add map code

		map = new Map({
			// overlays: [this.overlay],
			target: null,
			view: view,
			controls: defaultControls().extend([this.mouse, this.scaleLineControl]),// controls on maps
			layers: [topo] // layer list to display on map at initial level
		});


		//function binding which are used
		this.getTaluka = this.getTaluka.bind(this)
		this.getVillage = this.getVillage.bind(this)
		this.getCategoryApplicationCount = this.getCategoryApplicationCount.bind(this)
		this.loadMap = this.loadMap.bind(this);
		this.getDBTVectorLayerDistrict = this.getDBTVectorLayerDistrict.bind(this);
		this.updateHeaderLabel = this.updateHeaderLabel.bind(this);
	}

	componentDidMount() {
		map.setTarget("map");
		this.getDistrict(); // load district in dropdown
		this.getFarmerActivity(); // load farmer activity in dropdown
		this.updateHeaderLabel();

		overlay = new Overlay({
			element: ReactDOM.findDOMNode(this).querySelector('#popup'),
			positioning: 'center-center',
			stopEvent: false
		});

		// display data in table on map click
		map.on('click', evt => {

			const coordinate = evt.coordinate;

			var viewResolution = (view.getResolution());

			var activity = document.getElementById("activity").value;

			var district = document.getElementById("district").value;

			var taluka = document.getElementById("taluka").value;

			var village = document.getElementById("village").value;

			var infoTabled = document.getElementById("infoTable");

			$(document).ready(function () {
				setTimeout(function () {
					$('#example').DataTable();
				}, 1000);
			});
			if (activity === "All" && district !== "All" && taluka === "All" && village === "All" && document.getElementById("locationRadio").checked === false) {
				var url = pocraDBTLayer.getSource().getFeatureInfoUrl(
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
							try {
								var jsondata = JSON.parse(html);
								var dtnname = jsondata.features[0].properties.dtnname;
								var thnname = jsondata.features[0].properties.thnname;
								// console.log(jsondata.features[0].properties)

								fetch('http://gis.mahapocra.gov.in/weatherservices/meta/pointInfo_ActivitybyID_dtnCode_thnCode_vinCode_attrribute?activityId=' + activity + '&districtCode=' + district + '&talukaCode=' + jsondata.features[0].properties.thncode + '&villageCode=All'+'&attrribute=Farmer')
									.then(response => {
										return response.json();
									}).then(data => {
										var tableData = "";
										data.tableInfo.map((activities) => {
											tableData = tableData + "<tr><td>" + activities.activity_group + "</td><td>" + activities.no_of_application+ "</td><td>" +activities.no_of_presanction + "</td><td>" + activities.no_of_paymentdone + "</td></tr>"
										})

										infoTabled.innerHTML = '<div class="container-fluid" ><div class="row" ><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><b>District: '+dtnname+'|Taluka: '+thnname+'</b></h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" ></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" ><i class="fas fa-times" /></button></div></div><div class="card-body" ><table id="example" class="table table-bordered table-striped"><thead ><tr><th>Activity </th><th>Applications </th><th>Presanctions </th><th>Disbursement </th></tr></thead><tbody>' + tableData + '</tbody></table></div></div></div></div></div>';

									});
							}
							catch (err) {
								infoTabled.style.display = "none";
								infoTabled.innerHTML = '';
							}
						});
				}

			} else if (activity !== "All" && district !== "All" && taluka === "All" && village === "All" && document.getElementById("locationRadio").checked === false) {

				var url = pocraDBTLayer.getSource().getFeatureInfoUrl(
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
							try {
								var jsondata = JSON.parse(html);
								var dtnname = jsondata.features[0].properties.dtnname;
								var thnname = jsondata.features[0].properties.thnname;
								fetch('http://gis.mahapocra.gov.in/weatherservices/meta/pointInfo_ActivitybyID_dtnCode_thnCode_vinCode_attrribute?activityId=' + activity + '&districtCode=' + district + '&talukaCode=' + jsondata.features[0].properties.thncode + '&villageCode=All'+'&attrribute=Farmer')
									.then(response => {
										return response.json();
									}).then(data => {
										var tableData = "";
										data.tableInfo.map((activities) => {
											tableData = tableData + "<tr><td>" + activities.activity_group + "</td><td>" + activities.no_of_application+ "</td><td>" +activities.no_of_presanction + "</td><td>" + activities.no_of_paymentdone + "</td></tr>"
										})
										infoTabled.innerHTML = '<div class="container-fluid" ><div class="row" ><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><b>District: '+dtnname+'|Taluka: '+thnname+'</b></h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" ></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" ><i class="fas fa-times" /></button></div></div><div class="card-body" ><table id="example" class="table table-bordered table-striped"><thead ><tr><th>Activity </th><th>Applications </th><th>Presanctions </th><th>Disbursement </th></tr></thead><tbody>' + tableData + '</tbody></table></div></div></div></div></div>';
									});
							}
							catch (err) {
								infoTabled.innerHTML = '';

							}
						});
				}
			} else if (activity == "All" && district !== "All" && taluka !== "All" && village === "All" && document.getElementById("locationRadio").checked === false) {

				var url = pocraDBTLayer.getSource().getFeatureInfoUrl(
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
							try {
								var jsondata = JSON.parse(html);
								var dtnname = jsondata.features[0].properties.dtnname;
								var thnname = jsondata.features[0].properties.thnname;
								var vilname = jsondata.features[0].properties.vilname;
								// console.log(jsondata.features[0].properties)
								fetch('http://gis.mahapocra.gov.in/weatherservices/meta/pointInfo_ActivitybyID_dtnCode_thnCode_vinCode_attrribute?activityId=' + activity + '&districtCode=' + jsondata.features[0].properties.dtncode + '&talukaCode=' + jsondata.features[0].properties.thncode + '&villageCode=' + jsondata.features[0].properties.vincode+'&attrribute=Farmer')
									.then(response => {
										return response.json();
									}).then(data => {
										var tableData = "";
										data.tableInfo.map((activities) => {
											tableData = tableData + "<tr><td>" + activities.activity_group + "</td><td>" + activities.no_of_application+ "</td><td>" +activities.no_of_presanction + "</td><td>" + activities.no_of_paymentdone + "</td></tr>"
										})
										infoTabled.innerHTML = '<div class="container-fluid" ><div class="row" ><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><b>District: '+dtnname+'|Taluka: '+thnname+'|Village: '+vilname+'</b></h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" ></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" ><i class="fas fa-times" /></button></div></div><div class="card-body" ><table id="example" class="table table-bordered table-striped"><thead><tr><th>Activity </th><th>Applications </th><th>Presanctions </th><th>Disbursement </th></tr></thead><tbody>' + tableData + '</tbody></table></div></div></div></div></div>';
									});
							}
							catch (err) {
								infoTabled.innerHTML = '';

							}
						});
				}
			} else if (activity !== "All" && district !== "All" && taluka !== "All" && village === "All" && document.getElementById("locationRadio").checked === false) {
				// imgSource
				// document.getElementById("tableSection").style.display = "block";
				var url = pocraDBTLayer.getSource().getFeatureInfoUrl(
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
							try {
								var jsondata = JSON.parse(html);
								var dtnname = jsondata.features[0].properties.dtnname;
								var thnname = jsondata.features[0].properties.thnname;
								var vilname = jsondata.features[0].properties.vilname;
								// console.log(jsondata.features[0].properties.dtncode)
								fetch('http://gis.mahapocra.gov.in/weatherservices/meta/pointInfo_ActivitybyID_dtnCode_thnCode_vinCode_attrribute?activityId=' + activity + '&districtCode=' + jsondata.features[0].properties.dtncode + '&talukaCode=' + jsondata.features[0].properties.thncode + '&villageCode=' + jsondata.features[0].properties.vincode+'&attrribute=Farmer')
									.then(response => {
										return response.json();
									}).then(data => {
										var tableData = "";
										data.tableInfo.map((activities) => {
											tableData = tableData + "<tr><td>" + activities.activity_group + "</td><td>" + activities.no_of_application+ "</td><td>" +activities.no_of_presanction + "</td><td>" + activities.no_of_paymentdone + "</td></tr>"
										})
										infoTabled.innerHTML = '<div class="container-fluid" ><div class="row" ><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><b>District: '+dtnname+'|Taluka: '+thnname+'|Village: '+vilname+'</b></h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" ></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" ><i class="fas fa-times" /></button></div></div><div class="card-body" ><table id="example" class="table table-bordered table-striped"><thead ><tr><th>Activity </th><th>Applications </th><th>Presanctions </th><th>Disbursement </th></tr></thead><tbody>' + tableData + '</tbody></table></div></div></div></div></div>';
									});
							}
							catch (err) {
								infoTabled.innerHTML = '';

							}
						});
				}
			} else if (activity === "All" && district !== "All" && taluka !== "All" && village !== "All" && document.getElementById("locationRadio").checked === true) {
				// imgSource
				// document.getElementById("tableSection").style.display = "block";

				map.addOverlay(overlay);
				overlay.setPosition(undefined)
				const coordinate = evt.coordinate;

				var viewResolution = (view.getResolution());
				var url = pocraDBTLayer.getSource().getFeatureInfoUrl(
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
							// console.log(jsondata.features[0].properties)
							if (jsondata.features[0]) {
								if (jsondata.features[0].properties) {
									var popupContent = overlay.element.querySelector('#popup-content');
									popupContent.innerHTML = '';
									popupContent.innerHTML = '<table id="customers" className="table table-bordered" style="border:1px solid black;width: 100%;color:black"><tr ><td style="background-color:skyblue;text-align:center;font-weight:bold;" colspan=2 >DBT Attribute Information</td></tr><tr><td style="text-align: left">Village </td><td style="text-align: left">' + jsondata.features[0].properties.village_name + '</td></tr><tr><td style="text-align: left">Activity Name  </td><td style="text-align: left">' + jsondata.features[0].properties.activity_name  + '</td></tr><tr><td style="text-align: left">Farmer Name </td><td style="text-align: left ">' + (jsondata.features[0].properties.full_name) +'</td></tr><tr><td style="text-align: left">7/12 No. </td><td style="text-align: left ">' + (jsondata.features[0].properties.use_712_no) + '</td></tr></table>';
									overlay.setPosition(coordinate);
								}
							} else {
								overlay.setPosition(undefined)
								// alert('Hi')
							}
						});
				}
				// var url_villInfo = geojson.getSource().getFeatureInfoUrl(
				// 	evt.coordinate,
				// 	viewResolution,
				// 	'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
				// );

				// if (url_villInfo) {
				// 	fetch(url_villInfo)
				// 		.then((response) => {
				// 			// console.log(response.text());
				// 			return response.text();
				// 		})
				// 		.then((html) => {
				// 			var jsondata = JSON.parse(html);
				// 			console.log(jsondata)
				// 			// if (jsondata.features[0]) {
				// 			// 	if (jsondata.features[0].properties) {
				// 			// 		var popupContent = overlay.element.querySelector('#popup-content');
				// 			// 		popupContent.innerHTML = '';
				// 			// 		popupContent.innerHTML = '<table id="customers" className="table table-bordered" style="border:1px solid black;width: 100%;color:black"><tr ><td style="background-color:skyblue;text-align:center;font-weight:bold;" colspan=2 >DBT Attribute Information</td></tr><tr><td style="text-align: left">Village </td><td style="text-align: left">' + jsondata.features[0].properties.village_name + '</td></tr><tr><td style="text-align: left">Activity Name  </td><td style="text-align: left">' + jsondata.features[0].properties.activity_name  + '</td></tr><tr><td style="text-align: left">Farmer Name </td><td style="text-align: left ">' + (jsondata.features[0].properties.full_name) +'</td></tr><tr><td style="text-align: left">7/12 No. </td><td style="text-align: left ">' + (jsondata.features[0].properties.use_712_no) + '</td></tr></table>';
				// 			// 		overlay.setPosition(coordinate);
				// 			// 	}
				// 			// } else {
				// 			// 	overlay.setPosition(undefined)
				// 			// 	alert('Hi')
				// 			// }
				// 		});
				// }
			}


		})

	}



	// add district count on map
	getDBTVectorLayerDistrict(activityId, applicationFor) {
		if (vectorSource) {

		}
		var applications = 0;
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtDistrict_attrribute?activityId=' + activityId+'&attrribute=Farmer')
			.then(response => {
				return response.json();
			}).then(data => {
				var totalApp = 0;
				vectorSource = new VectorSource({})

				data.activity.map((activities) => {

					// totalApp = totalApp + activities.no_of_application
					if (applicationFor === "no_of_application") {
						applications = applications + activities.no_of_application;
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_application,
							districtName: activities.district,

							// total: totalApp
						})

					} else if (applicationFor === "no_of_paymentdone") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_paymentdone,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_registration") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_registration,
							districtName: activities.district,
						})
					}
					else if (applicationFor === "no_of_presanction") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_presanction,
							districtName: activities.district,
						})
					}
					else if (applicationFor === "no_of_work_completed") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_work_completed,
							districtName: activities.district,
						})
					} else if (applicationFor === "no_of_village") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_village,
							districtName: activities.district,
						})
					}


					var feature = new Feature({
						geometry: new Point(transform([parseFloat(this.state.lat), parseFloat(this.state.lon)], 'EPSG:4326', 'EPSG:3857')),
						no_of_application: this.state.no_of_application,
						district: this.state.districtName,
						no_of_applications: activities.no_of_application,
						no_of_registration: activities.no_of_registration,
						no_of_paymentdone: activities.no_of_paymentdone
					});

					vectorSource.addFeature(feature);

				});

				if (featurelayer) {
					map.removeLayer(featurelayer)
				}

				this.setState({
					applicationCount: applications
				})
				featurelayer = new Vector({
					source: vectorSource,
					style: (feature) => {
						return new Style({
							text: new Text({

								text: '' + feature.get('no_of_application') + '',
								font: 'bold 12px sans-serif',

								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
								fill: new Fill({
									color: '#1F51FF'
								}),
								stroke: new Stroke({
									color: '#565287',
									width: 0.5
								})
							}),
						});
					}
				})
				map.addLayer(featurelayer)
			});

	}
	// add taluka count on map
	getDBTVectorLayerTaluka(activityId, districtCode, applicationFor) {
		if (vectorSource) {

		}
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtTaluka_attrribute?activityId=' + activityId + '&districtCode=' + districtCode+'&attrribute=Farmer')
			.then(response => {
				return response.json();
			}).then(data => {
				vectorSource = new VectorSource({})
				data.activity.map((activities) => {
					if (applicationFor === "no_of_application") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_application,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_paymentdone") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_paymentdone,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_registration") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_registration,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_presanction") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_presanction,
							districtName: activities.district,
						})
					}
					else if (applicationFor === "no_of_work_completed") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_work_completed,
							districtName: activities.district,
						})
					} else if (applicationFor === "no_of_village") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_village,
							districtName: activities.district,
						})
					}
					var feature = new Feature({
						geometry: new Point(transform([parseFloat(this.state.lat), parseFloat(this.state.lon)], 'EPSG:4326', 'EPSG:3857')),
						no_of_application: this.state.no_of_application,
						district: this.state.districtName
					});

					vectorSource.addFeature(feature);

				});


				if (featurelayer) {
					map.removeLayer(featurelayer)
				}
				featurelayer = new Vector({
					source: vectorSource,
					style: (feature) => {
						return new Style({
							text: new Text({

								text: '' + feature.get('no_of_application') + '',
								font: 'bold 12px sans-serif',

								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
								fill: new Fill({
									color: '#1F51FF'
								}),
								stroke: new Stroke({
									color: '#565287',
									width: 0.5
								})
							}),
						});
					}
				})
				map.addLayer(featurelayer)
			});

	}
	// add village count on map
	getDBTVectorLayerVillage(activityId, districtCode, talukaCode, applicationFor) {
		if (vectorSource) {

		}
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtVillage_attrribute?activityId=' + activityId + '&districtCode=' + districtCode + '&talukaCode=' + talukaCode)
			.then(response => {
				return response.json();
			}).then(data => {

				vectorSource = new VectorSource({})
				data.activity.map((activities) => {
					// console.log(data)
					if (applicationFor === "no_of_application") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_application,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_paymentdone") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_paymentdone,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_registration") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_registration,
							districtName: activities.district,
							// total: totalApp
						})
					} else if (applicationFor === "no_of_presanction") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_presanction,
							districtName: activities.district,
						})
					}
					else if (applicationFor === "no_of_work_completed") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_work_completed,
							districtName: activities.district,
						})
					} else if (applicationFor === "no_of_village") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_village,
							districtName: activities.district,
						})
					}
					var feature = new Feature({
						geometry: new Point(transform([parseFloat(this.state.lat), parseFloat(this.state.lon)], 'EPSG:4326', 'EPSG:3857')),
						no_of_application: this.state.no_of_application,
						district: this.state.districtName
					});

					vectorSource.addFeature(feature);

				});


				if (featurelayer) {
					map.removeLayer(featurelayer)
				}
				featurelayer = new Vector({
					source: vectorSource,
					style: (feature) => {
						return new Style({
							text: new Text({

								text: '' + feature.get('no_of_application') + '',
								font: 'bold 12px sans-serif',

								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
								fill: new Fill({
									color: '#1F51FF'
								}),
								stroke: new Stroke({
									color: '#565287',
									width: 0.5
								})
							}),
						});
					}
				})
				map.addLayer(featurelayer)
			});

	}

	// add single village count on map
	getDBTVectorLayerVillageData(activityId, districtCode, talukaCode, villageCode, applicationFor) {

		if (vectorSource) {

		}

		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtVillageIndividual_attrribute?activityId=' + activityId + '&districtCode=' + districtCode + '&talukaCode=' + talukaCode + '&villageCode=' + villageCode+'&attrribute=Farmer')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				vectorSource = new VectorSource({})
				data.activity.map((activities) => {
					if (applicationFor === "no_of_application") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_application,
							districtName: activities.district,
						})
					} else if (applicationFor === "no_of_paymentdone") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_paymentdone,
							districtName: activities.district,
						})
					} else if (applicationFor === "no_of_registration") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_registration,
							districtName: activities.district,
						})
					} else if (applicationFor === "no_of_registration") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_registration,
							districtName: activities.district,
						})
					} else if (applicationFor === "no_of_presanction") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_presanction,
							districtName: activities.district,
						})
					}
					else if (applicationFor === "no_of_work_completed") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_work_completed,
							districtName: activities.district,
						})
					} else if (applicationFor === "no_of_village") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_village,
							districtName: activities.district,
						})
					}
					var feature = new Feature({
						geometry: new Point(transform([parseFloat(this.state.lat), parseFloat(this.state.lon)], 'EPSG:4326', 'EPSG:3857')),
						no_of_application: this.state.no_of_application,
						district: this.state.districtName
					});

					vectorSource.addFeature(feature);

				});


				if (featurelayer) {
					map.removeLayer(featurelayer)
				}
				featurelayer = new Vector({
					source: vectorSource,
					style: (feature) => {
						return new Style({
							text: new Text({
								text: '' + feature.get('no_of_application') + '',
								font: 'bold 12px sans-serif',
								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
								fill: new Fill({
									color: '#1F51FF'
								}),
								stroke: new Stroke({
									color: '#565287',
									width: 0.5
								})
							}),
						});
					}
				})
				map.addLayer(featurelayer)
			});

	}

	// pass data to legend and load district map 
	getDBTLayerClassValues(activityId, applicationFor) {
		var url = "", layerName = "";
		if (activityId === "All") {
			layerName = "dbtDistrict";
		} else {
			layerName = "dbtAcivityGroup";
		}

		let initialActivity = [];

		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtNumApplications_attrribute?activityId=' + activityId + '&summary_for=' + applicationFor+'&attrribute=Farmer')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				var labelValue = "";
				if (applicationFor === "no_of_application") {
					labelValue = "Applications";
				} else if (applicationFor === "no_of_paymentdone") {
					labelValue = "Disbursement";
				} else if (applicationFor === "no_of_registration") {
					labelValue = "Registrations";
				} else if (applicationFor === "no_of_presanction") {
					labelValue = "Presanctions";
				} else if (applicationFor === "no_of_work_completed") {
					labelValue = "Work Completed";
				} else if (applicationFor === "no_of_village") {
					labelValue = "PoCRA Villges";
				}
				initialActivity = data.activity.map((activities) => {
					// console.log(activities.appl_1)
					this.setState(prev => ({
						classValues: {
							appl_1: activities.appl_1,
							appl_2: activities.appl_2,
							appl_3: activities.appl_3,
							appl_4: activities.appl_4,
							// appl_5: activities.appl_5,
							legendLabel: labelValue,
							legendLabelPoint: false
						},


					}));
					return activities;

				});
				this.loadMap(initialActivity, layerName, activityId, applicationFor)

			});

	}

	// pass data to legend and load taluka map 
	getDBTLayerClassValuesTaluka(activityId, districtCode, applicationFor) {


		var url = "", layerName = "";
		if (activityId === "All") {
			layerName = "dbtTaluka";
		} else {
			layerName = "dbtAcivityGroupTaluka";
		}

		let initialActivity = [];
		var labelValue = "";
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtNumApplicationsTaluka_attrribute?activityId=' + activityId + '&districtCode=' + districtCode + '&summary_for=' + applicationFor+'&attrribute=Farmer')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				var labelValue = "";
				if (applicationFor === "no_of_application") {
					labelValue = "Applications";
				} else if (applicationFor === "no_of_paymentdone") {
					labelValue = "Disbursement";
				} else if (applicationFor === "no_of_registration") {
					labelValue = "Registrations";
				} else if (applicationFor === "no_of_presanction") {
					labelValue = "Presanctions";
				} else if (applicationFor === "no_of_work_completed") {
					labelValue = "Work Completed";
				} else if (applicationFor === "no_of_village") {
					labelValue = "PoCRA Villges";
				}
				initialActivity = data.activity.map((activities) => {
					// console.log(activities.appl_1)
					this.setState(prev => ({
						classValues: {
							appl_1: activities.appl_1,
							appl_2: activities.appl_2,
							appl_3: activities.appl_3,
							appl_4: activities.appl_4,
							legendLabel: labelValue,
							legendLabelPoint: false
						}
					}));
					return activities;

				});
				this.loadMapTaluka(initialActivity, layerName, activityId, "districtCode", districtCode, applicationFor)

			});

	}
	// pass data to legend and load village map 
	getDBTLayerClassValuesVillage(activityId, districtCode, talukaCode, applicationFor) {


		var url = "", layerName = "";
		if (activityId === "All") {
			layerName = "dbtVillage";
		} else {
			layerName = "dbtAcivityGroupVillage";
		}

		let initialActivity = [];
		var labelValue = "";
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtNumApplicationsVillage_attrribute?activityId=' + activityId + '&summary_for=' + applicationFor + '&districtCode=' + districtCode + '&talukaCode=' + talukaCode+'&attrribute=Farmer')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				var labelValue = "";
				if (applicationFor === "no_of_application") {
					labelValue = "Applications";
				} else if (applicationFor === "no_of_paymentdone") {
					labelValue = "Disbursement";
				} else if (applicationFor === "no_of_registration") {
					labelValue = "Registrations";
				} else if (applicationFor === "no_of_presanction") {
					labelValue = "Presanctions";
				} else if (applicationFor === "no_of_work_completed") {
					labelValue = "Work Completed";
				} else if (applicationFor === "no_of_village") {
					labelValue = "PoCRA Villges";
				}
				initialActivity = data.activity.map((activities) => {
					// console.log(activities.appl_1)
					this.setState(prev => ({
						classValues: {
							appl_1: activities.appl_1,
							appl_2: activities.appl_2,
							appl_3: activities.appl_3,
							appl_4: activities.appl_4,
							// appl_5: activities.appl_5,
							legendLabel: labelValue,
							legendLabelPoint: false
						}
					}));
					return activities;

				});
				this.loadMapVillage(initialActivity, layerName, activityId, districtCode, talukaCode, applicationFor)

			});

	}
	// pass data to legend and load single village map 
	getDBTLayerClassValuesVillageData(activityId, districtCode, talukaCode, villageCode, applicationFor) {


		var url = "", layerName = "";
		if (activityId === "All") {
			layerName = "dbtVillage";
		} else {
			layerName = "dbtAcivityGroupVillage";
		}

		let initialActivity = [];
		var labelValue = "";
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtNumApplicationsVillage_attrribute?activityId=' + activityId + '&summary_for=' + applicationFor + '&districtCode=' + districtCode + '&talukaCode=' + talukaCode+'&attrribute=Farmer')
			.then(response => {
				return response.json();
			}).then(data => {
				var labelValue = "";
				if (applicationFor === "no_of_application") {
					labelValue = "Applications";
				} else if (applicationFor === "no_of_paymentdone") {
					labelValue = "Disbursement";
				} else if (applicationFor === "no_of_registration") {
					labelValue = "Registrations";
				} else if (applicationFor === "no_of_presanction") {
					labelValue = "Presanctions";
				} else if (applicationFor === "no_of_work_completed") {
					labelValue = "Work Completed";
				} else if (applicationFor === "no_of_village") {
					labelValue = "PoCRA Villges";
				}
				initialActivity = data.activity.map((activities) => {
					// console.log(activities.appl_1)
					this.setState(prev => ({
						classValues: {
							appl_1: activities.appl_1,
							appl_2: activities.appl_2,
							appl_3: activities.appl_3,
							appl_4: activities.appl_4,
							// appl_5: activities.appl_5,
							legendLabel: labelValue,
							legendLabelPoint: false
						}
					}));
					return activities;

				});
				this.loadMapVillageData(initialActivity, layerName, activityId, districtCode, talukaCode, villageCode, applicationFor)
				// this.setState(prev => ({
				// 	classValues: initialActivity
				// }));
			});

	}

	// function to add map at district level
	loadMap = (initialActivity, layerName, activityId, applicationFor) => {


		let viewMap = map.getView();
		let extent = viewMap.calculateExtent(map.getSize());
		//hold the current resolution
		let res = viewMap.getResolution();
		viewMap.fit(extent, map.getSize());
		view.setResolution(res);
		if (pocraDBTLayer) {
			map.removeLayer(pocraDBTLayer);
		}
		if (imgSource) {
			map.removeLayer(imgSource);
		}
		if (talukaLayer) {
			map.removeLayer(talukaLayer);
		}
		if (geojson) {
			map.removeLayer(geojson);
		}
		if (talukaLayer) {
			map.removeLayer(talukaLayer);
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
			map.getView().fit(
				geojson.getSource().getExtent()
			);
		});
		map.addLayer(geojson);
		
		if (activityId === 'All') {
			

			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:dtnname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4))
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});

			map.addLayer(pocraDBTLayer);

		} else {
			


			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:dtnname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)),
					//  + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
					// 'CQL_FILTER': indate
					'viewparams': "groupID:" + activityId
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});

			map.addLayer(pocraDBTLayer);
		}
	}
	// function to add map at taluka level
	loadMapTaluka = (initialActivity, layerName, activityId, paramName, paramValue, applicationFor) => {

		if (geojson) {
			map.removeLayer(geojson);
		}

		var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&CQL_FILTER=dtncode+ILike+'" + paramValue + "'&outputFormat=application/json";
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
				geojson.getSource().getExtent()
			);
		});


		map.addLayer(geojson);


		if (imgSource) {
			map.removeLayer(imgSource);
		}
		if (talukaLayer) {
			map.removeLayer(talukaLayer);
		}
		let viewMap = map.getView();
		let extent = viewMap.calculateExtent(map.getSize());
		//hold the current resolution
		let res = viewMap.getResolution();
		viewMap.fit(extent, map.getSize());
		view.setResolution(res);
		if (pocraDBTLayer) {
			map.removeLayer(pocraDBTLayer);
		}


		if (activityId === 'All') {
			// console.log("propname:" + applicationFor + ";labelName:thnname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)))
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:thnname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)),
					'viewparams': "districtCode:" + paramValue
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer);
		} else {
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:thnname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)),
					'viewparams': "groupID:" + activityId + ";districtCode:" + paramValue
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});

			map.addLayer(pocraDBTLayer);

		}



	}
	// function to add map at village level
	loadMapVillage = (initialActivity, layerName, activityId, paramValue, talukaCode, applicationFor) => {
	

		if (geojson) {
			map.removeLayer(geojson);
		}

		var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&CQL_FILTER=thncode+ILike+'" + talukaCode + "'&outputFormat=application/json";
		geojson = new Vector({
			title: "Village",
			source: new VectorSource({
				url: url,
				format: new GeoJSON()
			}),
		});
		geojson.getSource().on('addfeature', function () {
			map.getView().fit(
				geojson.getSource().getExtent()
			);
		});


		map.addLayer(geojson);


		if (imgSource) {
			map.removeLayer(imgSource);
		}
		let viewMap = map.getView();
		let extent = viewMap.calculateExtent(map.getSize());
		//hold the current resolution
		let res = viewMap.getResolution();
		viewMap.fit(extent, map.getSize());
		view.setResolution(res);
		if (pocraDBTLayer) {
			map.removeLayer(pocraDBTLayer);
		}
		if (talukaLayer) {
			map.removeLayer(talukaLayer);
		}
		if (villageLayer) {
			map.removeLayer(villageLayer);
		}
		

		if (activityId === 'All') {
			villageLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: new ImageWMS({
					attributions: ['&copy; DBT PoCRA'],
					crossOrigin: 'Anonymous',
					serverType: 'geoserver',
					visible: true,
					url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
					params: {
						'LAYERS': 'PoCRA_Dashboard:Village',
						'TILED': true,
						'CQL_FILTER': "thncode='" + talukaCode + "'"
					},
				})
			});
			
			map.addLayer(villageLayer);

			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:vilname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)),
					// + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
					'viewparams': "districtCode:" + paramValue + ";talukaCode:" + talukaCode
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer);

			

		} else {
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:vilname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)),
					// + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
					// 'CQL_FILTER': indate
					'viewparams': "groupID:" + activityId + ";districtCode:" + paramValue + ";talukaCode:" + talukaCode
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});				
			map.addLayer(pocraDBTLayer);

			villageLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: new ImageWMS({
					attributions: ['&copy; DBT PoCRA'],
					crossOrigin: 'Anonymous',
					serverType: 'geoserver',
					visible: true,
					url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
					params: {
						'LAYERS': 'PoCRA_Dashboard:Village',
						'TILED': true,
						'CQL_FILTER': "thncode='" + talukaCode + "'"
					},
				})
			});
			
			map.addLayer(villageLayer);


		}
		talukaLayer = new ImageLayer({
			title: "DBT PoCRA",
			source: new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:Taluka',
					'TILED': true,
					'CQL_FILTER': "thncode='" + talukaCode + "'"
				},
			})
		});
		map.addLayer(talukaLayer);

		
	}

	// function to add map at single village level
	loadMapVillageData = (initialActivity, layerName, activityId, paramValue, talukaCode, villageCode, applicationFor) => {

		if (geojson) {
			map.removeLayer(geojson);
		}

		var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Village&CQL_FILTER=vincode+ILike+'" + villageCode + "'&outputFormat=application/json";
		geojson = new Vector({
			title: "Village",
			source: new VectorSource({
				url: url,
				format: new GeoJSON()
			}),
		});
		geojson.getSource().on('addfeature', function () {
			//alert(geojson.getSource().getExtent());
			map.getView().fit(
				geojson.getSource().getExtent()
			);
		});


		map.addLayer(geojson);


		if (imgSource) {
			map.removeLayer(imgSource);
		}
		let viewMap = map.getView();
		let extent = viewMap.calculateExtent(map.getSize());
		//hold the current resolution
		let res = viewMap.getResolution();
		viewMap.fit(extent, map.getSize());
		view.setResolution(res);
		if (pocraDBTLayer) {
			map.removeLayer(pocraDBTLayer);
		}
		if (talukaLayer) {
			map.removeLayer(talukaLayer);
		}



		if (activityId === 'All') {
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:vilname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)),
					//  + ";appl_5:" + (parseInt(initialActivity[0].appl_5)),
					'CQL_FILTER': "vincode='" + villageCode + "'",
					'viewparams': "districtCode:" + paramValue + ";talukaCode:" + talukaCode,

				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer);
		} else {
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:' + layerName,
					'TILED': true,
					'env': "propname:" + applicationFor + ";labelName:vilname;appl_1:" + (parseInt(initialActivity[0].appl_1)) + ";appl_2:" + (parseInt(initialActivity[0].appl_2)) + ";appl_3:" + (parseInt(initialActivity[0].appl_3)) + ";appl_4:" + (parseInt(initialActivity[0].appl_4)),
					'CQL_FILTER': "vincode='" + villageCode + "'",
					'viewparams': "groupID:" + activityId + ";districtCode:" + paramValue + ";talukaCode:" + talukaCode,

				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});

			map.addLayer(pocraDBTLayer);
		}

	}

	// function for farmer activity
	getFarmerActivity() {
		document.getElementById("infoTable").innerHTML = "";
		let initialActivity = [];
		var ele = document.getElementById("activity");;
		ele.innerHTML = "<option value='All'>All Activity</option>";
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtActivityMaster?activity=Farmer')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				initialActivity = data.activity.map((activities) => {

					ele.innerHTML = ele.innerHTML +
						'<option value="' + activities.ActivityGroupID + '">' + activities.ActivityGroupName + '</option>';
					return activities = {
						label: activities.ActivityGroupName,
						value: activities.ActivityGroupID,
						// TotalNoOfApplications: activities.TotalNoOfApplications,
						// TotalNoOfDisbursement: activities.TotalNoOfDisbursement,
						// TotalNoOfPreSanction: activities.TotalNoOfPreSanction
					}
				});
				this.setState({

					// activity: [
					// 	initialActivity,
					// ], 
					activity: [initialActivity]


				});

			});


	}

	// load pocra districts
	getDistrict() {
		document.getElementById("infoTable").innerHTML = "";
		document.getElementById("regestrationRadio").checked = true;
		let initialDistrict = [];
		var ele = document.getElementById("district");;
		ele.innerHTML = "<option value='All'>All District</option>";

		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/districts')
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				initialDistrict = data.district.map((district) => {
					ele.innerHTML = ele.innerHTML +
						'<option value="' + district.dtncode + '">' + district.dtename + '</option>';

				});
				this.setState({

					district: [initialDistrict]
				});

			});

	}

	// load pocra taluka
	getTaluka(event) {
		document.getElementById("infoTable").innerHTML = "";
		document.getElementById("villagediv").style.display = "block";
		var districtCode = event.target.value;
		var initialTaluka = [];
		var ele = document.getElementById("taluka");
		var ele1 = document.getElementById("village");
		if (districtCode === "All") {
			ele.innerHTML = "<option value='All'>All Taluka</option>";
			ele1.innerHTML = "<option value='All'>All Village</option>";
		} else {
			ele.innerHTML = "<option value='All'>All Taluka</option>";
			ele1.innerHTML = "<option value='All'>All Village</option>";
			fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dtaluka?dtncode=' + districtCode)
				.then(response => {
					return response.json();
				}).then(data => {
					initialTaluka = [];
					initialTaluka = data.taluka.map((taluka) => {
						ele.innerHTML = ele.innerHTML +
							'<option value="' + taluka.thncode + '">' + taluka.thename + '</option>';

					});

				});
		}

		this.updateHeaderLabel();




	}
	// load pocra village
	getVillage(event) {
		document.getElementById("infoTable").innerHTML = "";

		document.getElementById("villagediv").style.display = "none";
		document.getElementById("regestrationRadio").ckecked = true;
		var talukaCode = event.target.value;
		let initialVillage = [];
		var ele = document.getElementById("village");
		if (talukaCode === "All") {
			ele.innerHTML = "<option value='All'>All Village</option>";
		} else {
			ele.innerHTML = "<option value='All'>All Village</option>";
			fetch('http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=' + talukaCode)
				.then(response => {
					return response.json();
				}).then(data => {
					initialVillage = data.village.map((village) => {
						ele.innerHTML = ele.innerHTML +
							'<option value="' + village.vincode + '">' + village.vinename + '</option>';

					});
					this.setState({

						village: [initialVillage]

					});
				});
		}

		this.updateHeaderLabel();


	}
	// get application counts for registration ,applications,etc for graph
	getCategoryApplicationCount(activity, district, taluka, village, applicationFor) {
		document.getElementById("infoTable").innerHTML = "";
		var genderData = [], categoryData = [], farmerTypeData = [];
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtActivitybyID_dtnCode_thnCode_vinCode_attrribute?activityId=' + activity + '&districtCode=' + district + '&talukaCode=' + taluka + '&villageCode=' + village)
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				data.gender.map(gender => {

					if (applicationFor === "no_of_application") {
						genderData.push({
							name: gender.gender,
							y: parseInt(gender.no_of_application)
						})
					} else if (applicationFor === "no_of_paymentdone") {
						genderData.push({
							name: gender.gender,
							y: parseInt(gender.no_of_paymentdone)
						})
					} else if (applicationFor === "no_of_registration") {
						genderData.push({
							name: gender.gender,
							y: parseInt(gender.no_of_registration)
						})
					} else if (applicationFor === "no_of_presanction") {
						genderData.push({
							name: gender.gender,
							y: parseInt(gender.no_of_presanction)
						})
					} else if (applicationFor === "no_of_work_completed") {
						genderData.push({
							name: gender.gender,
							y: parseInt(gender.no_of_work_completed)
						})
					}

				})

				data.socialCategory.map(category => {

					if (applicationFor === "no_of_application") {
						categoryData.push({
							name: category.category,
							y: parseInt(category.no_of_application)
						})
					} else if (applicationFor === "no_of_paymentdone") {
						categoryData.push({
							name: category.category,
							y: parseInt(category.no_of_paymentdone)
						})
					} else if (applicationFor === "no_of_registration") {
						categoryData.push({
							name: category.category,
							y: parseInt(category.no_of_registration)
						})
					} else if (applicationFor === "no_of_presanction") {
						categoryData.push({
							name: category.category,
							y: parseInt(category.no_of_presanction)
						})
					} else if (applicationFor === "no_of_work_completed") {
						categoryData.push({
							name: category.category,
							y: parseInt(category.no_of_work_completed)
						})
					}
				})
				data.farmerType.map(farmer_type => {

					if (applicationFor === "no_of_application") {
						farmerTypeData.push({
							name: farmer_type.farmer_type,
							y: parseInt(farmer_type.no_of_application)
						})
					} else if (applicationFor === "no_of_paymentdone") {
						farmerTypeData.push({
							name: farmer_type.farmer_type,
							y: parseInt(farmer_type.no_of_paymentdone)
						})
					} else if (applicationFor === "no_of_registration") {
						farmerTypeData.push({
							name: farmer_type.farmer_type,
							y: parseInt(farmer_type.no_of_registration)
						})
					} else if (applicationFor === "no_of_presanction") {
						farmerTypeData.push({
							name: farmer_type.farmer_type,
							y: parseInt(farmer_type.no_of_presanction)
						})
					} else if (applicationFor === "no_of_work_completed") {
						farmerTypeData.push({
							name: farmer_type.farmer_type,
							y: parseInt(farmer_type.no_of_work_completed)
						})
					}
				})
				this.setState({
					gender: genderData,
					category: categoryData,
					farmerType: farmerTypeData
				});

			});
	}



	// logic to display data on radio and dropdown change
	updateHeaderLabel() {
		var activity = document.getElementById("activity");
		var district = document.getElementById("district");
		var taluka = document.getElementById("taluka");
		var village = document.getElementById("village");
		// console.log(activity.options[activity.selectedIndex].text)
		var applicationFor = ""; var labelValue = "";
		var villageRadio = document.getElementById("villageRadio").checked;
		var regestrationRadio = document.getElementById("regestrationRadio").checked;
		var applicationRadio = document.getElementById("applicationRadio").checked;
		var presanctionRadio = document.getElementById("presanctionRadio").checked;
		var workCompletedRadio = document.getElementById("workCompletedRadio").checked;
		var paymentDoneRadio = document.getElementById("paymentDoneRadio").checked;
		var locationRadio = document.getElementById("locationRadio").checked;

		if (villageRadio === true && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false) {
			document.getElementById("villageRadio").checked = true;
			document.getElementById("regestrationRadio").checked = false;
			document.getElementById("applicationRadio").checked = false;
			document.getElementById("presanctionRadio").checked = false;
			document.getElementById("workCompletedRadio").checked = false;
			document.getElementById("paymentDoneRadio").checked = false;
			document.getElementById("locationRadio").checked = false;
			if (overlay) {
				map.removeOverlay(overlay);
			}
			applicationFor = "no_of_village";

		}

		else if (villageRadio === false && regestrationRadio === true && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false) {
			document.getElementById("villageRadio").checked = false;
			document.getElementById("regestrationRadio").checked = true;
			document.getElementById("applicationRadio").checked = false;
			document.getElementById("presanctionRadio").checked = false;
			document.getElementById("workCompletedRadio").checked = false;
			document.getElementById("paymentDoneRadio").checked = false;
			document.getElementById("locationRadio").checked = false;
			if (overlay) {
				map.removeOverlay(overlay);
			}
			applicationFor = "no_of_registration";

		}

		else if (villageRadio === false && regestrationRadio === false && applicationRadio == true && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false) {
			document.getElementById("villageRadio").checked = false;
			document.getElementById("regestrationRadio").checked = false;
			document.getElementById("applicationRadio").checked = true;
			document.getElementById("presanctionRadio").checked = false;
			document.getElementById("workCompletedRadio").checked = false;
			document.getElementById("paymentDoneRadio").checked = false;
			document.getElementById("locationRadio").checked = false;
			if (overlay) {
				map.removeOverlay(overlay);
			}
			applicationFor = "no_of_application";

		} else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === true && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false) {
			document.getElementById("villageRadio").checked = false;
			document.getElementById("regestrationRadio").checked = false;
			document.getElementById("applicationRadio").checked = false;
			document.getElementById("presanctionRadio").checked = true;
			document.getElementById("workCompletedRadio").checked = false;
			document.getElementById("paymentDoneRadio").checked = false;
			document.getElementById("locationRadio").checked = false;
			if (overlay) {
				map.removeOverlay(overlay);
			}
			applicationFor = "no_of_presanction";

		} else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === true && paymentDoneRadio === false && locationRadio === false) {
			document.getElementById("villageRadio").checked = false;
			document.getElementById("regestrationRadio").checked = false;
			document.getElementById("applicationRadio").checked = false;
			document.getElementById("presanctionRadio").checked = false;
			document.getElementById("workCompletedRadio").checked = true;
			document.getElementById("paymentDoneRadio").checked = false;
			document.getElementById("locationRadio").checked = false;
			if (overlay) {
				map.removeOverlay(overlay);
			}
			applicationFor = "no_of_work_completed";

		} else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === true && locationRadio === false) {
			document.getElementById("villageRadio").checked = false;
			document.getElementById("regestrationRadio").checked = false;
			document.getElementById("applicationRadio").checked = false;
			document.getElementById("presanctionRadio").checked = false;
			document.getElementById("workCompletedRadio").checked = false;
			document.getElementById("paymentDoneRadio").checked = true;
			document.getElementById("locationRadio").checked = false;
			if (overlay) {
				map.removeOverlay(overlay);
			}
			applicationFor = "no_of_paymentdone";

		} else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === true) {
			document.getElementById("villageRadio").checked = false;
			document.getElementById("regestrationRadio").checked = false;
			document.getElementById("applicationRadio").checked = false;
			document.getElementById("presanctionRadio").checked = false;
			document.getElementById("workCompletedRadio").checked = false;
			document.getElementById("paymentDoneRadio").checked = false;
			document.getElementById("locationRadio").checked = true;
			labelValue = "Locations";
			if (overlay) {
				map.removeOverlay(overlay);
			}
			if (pocraDBTLayer) {
				map.removeLayer(pocraDBTLayer)
				map.removeLayer(featurelayer)
				map.removeLayer(geojson)

			}this.setState(prev => ({
				classValues: {
					appl_1: 0,
					appl_2: 0,
					appl_3: 0,
					appl_4: 0,
					legendLabel: labelValue,
					legendLabelPoint: true,
				}
			}));


			var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Village&CQL_FILTER=vincode+ILike+'" + village.value + "'&outputFormat=application/json";
			geojson = new Vector({
				title: "Village",
				source: new VectorSource({
					url: url,
					format: new GeoJSON()
				}),
			});
			geojson.getSource().on('addfeature', function () {
				//alert(geojson.getSource().getExtent());
				map.getView().fit(
					geojson.getSource().getExtent()
				);
			});


			map.addLayer(geojson);
			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:dbt_point_attribute',
					'TILED': true,
					'viewparams': "vinCode:" + village.value +";attribute:Farmer"
				},
			})
			// console.log('viewparams'+"vinCode:" + village.value);
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer)
		}
		if (applicationFor === "no_of_village") {
			labelValue = "PoCRA Villages";
		} else if (applicationFor === "no_of_registration") {
			labelValue = "Registrations";
		} else if (applicationFor === "no_of_application") {
			labelValue = "Applications";
		} else if (applicationFor === "no_of_presanction") {
			labelValue = "Presanctions";
		} else if (applicationFor === "no_of_work_completed") {
			labelValue = "Work completed";
		} else if (applicationFor === "no_of_paymentdone") {
			labelValue = "Disbursement";
		}

		// to display graph label
		if (activity.value === "All" && district.value === "All" && taluka.value === 'All' && village.value == 'All') {
			document.getElementById("locRadio").style.display = "none";
			document.getElementById("villagediv").style.display = "block";
			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text
				// + " | Taluka:" + taluka.options[taluka.selectedIndex].text + " | Village: " + village.options[village.selectedIndex].text
				// + "( " + this.state.+ " )"
				// + " District : " + district + " Taluka : " + taluka + " Village :" + village
			})
			this.getDBTVectorLayerDistrict(activity.value, applicationFor);
			this.getDBTLayerClassValues(activity.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, "All", "All", applicationFor);
		} else if (activity.value !== "All" && district.value === "All" && taluka.value === 'All' && village.value == 'All') {
			document.getElementById("locRadio").style.display = "none";
			document.getElementById("villagediv").style.display = "block";
			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text

			})
			this.getDBTVectorLayerDistrict(activity.value, applicationFor);
			this.getDBTLayerClassValues(activity.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, "All", "All", applicationFor);
		} else if (activity.value === "All" && district.value !== "All" && taluka.value === 'All' && village.value == 'All') {
			document.getElementById("locRadio").style.display = "none";
			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text
			})
			this.getDBTVectorLayerTaluka(activity.value, district.value, applicationFor);
			this.getDBTLayerClassValuesTaluka(activity.value, district.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, "All", "All", applicationFor);
		} else if (activity.value !== "All" && district.value !== "All" && taluka.value === 'All' && village.value === 'All') {
			document.getElementById("locRadio").style.display = "none";

			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text

			})
			this.getDBTVectorLayerTaluka(activity.value, district.value, applicationFor);
			this.getDBTLayerClassValuesTaluka(activity.value, district.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, "All", "All", applicationFor);
		} else if (activity.value === "All" && district.value !== "All" && taluka.value !== 'All' && village.value === 'All') {
			document.getElementById("locRadio").style.display = "none";
			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text
					+ " | Taluka:" + taluka.options[taluka.selectedIndex].text
			})
			this.getDBTVectorLayerVillage(activity.value, district.value, taluka.value, applicationFor);
			this.getDBTLayerClassValuesVillage(activity.value, district.value, taluka.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, taluka.value, "All", applicationFor);
		} else if (activity.value !== "All" && district.value !== "All" && taluka.value !== 'All' && village.value === 'All') {
			document.getElementById("locRadio").style.display = "none";
			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text
					+ " | Taluka:" + taluka.options[taluka.selectedIndex].text
			})
			this.getDBTVectorLayerVillage(activity.value, district.value, taluka.value, applicationFor);
			this.getDBTLayerClassValuesVillage(activity.value, district.value, taluka.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, taluka.value, "All", applicationFor);
		} else if (activity.value == "All" && district.value !== "All" && taluka.value !== 'All' && village.value !== 'All') {
			document.getElementById("locRadio").style.display = "block";
			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text
					+ " | Taluka:" + taluka.options[taluka.selectedIndex].text
					+ " | Village: " + village.options[village.selectedIndex].text
			})
			this.getDBTVectorLayerVillageData(activity.value, district.value, taluka.value, village.value, applicationFor);
			this.getDBTLayerClassValuesVillageData(activity.value, district.value, taluka.value, village.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, taluka.value, village.value, applicationFor);
		} else if (activity.value !== "All" && district.value !== "All" && taluka.value !== 'All' && village.value !== 'All') {
			document.getElementById("locRadio").style.display = "block";
			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text
					+ " | Taluka:" + taluka.options[taluka.selectedIndex].text
					+ " | Village: " + village.options[village.selectedIndex].text
			})
			this.getDBTVectorLayerVillageData(activity.value, district.value, taluka.value, village.value, applicationFor);
			this.getDBTLayerClassValuesVillageData(activity.value, district.value, taluka.value, village.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, taluka.value, village.value, applicationFor);
		}

	}


	render() {
		return (
			<div>
				<div className="content-wrapper">
					{/* Content Header (Page header) */}
					<section className="content-header">
						<section className="content">
							<div className="container-fluid">
								{/* SELECT2 EXAMPLE */}
								<div className="card card-default" style={{ marginTop: "0.5%" }}>
									<div className="card-header ">
										<h3 className="card-title"><b>Farmer Activity</b></h3>
										<div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
											{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button> */}
										</div>
									</div>
									{/* /.card-header */}
									<div className="card-body">
										<div className="row" style={{ marginBottom: "-16px" }}>
											<div className="col-md-12">
												<div className="form-group form-inline">
													<div className="col-md-3">
														<select className="form-control  select2" style={{ width: "100%", fontSize: "14px", wordWrap: "normal" }} onChange={this.updateHeaderLabel} id="activity" >
															<option value="All" >All Activity</option>
														</select>
													</div>
													<div className="col-md-3">
														<select className="form-control  select2" style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} id="district" onChange={this.getTaluka} >
															<option value="All" >District</option>
														</select>
													</div>
													<div className="col-md-3">
														<select className=" form-control select2" style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} onChange={this.getVillage} id="taluka">
															<option value="All" >All Taluka</option>
														</select>
													</div>
													<div className="col-md-3">
														<select className="margin2 form-control select2" style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} id="village" onChange={this.updateHeaderLabel} >
															<option value="All" >All Village</option>
														</select>
													</div>
												</div>
											</div>
										</div>
									</div>

								</div>
							</div>
						</section>
					</section>
					<section className="content-header" style={{ marginTop: "-50px" }}>
						<section className="content">
							<div className="container-fluid">
								{/* SELECT2 EXAMPLE */}
								<div className="card card-default" style={{ marginTop: "0.5%" }}>
									<div className="card-header">
										<h3 className="card-title"><b>{this.state.graphLabel}</b></h3>
										<div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
											{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button> */}
										</div>
									</div>
									{/* /.card-header */}
									<div className="card-body">
										<div className="row">
											<section className="content col-3" style={{ position: "absolute", zIndex: "9", top: "8%", left: "1%" }}>
												<div className="container-fluid">
													{/* SELECT2 EXAMPLE */}
													<div className="card card-default" style={{ marginTop: "0.5%" }}>
														<div className="card-header" >
															<h3 className="card-title"><b>Attributes</b></h3>
															<div className="card-tools">
																<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
																{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button> */}
															</div>
														</div>
														{/* /.card-header */}
														<div className="card-body">
															<div className="row">
																<div className="col-12">
																	<div className="form-group form-inline">
																		<div className="col-6">
																			<div class="form-group">
																				<div class="custom-control custom-radio" id="villagediv">
																					<input class="custom-control-input" type="radio" id="villageRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																					<label for="villageRadio" class="custom-control-label" >PoCRA Villages</label>
																				</div>
																				<div class="custom-control custom-radio">
																					<input class="custom-control-input" type="radio" id="regestrationRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																					<label for="regestrationRadio" class="custom-control-label" >Registrations</label>
																				</div>
																				<div class="custom-control custom-radio">
																					<input class="custom-control-input" type="radio" id="applicationRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																					<label for="applicationRadio" class="custom-control-label" >Applications</label>
																				</div>
																				<div class="custom-control custom-radio">
																					<input class="custom-control-input" type="radio" id="presanctionRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																					<label for="presanctionRadio" class="custom-control-label" >PreSanction</label>
																				</div>
																				<div class="custom-control custom-radio">
																					<input class="custom-control-input" type="radio" id="workCompletedRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																					<label for="workCompletedRadio" class="custom-control-label" >Work Completed</label>
																				</div>
																				<div class="custom-control custom-radio">
																					<input class="custom-control-input" type="radio" id="paymentDoneRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																					<label for="paymentDoneRadio" class="custom-control-label" > Disbursement</label>
																				</div>
																				<div class="custom-control custom-radio" id='locRadio' style={{ display: 'none' }}>
																					<input class="custom-control-input" type="radio" id="locationRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																					<label for="locationRadio" class="custom-control-label" > Locations</label>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>

													</div>
												</div>
											</section>
											<div className="col-12" id="map" style={{ height: "70vh", width: "100%" }}>
											</div>
											<div id="popup" className="ol-popup">
												<a href="#" id="popup-closer" className="ol-popup-closer" />
												<div id="popup-content" />
											</div>
											<div id={"legend"} className="box stack-top">
												<LegendPanelDashboard props={this.state.classValues} />
											</div>
											{/* <div id={"legend"} className="box stack-top">
													<LengendPanelPoints props={this.state.pointLegend} />
											</div> */}
											<section className="content col-sm-5" style={{ position: "absolute", zIndex: "9", top: "20%", right: "0%" }} id="infoTable">
											</section>
										</div>
									</div>
								</div>
							</div>
						</section>
					</section>
					<section className="content-header" style={{ marginTop: "-50px" }}>
						<section className="content">
							<div className="container-fluid">
								{/* SELECT2 EXAMPLE */}
								<div className="card card-default" style={{ marginTop: "0.5%" }}>
									<div className="card-header">
										<h3 className="card-title"><b>{this.state.graphLabel}</b></h3>
										<div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
											{/* <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" /></button> */}
										</div>
									</div>
									<div className="card-body">
										<div className="row">
											<DBTPieChart pieChartProps={{
												activityLabel: "Gender",
												activity: this.state.graphCountLabel,
												data: this.state.gender
											}} />
											<DBTPieChart pieChartProps={{
												activityLabel: "Social Category",
												activity: this.state.graphCountLabel,
												data: this.state.category
											}} />
											<DBTPieChart pieChartProps={{
												activityLabel: "Farmer Type",
												activity: this.state.graphCountLabel,
												data: this.state.farmerType
											}} />

										</div>
									</div>
								</div>
							</div>{/* /.container-fluid */}
						</section>
					</section>

				</div>

			</div>
		)
	}
}
