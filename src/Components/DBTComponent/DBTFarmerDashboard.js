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

import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS'
import ImageWMS from 'ol/source/ImageWMS'
import ReactDOM from 'react-dom';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
// import "./DBTDashboard.css"
import "./DBTFarmerDashboard.css"
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

// import { ImageViewer } from "react-image-viewer-dv"
// ReactJS UI Ant Design Popover Component
import "antd/dist/antd.css";
import { Popover, Button } from 'antd';


// Variable Declaration

var view = "", map;
let pocraDBTLayer;
let pocraDBTLayer_point;
var featurelayer; var a = new Array();
var thing;
var geojson, talukaLayer, villageLayer;
var vectorSource = new VectorSource({});
var imgSource = new ImageWMS({});
let infoTable;
var overlay
let statusCode = "";
let pocraDBTLayer_point_status = "";

// const {  Popover, Button  } = antd;

const text = <span>Title</span>;
const content = (
	<div >
		<p>Content</p>
		<p>Content</p>
	</div>
);

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
		// add open layer osm map

		// var styleJson = 'https://api.maptiler.com/maps/streets/style.json?key=RISKUYE6IR1xbkqEyIht';
		// var map = new ol.Map({
		// 	target: 'map',
		// 	view: new ol.View({
		// 		constrainResolution: true,
		// 		center: ol.proj.fromLonLat([0, 0]),
		// 		zoom: 2
		// 	})
		// });
		// olms.apply(map, styleJson);


		var topo = new TileLayer({
			title: 'Topo Map',
			type: 'base',
			visible: true,
			source: new XYZ({
				attributions: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
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

	// display data in table on map click
	componentDidMount() {
		map.setTarget("map");
		this.getDistrict(); // load district in dropdown
		this.getFarmerActivity(); // load farmer activity in dropdown
		this.updateHeaderLabel();

		overlay = new Overlay({
			element: ReactDOM.findDOMNode(this).querySelector('#popup'),
			autoPan: {
				animation: {
					duration: 5,
				},
			},
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

			// Selection dropdown of Stages and Locations

			
			// 	value="">--Please choose Application Stagewise Locations--
			// 	value="stage-location-all" --- All Locations
			// 	value="stage-location-pre-san-pend" --- Pre-Sanction Pending
			// 	value="stage-location-pre-san-rcv" --- Pre-Sanction Received
			// 	value="stage-location-work-comp" --- Work Completed
			// 	value="stage-location-payment-disb" --- Payment Disbursed
			

			var selectMenuStage = $("#select-menu-stage").val();
			var selectMenuStageLocation = $("#select-menu-stage-location").val();

			// Location buttons
			// var allLocationRadio = document.getElementById("locationRadio").checked;
			// var preSanPendLocRadio = document.getElementById("pendingRadio").checked;
			// var preSanRecLocRadio = document.getElementById("RecvRadio").checked;
			// var workDoneLocRadio = document.getElementById("workRadio").checked;
			// var disbLocRadio = document.getElementById("disbursRadio").checked;

			var infoTabled = document.getElementById("infoTable");
			var jsondataFeatureProp = '';

			$(document).ready(function () {
				setTimeout(function () {
					$('#example').DataTable();
				}, 1000);
			});

			if (activity === "All" && district !== "All" && taluka === "All" && village === "All" && selectMenuStageLocation !== "stage-location-all") {
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

								fetch('http://gis.mahapocra.gov.in/weatherservices/meta/pointInfo_ActivitybyID_dtnCode_thnCode_vinCode_attribute?activityId=' + activity + '&districtCode=' + district + '&talukaCode=' + jsondata.features[0].properties.thncode + '&villageCode=All' + '&attribute=Farmer')
									.then(response => {
										return response.json();
									}).then(data => {
										var tableData = "";
										data.tableInfo.map((activities) => {
											tableData = tableData + "<tr><td>" + activities.activity_group + "</td><td>" + activities.no_of_application + "</td><td>" + activities.no_of_presanction + "</td><td>" + activities.no_of_paymentdone + "</td></tr>"
										})

										infoTabled.innerHTML = '<div class="container-fluid" ><div class="row" ><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><b>District: ' + dtnname + '|Taluka: ' + thnname + '</b></h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" ></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" ><i class="fas fa-times" /></button></div></div><div class="card-body" ><table id="example" class="table table-bordered table-striped"><thead ><tr><th>Activity </th><th>Applications </th><th>Presanctions </th><th>Disbursement </th></tr></thead><tbody>' + tableData + '</tbody></table></div></div></div></div></div>';

									});
							}
							catch (err) {
								infoTabled.style.display = "none";
								infoTabled.innerHTML = '';
							}
						});
				}

			} else if (activity !== "All" && district !== "All" && taluka === "All" && village === "All" && selectMenuStageLocation !== "stage-location-all") {

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
								fetch('http://gis.mahapocra.gov.in/weatherservices/meta/pointInfo_ActivitybyID_dtnCode_thnCode_vinCode_attribute?activityId=' + activity + '&districtCode=' + district + '&talukaCode=' + jsondata.features[0].properties.thncode + '&villageCode=All' + '&attribute=Farmer')
									.then(response => {
										return response.json();
									}).then(data => {
										var tableData = "";
										data.tableInfo.map((activities) => {
											tableData = tableData + "<tr><td>" + activities.activity_group + "</td><td>" + activities.no_of_application + "</td><td>" + activities.no_of_presanction + "</td><td>" + activities.no_of_paymentdone + "</td></tr>"
										})
										infoTabled.innerHTML = '<div class="container-fluid" ><div class="row" ><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><b>District: ' + dtnname + '|Taluka: ' + thnname + '</b></h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" ></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" ><i class="fas fa-times" /></button></div></div><div class="card-body" ><table id="example" class="table table-bordered table-striped"><thead ><tr><th>Activity </th><th>Applications </th><th>Presanctions </th><th>Disbursement </th></tr></thead><tbody>' + tableData + '</tbody></table></div></div></div></div></div>';
									});
							}
							catch (err) {
								infoTabled.innerHTML = '';

							}
						});
				}
			} else if (activity == "All" && district !== "All" && taluka !== "All" && village === "All" && selectMenuStageLocation !== "stage-location-all") {

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
								fetch('http://gis.mahapocra.gov.in/weatherservices/meta/pointInfo_ActivitybyID_dtnCode_thnCode_vinCode_attribute?activityId=' + activity + '&districtCode=' + jsondata.features[0].properties.dtncode + '&talukaCode=' + jsondata.features[0].properties.thncode + '&villageCode=' + jsondata.features[0].properties.vincode + '&attribute=Farmer')
									.then(response => {
										return response.json();
									}).then(data => {
										var tableData = "";
										data.tableInfo.map((activities) => {
											tableData = tableData + "<tr><td>" + activities.activity_group + "</td><td>" + activities.no_of_application + "</td><td>" + activities.no_of_presanction + "</td><td>" + activities.no_of_paymentdone + "</td></tr>"
										})
										infoTabled.innerHTML = '<div class="container-fluid" ><div class="row" ><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><b>District: ' + dtnname + '|Taluka: ' + thnname + '|Village: ' + vilname + '</b></h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" ></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" ><i class="fas fa-times" /></button></div></div><div class="card-body" ><table id="example" class="table table-bordered table-striped"><thead><tr><th>Activity </th><th>Applications </th><th>Presanctions </th><th>Disbursement </th></tr></thead><tbody>' + tableData + '</tbody></table></div></div></div></div></div>';
									});
							}
							catch (err) {
								infoTabled.innerHTML = '';

							}
						});
				}
			} else if (activity !== "All" && district !== "All" && taluka !== "All" && village === "All" && selectMenuStageLocation !== "stage-location-all") {
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
								fetch('http://gis.mahapocra.gov.in/weatherservices/meta/pointInfo_ActivitybyID_dtnCode_thnCode_vinCode_attribute?activityId=' + activity + '&districtCode=' + jsondata.features[0].properties.dtncode + '&talukaCode=' + jsondata.features[0].properties.thncode + '&villageCode=' + jsondata.features[0].properties.vincode + '&attribute=Farmer')
									.then(response => {
										return response.json();
									}).then(data => {
										var tableData = "";
										data.tableInfo.map((activities) => {
											tableData = tableData + "<tr><td>" + activities.activity_group + "</td><td>" + activities.no_of_application + "</td><td>" + activities.no_of_presanction + "</td><td>" + activities.no_of_paymentdone + "</td></tr>"
										})
										infoTabled.innerHTML = '<div class="container-fluid" ><div class="row" ><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><b>District: ' + dtnname + '|Taluka: ' + thnname + '|Village: ' + vilname + '</b></h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" ></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" ><i class="fas fa-times" /></button></div></div><div class="card-body" ><table id="example" class="table table-bordered table-striped"><thead ><tr><th>Activity </th><th>Applications </th><th>Presanctions </th><th>Disbursement </th></tr></thead><tbody>' + tableData + '</tbody></table></div></div></div></div></div>';
									});
							}
							catch (err) {
								infoTabled.innerHTML = '';

							}
						});
				}
			} else if (activity === "All" && district !== "All" && taluka !== "All" && village !== "All" && selectMenuStageLocation === "stage-location-all" || selectMenuStageLocation === "stage-location-pre-san-pend" || selectMenuStageLocation === "stage-location-pre-san-rcv" || selectMenuStageLocation === "stage-location-work-comp" || selectMenuStageLocation === "stage-location-payment-disb") {

				if (selectMenuStageLocation === "stage-location-all") {
					var url = pocraDBTLayer.getSource().getFeatureInfoUrl(
						evt.coordinate,
						viewResolution,
						'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
					);

				}
				else {
					var url = pocraDBTLayer_point_status.getSource().getFeatureInfoUrl(
						evt.coordinate,
						viewResolution,
						'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
					);
				}

				// if (!url_point){
				// 	console.log("on click false")
				// 	console.log(jsondataFeatureProp)
				// }

				if (url) {
					fetch(url)
						.then((response) => {
							// var rp = response.text()
							// console.log(rp);
							return response.text();
						})
						.then((html) => {
							try {
								var jsondata = JSON.parse(html);
								var dtnname = jsondata.features[0].properties.dtnname;
								var thnname = jsondata.features[0].properties.thnname;
								var vilname = jsondata.features[0].properties.vilname;
								// console.log(jsondata.features[0].properties.dtncode)
								fetch('http://gis.mahapocra.gov.in/weatherservices/meta/pointInfo_ActivitybyID_dtnCode_thnCode_vinCode_attribute?activityId=' + activity + '&districtCode=' + jsondata.features[0].properties.dtncode + '&talukaCode=' + jsondata.features[0].properties.thncode + '&villageCode=' + jsondata.features[0].properties.vincode + '&attribute=Farmer')
									.then(response => {
										return response.json();
									}).then(data => {
										var tableData = "";
										// console.log(data);
										data.tableInfo.map((activities) => {
											tableData = tableData + "<tr><td>" + activities.activity_group + "</td><td>" + activities.no_of_application + "</td><td>" + activities.no_of_presanction + "</td><td>" + activities.no_of_paymentdone + "</td></tr>"
										})

										infoTabled.innerHTML = '<div class="container-fluid" ><div class="row" ><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><b>District: ' + dtnname + '|Taluka: ' + thnname + '|Village: ' + vilname + '</b></h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" ></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" ><i class="fas fa-times" /></button></div></div><div class="card-body" ><table id="example" class="table table-bordered table-striped"><thead ><tr><th>Activity </th><th>Applications </th><th>Presanctions </th><th>Disbursement </th></tr></thead><tbody>' + tableData + '</tbody></table></div></div></div></div></div>';
									});
							}
							catch (err) {
								infoTabled.innerHTML = '';

							}
						});
				}
				map.addOverlay(overlay);
				overlay.setPosition(undefined)
				const coordinate = evt.coordinate;

				var viewResolution = (view.getResolution());

				if (selectMenuStageLocation === "stage-location-all") {
					var url_point = pocraDBTLayer_point.getSource().getFeatureInfoUrl(
						evt.coordinate,
						viewResolution,
						'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
					);
				}
				else {
					var url_point = pocraDBTLayer_point_status.getSource().getFeatureInfoUrl(
						evt.coordinate,
						viewResolution,
						'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
					);
				}

				if (url_point) {
					fetch(url_point)
						.then((response) => {
							// console.log(response.text());
							var rp = response.text()
							console.log(rp);
							return response.text();
						})
						.then((html) => {
							var jsondata = JSON.parse(html);
							// var jsondataFeatureProp = '';

							// console.log(jsondata.features[0].properties)
							if (jsondata.features[0]) {

								// assign 'jsondata.features[0].properties' to variable
								var jsondataFeatureProp = jsondata.features[0].properties;

								// assign point attributes to variables
								var village_name = jsondataFeatureProp.village_name;
								var activity_name = jsondataFeatureProp.activity_name;
								var full_name = jsondataFeatureProp.full_name;
								var use_712_no = jsondataFeatureProp.use_712_no;
								var img_url = jsondataFeatureProp.img_url;

								if (jsondataFeatureProp) {
									var popupContent = overlay.element.querySelector('#popup-content');
									popupContent.innerHTML = '';

									popupContent.innerHTML =
										'<div class="table-bordered table-responsive"><table class="table table-bordered  table-striped" style="border: 1px solid #ddd !important;"><tr ><td style="background-color:skyblue;text-align:center;font-weight:bold;" colspan=2>DBT Attribute Information</td></tr><tr><td>Village</td><td>' + village_name + '</td></tr><tr><td >Activity</td><td>' + activity_name + '</td></tr><tr><td>Farmer</td><td>' + (full_name) + '</td></tr><tr><td>7/12 No.</td><td class="text">' + (use_712_no) + '</td></tr><tr><td colspan=2><a data-toggle="modal" data-target="#myModal" href="' + (img_url) + '" data-featherlight="' + img_url + '"><img src="' + (img_url) + '" class="img-fluid" alt="Activity Image"></a></td></tr> </table></div>';

									$('#model_img').attr('src', img_url);

									overlay.setPosition(coordinate);
								}
							}
							else {
								overlay.setPosition(undefined)
							}
						});
				}
			} else if (activity !== "All" && district !== "All" && taluka !== "All" && village !== "All" && selectMenuStageLocation === "stage-location-all" || selectMenuStageLocation === "stage-location-pre-san-pend" || selectMenuStageLocation === "stage-location-pre-san-rcv" || selectMenuStageLocation === "stage-location-work-comp" || selectMenuStageLocation === "stage-location-payment-disb") {

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
								fetch('http://gis.mahapocra.gov.in/weatherservices/meta/pointInfo_ActivitybyID_dtnCode_thnCode_vinCode_attribute?activityId=' + activity + '&districtCode=' + jsondata.features[0].properties.dtncode + '&talukaCode=' + jsondata.features[0].properties.thncode + '&villageCode=' + jsondata.features[0].properties.vincode + '&attribute=Farmer')
									.then(response => {
										return response.json();
									}).then(data => {
										var tableData = "";
										// console.log(data);
										data.tableInfo.map((activities) => {
											tableData = tableData + "<tr><td>" + activities.activity_group + "</td><td>" + activities.no_of_application + "</td><td>" + activities.no_of_presanction + "</td><td>" + activities.no_of_paymentdone + "</td></tr>"
										})
										infoTabled.innerHTML = '<div class="container-fluid" ><div class="row" ><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title"><b>District: ' + dtnname + '|Taluka: ' + thnname + '|Village: ' + vilname + '</b></h3><div class="card-tools"><button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" ></i></button><button type="button" class="btn btn-tool" data-card-widget="remove" ><i class="fas fa-times" /></button></div></div><div class="card-body" ><table id="example" class="table table-bordered table-striped"><thead ><tr><th>Activity </th><th>Applications </th><th>Presanctions </th><th>Disbursement </th></tr></thead><tbody>' + tableData + '</tbody></table></div></div></div></div></div>';
									});
							}
							catch (err) {
								infoTabled.innerHTML = '';

							}
						});
				}
				map.addOverlay(overlay);
				overlay.setPosition(undefined)
				const coordinate = evt.coordinate;

				var viewResolution = (view.getResolution());
				var url_point = pocraDBTLayer_point.getSource().getFeatureInfoUrl(
					evt.coordinate,
					viewResolution,
					'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
				);

				if (url_point) {
					fetch(url_point)
						.then((response) => {
							return response.text();
						})
						.then((html) => {
							var jsondata = JSON.parse(html);
							var jsondataFeatureProp = jsondata.features[0].properties;

							var img_url = jsondataFeatureProp.img_url;

							if (jsondata.features[0]) {

								// assign 'jsondata.features[0].properties' to variable
								var jsondataFeatureProp = jsondata.features[0].properties;

								// assign point attributes to variables
								var village_name = jsondataFeatureProp.village_name;
								var activity_name = jsondataFeatureProp.activity_name;
								var full_name = jsondataFeatureProp.full_name;
								var use_712_no = jsondataFeatureProp.use_712_no;
								var img_url = jsondataFeatureProp.img_url;

								if (jsondataFeatureProp) {
									var popupContent = overlay.element.querySelector('#popup-content');
									popupContent.innerHTML = '';

									popupContent.innerHTML =
										'<div class="table-bordered table-responsive"><table class="table table-bordered  table-striped" style="border: 1px solid #ddd !important;"><tr ><td style="background-color:skyblue;text-align:center;font-weight:bold;" colspan=2>DBT Attribute Information</td></tr><tr><td>Village</td><td>' + village_name + '</td></tr><tr><td >Activity</td><td>' + activity_name + '</td></tr><tr><td>Farmer</td><td>' + (full_name) + '</td></tr><tr><td>7/12 No.</td><td class="text">' + (use_712_no) + '</td></tr><tr><td colspan=2><a data-toggle="modal" data-target="#myModal" href="' + (img_url) + '" data-featherlight="' + img_url + '"><img src="' + (img_url) + '" class="img-fluid" alt="Activity Image"></a></td></tr> </table></div>';

									$('#model_img').attr('src', img_url);
									// <div class="lightbox-target lightbox-display">

									// 	<img id="lightbox-image" src="https://media.geeksforgeeks.org/wp-content/uploads/20190410184416/button-1a.png" alt="Lightbox" class="lightbox-display-image">

									// 	<span class="lightbox-close lightbox-display-close"></span>
									// </div>

									overlay.setPosition(coordinate);
								}
							} else {
								overlay.setPosition(undefined)
								// alert('Hi')
							}
						});
				}
			}
		})
	}

	// add district count on map
	getDBTVectorLayerDistrict(activityId, applicationFor) {
		if (vectorSource) {

		}
		var applications = 0;
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtDistrict_attribute?activityId=' + activityId + '&attribute=Farmer')
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

					}
					else if (applicationFor === "no_of_paymentdone") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_paymentdone,
							districtName: activities.district,
							// total: totalApp
						})
					}
					else if (applicationFor === "no_of_registration") {
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
					}
					else if (applicationFor === "no_of_village") {
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
								font: 'bold 14px sans-serif',

								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
								fill: new Fill({
									color: '#000000'
								}),
								stroke: new Stroke({
									color: '#ffffff',
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
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtTaluka_attribute?activityId=' + activityId + '&districtCode=' + districtCode + '&attribute=Farmer')
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
					}
					else if (applicationFor === "no_of_paymentdone") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_paymentdone,
							districtName: activities.district,
							// total: totalApp
						})
					}
					else if (applicationFor === "no_of_registration") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_registration,
							districtName: activities.district,
							// total: totalApp
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
					}
					else if (applicationFor === "no_of_village") {
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
								font: 'bold 14px sans-serif',

								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
								fill: new Fill({
									color: '#000000'
								}),
								stroke: new Stroke({
									color: '#FFFFFF',
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
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtVillage_attribute?activityId=' + activityId + '&districtCode=' + districtCode + '&talukaCode=' + talukaCode)
			.then(response => {
				return response.json();
			})
			.then(data => {
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
					} else if (applicationFor === "no_of_work_completed") {
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
								font: 'bold 14px sans-serif',

								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
								fill: new Fill({
									color: '#000000'
								}),
								stroke: new Stroke({
									color: '#FFFFFF',
									width: 0.5
								})
							}),
						});
					}
				})
				map.addLayer(featurelayer)
			});
	}

	// add single village count on map (Vector)
	getDBTVectorLayerVillageData(activityId, districtCode, talukaCode, villageCode, applicationFor) {

		if (vectorSource) {
		}
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtVillageIndividual_attribute?activityId=' + activityId + '&districtCode=' + districtCode + '&talukaCode=' + talukaCode + '&villageCode=' + villageCode + '&attribute=Farmer')
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
					}
					else if (applicationFor === "no_of_paymentdone") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_paymentdone,
							districtName: activities.district,
						})
					}
					else if (applicationFor === "no_of_registration") {
						this.setState({
							lat: activities.lat,
							lon: activities.lon,
							no_of_application: activities.no_of_registration,
							districtName: activities.district,
						})
					}
					else if (applicationFor === "no_of_registration") {
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
					}
					else if (applicationFor === "no_of_village") {
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
								font: 'bold 14px sans-serif',
								offsetY: 15,
								offsetX: 25,
								align: 'bottom',
								scale: 1,
								// textBaseline: 'bottom',
								fill: new Fill({
									color: '#000000'
								}),
								stroke: new Stroke({
									color: '#FFFFFF',
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
			layerName = "dbtDistrict_attribute";
		} else {
			layerName = "dbtAcivityGroup_attribute";
		}

		let initialActivity = [];

		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtNumApplications_attribute?activityId=' + activityId + '&summary_for=' + applicationFor + '&attribute=Farmer')
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
			layerName = "dbtTaluka_attribute";
		} else {
			layerName = "dbtAcivityGroupTaluka_attribute";
		}

		let initialActivity = [];
		var labelValue = "";
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtNumApplicationsTaluka_attribute?activityId=' + activityId + '&districtCode=' + districtCode + '&summary_for=' + applicationFor + '&attribute=Farmer')
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
			layerName = "dbtVillage_attribute";
		} else {
			layerName = "dbtAcivityGroupVillage_attribute";
		}

		let initialActivity = [];
		var labelValue = "";
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtNumApplicationsVillage_attribute?activityId=' + activityId + '&summary_for=' + applicationFor + '&districtCode=' + districtCode + '&talukaCode=' + talukaCode + '&attribute=Farmer')
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
			layerName = "dbtVillage_attribute";
		} else {
			layerName = "dbtAcivityGroupVillage_attribute";
		}

		let initialActivity = [];
		var labelValue = "";
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtNumApplicationsVillage_attribute?activityId=' + activityId + '&summary_for=' + applicationFor + '&districtCode=' + districtCode + '&talukaCode=' + talukaCode + '&attribute=Farmer')
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

		if (pocraDBTLayer_point) {
			map.removeLayer(pocraDBTLayer_point);
		}
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

		}
		else {

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
					'viewparams': "groupID:" + activityId + ";attribute:Farmer"
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
		if (villageLayer) {
			map.removeLayer(villageLayer);
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
		if (pocraDBTLayer_point) {
			map.removeLayer(pocraDBTLayer_point);
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
					'viewparams': "districtCode:" + paramValue + ";attribute:Farmer"
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
					'viewparams': "groupID:" + activityId + ";districtCode:" + paramValue + ";attribute:Farmer"
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
		if (imgSource) {
			map.removeLayer(imgSource);
		}
		if (pocraDBTLayer) {
			map.removeLayer(pocraDBTLayer);
		}
		if (talukaLayer) {
			map.removeLayer(talukaLayer);
		}
		if (villageLayer) {
			map.removeLayer(villageLayer);
		}
		if (pocraDBTLayer_point) {
			map.removeLayer(pocraDBTLayer_point);
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
		// 

		let viewMap = map.getView();
		let extent = viewMap.calculateExtent(map.getSize());
		//hold the current resolution
		let res = viewMap.getResolution();
		viewMap.fit(extent, map.getSize());
		view.setResolution(res);

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

			// Button event layer
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
					'viewparams': "districtCode:" + paramValue + ";talukaCode:" + talukaCode + ";attribute:Farmer",
				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer);
		}
		else {
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
					'viewparams': "groupID:" + activityId + ";districtCode:" + paramValue + ";talukaCode:" + talukaCode + ";attribute:Farmer",
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

	// function to add map at single village level (WMS Layer)
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
		if (featurelayer) {
			map.removeLayer(featurelayer)
		}
		if (talukaLayer) {
			map.removeLayer(talukaLayer);
		}
		if (pocraDBTLayer_point) {
			map.removeLayer(pocraDBTLayer_point);
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
					'viewparams': "districtCode:" + paramValue + ";talukaCode:" + talukaCode + ";attribute:Farmer",

				},
			})
			pocraDBTLayer = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer);
		}
		else {
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
					'viewparams': "groupID:" + activityId + ";districtCode:" + paramValue + ";talukaCode:" + talukaCode + ";attribute:Farmer",

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

		// if district / taluka / village code is passed then 
		// only those activity which are done in that perticular area need to be show in drop down menu.

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
					}
				});
				this.setState({
					activity: [initialActivity]
				});
			});
	}

	// load pocra districts
	getDistrict() {
		document.getElementById("infoTable").innerHTML = "";
		// document.getElementById("applicationRadio").checked = true;
		document.getElementById("villProfDiv").style.display = "none";

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
		document.getElementById("villProfDiv").style.display = "none";

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

		document.getElementById("villProfDiv").style.display = "none";


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

		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtActivitybyID_dtnCode_thnCode_vinCode_attribute?activityId=' + activity + '&districtCode=' + district + '&talukaCode=' + taluka + '&villageCode=' + village)
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

	// load Point layer accordig to it's status code
	getApplicationStatusLayer(statusCode, village, activity, labelValue) {
		if (overlay) {
			map.removeOverlay(overlay);
		}
		if (featurelayer) {
			map.removeLayer(featurelayer)
		}
		if (pocraDBTLayer_point) {
			map.removeLayer(pocraDBTLayer_point);
		}
		if (pocraDBTLayer_point_status) {
			map.removeLayer(pocraDBTLayer_point_status)
		}
		if (pocraDBTLayer) {
			map.removeLayer(pocraDBTLayer)
			map.removeLayer(featurelayer)
			map.removeLayer(geojson)
			map.removeLayer(featurelayer)

		}
		this.setState(prev => ({
			classValues: {
				appl_1: 0,
				appl_2: 0,
				appl_3: 0,
				appl_4: 0,
				legendLabel: labelValue,
				legendLabelPoint: true,
			}
		}));

		var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Village&CQL_FILTER=vincode+ILike+'" + village + "'&outputFormat=application/json";
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

		// pocraDBTLayer_point_status			

		if (activity === 'All') {
			var viewparams = "vinCode:" + village + ";groupID:" + null + ";statusCode:" + statusCode + ";attribute:Farmer";
		}
		else {
			var viewparams = "vinCode:" + village + ";groupID:" + activity + ";statusCode:" + statusCode + ";attribute:Farmer";
		}

		imgSource = new ImageWMS({
			attributions: ['&copy; DBT PoCRA'],
			crossOrigin: 'Anonymous',
			serverType: 'geoserver',
			visible: true,
			url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
			params: {
				'LAYERS': 'PoCRA_Dashboard:dbt_point_application_status_all_or_act_id',
				'TILED': true,
				'viewparams': viewparams
			},
		})

		// console.log('viewparams'+"vinCode:" + village.value);
		pocraDBTLayer_point_status = new ImageLayer({
			title: "DBT PoCRA",
			source: imgSource
		});

		map.addLayer(pocraDBTLayer_point_status);
	}

	// get village profile for vincod from api 
	getVillageProfile() {
		var vincode = $('#village').val();

		// console.log(vincode);
		var villProfApi = ''
		var villProfUrl = ''

		villProfApi = {
			"url": "http://sso.mahapocra.gov.in/masterService/village-profile-pdf",
			"method": "POST",
			"timeout": 0,
			"headers": {
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"census_code": vincode
			}),
		};

		$.ajax(villProfApi).done(function (response) {
			villProfUrl = response.data;
			// console.log(villProfUrl);
			window.open(villProfUrl, '_blank');
		});
	}

	// For dynamic legend
	getDynamicLegend() {
		var vincode = $('#village').val();
		var activity = $('#activity').val();

		if (vincode === '') {
			alert('Select Village')
		}

		var tableBodyData = [];
		var ele = document.getElementById('dynamic-table');
		// var ele = document.getElementById('legend-div');

		fetch(
			'http://gis.mahapocra.gov.in/weatherservices/meta/dbtDynamicLegend?attribute=Farmer&villageCode=' + vincode + '&activityId=' + activity
		)
			.then(response => response.json())
			// console.log(response);
			.then(data => {
				// console.log(data);
				var dynamic_table_html_text =
					'<table class="table table-image table-striped ">' +
					'<thead><tr>' +
					'<th scope="col">Activity Group Name</th>' +
					'<th scope="col">Symbol</th>' +
					'</tr>' +
					'</thead><tbody>';

				tableBodyData = data.activity.map(activities => {
					dynamic_table_html_text +=
						'<tr>' +
						'<th scope="row">' +
						activities.activity_group_name+'['+ activities.activity_group_id +']'+
						'</th> ' +
						'<td class="w-5"> ' +
						'<img src="pocra_dashboard/dist/legend/dynamicLegend/' +
						activities.legend_id +
						'.png"' +
						'class="img-fluid img-thumbnail" alt="legend-image"/>' +
						'</td>' +
						'</tr> ';
				});
				dynamic_table_html_text += '</tbody></table>';
				// console.log(dynamic_table_html_text);
				$(ele).html(dynamic_table_html_text);
			});
	}

	testFunction() {
		alert("Test function called.")
	}


	// logic to display data on map according to functionalities
	updateHeaderLabel() {
		var activity = document.getElementById("activity");
		var district = document.getElementById("district");
		var taluka = document.getElementById("taluka");
		var village = document.getElementById("village");

		var selectMenuStage = $("#select-menu-stage").val();
		var selectMenuStageLocation = $("#select-menu-stage-location").val();

		var applicationFor = "";
		var labelValue = "";

		// var villageRadio = document.getElementById("villageRadio").checked;

		// Attribute Radio Functions
		// var regestrationRadio = document.getElementById("regestrationRadio").checked;
		// var applicationRadio = document.getElementById("applicationRadio").checked;
		// var presanctionRadio = document.getElementById("presanctionRadio").checked;
		// var workCompletedRadio = document.getElementById("workCompletedRadio").checked;
		// var paymentDoneRadio = document.getElementById("paymentDoneRadio").checked;

		// Point Location Radio Functions
		// var locationRadio = document.getElementById("locationRadio").checked;
		// var pendingRadio = document.getElementById("pendingRadio").checked;
		// var RecvRadio = document.getElementById("RecvRadio").checked;
		// var workRadio = document.getElementById("workRadio").checked;
		// var disbursRadio = document.getElementById("disbursRadio").checked;

		// // WMS Layers display on Drop down event
		if (selectMenuStage == '') {
			// selectMenuStage = 'stage-applications';
			return false
		}
		else if (selectMenuStage === 'stage-pocra-villages') {
			// console.log('selectMenuStage called')
			if (overlay) {
				map.removeOverlay(overlay);
			}
			if (pocraDBTLayer_point) {
				map.removeLayer(pocraDBTLayer_point);
			}
			if (pocraDBTLayer_point_status) {
				map.removeLayer(pocraDBTLayer_point_status)
			}

			applicationFor = "no_of_village";
			labelValue = "PoCRA Villages";
		}
		else if (selectMenuStage === 'stage-registrations') {
			if (overlay) {
				map.removeOverlay(overlay);
			}
			if (pocraDBTLayer_point) {
				map.removeLayer(pocraDBTLayer_point);
			}
			if (pocraDBTLayer_point_status) {
				map.removeLayer(pocraDBTLayer_point_status)
			}

			applicationFor = "no_of_registration";
			labelValue = "Registrations";

		}
		else if (selectMenuStage === 'stage-applications') {
			if (overlay) {
				map.removeOverlay(overlay);
			}
			if (pocraDBTLayer_point) {
				map.removeLayer(pocraDBTLayer_point);
			}
			if (pocraDBTLayer_point_status) {
				map.removeLayer(pocraDBTLayer_point_status)
			}

			applicationFor = "no_of_application";
			labelValue = "Applications";

		}
		else if (selectMenuStage === 'stage-presanction') {
			if (overlay) {
				map.removeOverlay(overlay);
			}
			if (pocraDBTLayer_point) {
				map.removeLayer(pocraDBTLayer_point);
			}
			if (pocraDBTLayer_point_status) {
				map.removeLayer(pocraDBTLayer_point_status)
			}

			applicationFor = "no_of_presanction";
			labelValue = "Presanctions";

		}
		else if (selectMenuStage === 'stage-work-completed') {
			if (overlay) {
				map.removeOverlay(overlay);
			}
			if (pocraDBTLayer_point) {
				map.removeLayer(pocraDBTLayer_point);
			}
			if (pocraDBTLayer_point_status) {
				map.removeLayer(pocraDBTLayer_point_status)
			}

			applicationFor = "no_of_work_completed";
			labelValue = "Work completed";

		}
		else if (selectMenuStage === 'stage-disbursement') {
			if (overlay) {
				map.removeOverlay(overlay);
			}
			if (pocraDBTLayer_point) {
				map.removeLayer(pocraDBTLayer_point);
			}
			if (pocraDBTLayer_point_status) {
				map.removeLayer(pocraDBTLayer_point_status)
			}

			applicationFor = "no_of_paymentdone";
			labelValue = "Disbursement";

		}

		// Point location Layer display
		if (selectMenuStageLocation === 'stage-location-all') {
			// selectMenuStage = ''

			console.log("location-all")

			labelValue = "Locations";

			if (overlay) {
				map.removeOverlay(overlay);
			}
			if (pocraDBTLayer_point_status) {
				map.removeLayer(pocraDBTLayer_point_status)
			}
			if (pocraDBTLayer_point) {
				map.removeLayer(pocraDBTLayer_point);
			}
			if (featurelayer) {
				map.removeLayer(featurelayer)
			}
			if (pocraDBTLayer) {
				map.removeLayer(pocraDBTLayer)
				map.removeLayer(featurelayer)
				map.removeLayer(geojson)

			}
			this.setState(prev => ({
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

			if (activity.value === 'All') {
				var viewparams = "vinCode:" + village.value + ";groupID:" + null + ";attribute:Farmer";

			}
			else {
				var viewparams = "vinCode:" + village.value + ";groupID:" + activity.value + ";attribute:Farmer";

			}

			imgSource = new ImageWMS({
				attributions: ['&copy; DBT PoCRA'],
				crossOrigin: 'Anonymous',
				serverType: 'geoserver',
				visible: true,
				url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
				params: {
					'LAYERS': 'PoCRA_Dashboard:dbt_point_attribute_all_or_act_id',
					'TILED': true,
					'viewparams': viewparams
				},
			})
			// console.log('viewparams'+"vinCode:" + village.value);
			pocraDBTLayer_point = new ImageLayer({
				title: "DBT PoCRA",
				source: imgSource
			});
			map.addLayer(pocraDBTLayer_point);
		}
		else if (selectMenuStageLocation === 'stage-location-pre-san-pend') {
			labelValue = "Locations";
			statusCode = 1;

			this.getApplicationStatusLayer(statusCode, village.value, activity.value, labelValue);

		}
		else if (selectMenuStageLocation === 'stage-location-pre-san-rcv') {
			labelValue = "Locations";
			statusCode = 2;

			this.getApplicationStatusLayer(statusCode, village.value, activity.value, labelValue);

		}
		else if (selectMenuStageLocation === 'stage-location-work-comp') {
			labelValue = "Locations";
			statusCode = 3;

			this.getApplicationStatusLayer(statusCode, village.value, activity.value, labelValue);

		}
		else if (selectMenuStageLocation === 'stage-location-payment-disb') {
			labelValue = "Locations";
			statusCode = 4;

			this.getApplicationStatusLayer(statusCode, village.value, activity.value, labelValue)
		}


		// to display graph header label
		if (activity.value === "All" && district.value === "All" && taluka.value === 'All' && village.value == 'All') {
			// document.getElementById("loc-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
			// document.getElementById("work-comp-Radio-Div").style.display = "none";
			// document.getElementById("disburst-Radio-Div").style.display = "none";

			// document.getElementById("villagediv").style.display = "block";
			// document.getElementById("regestrationDiv").style.display = "block";

			// $("select.menu-stage-location").selectmenu("enable");
			// $("#select-menu-stage-location").selectmenu("disabled");




			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text
			})
			this.getDBTVectorLayerDistrict(activity.value, applicationFor);
			this.getDBTLayerClassValues(activity.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, "All", "All", applicationFor);
		}
		else if (activity.value !== "All" && district.value === "All" && taluka.value === 'All' && village.value == 'All') {

			// disable location and regestation radio button when activity selected and District,Taluka,Village is in 'All' condition
			// document.getElementById("loc-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
			// document.getElementById("work-comp-Radio-Div").style.display = "none";
			// document.getElementById("disburst-Radio-Div").style.display = "none";
			// document.getElementById("regestrationDiv").style.display = "none";

			// document.getElementById("villagediv").style.display = "block";

			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text

			})
			this.getDBTVectorLayerDistrict(activity.value, applicationFor);
			this.getDBTLayerClassValues(activity.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, "All", "All", applicationFor);
		}
		else if (activity.value === "All" && district.value !== "All" && taluka.value === 'All' && village.value == 'All') {
			// document.getElementById("loc-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
			// document.getElementById("work-comp-Radio-Div").style.display = "none";
			// document.getElementById("disburst-Radio-Div").style.display = "none";

			// document.getElementById("regestrationDiv").style.display = "block";

			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text
			})
			this.getDBTVectorLayerTaluka(activity.value, district.value, applicationFor);
			this.getDBTLayerClassValuesTaluka(activity.value, district.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, "All", "All", applicationFor);
		}
		else if (activity.value !== "All" && district.value !== "All" && taluka.value === 'All' && village.value === 'All') {
			// document.getElementById("loc-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
			// document.getElementById("work-comp-Radio-Div").style.display = "none";
			// document.getElementById("disburst-Radio-Div").style.display = "none";

			// document.getElementById("regestrationDiv").style.display = "block";

			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text

			})
			this.getDBTVectorLayerTaluka(activity.value, district.value, applicationFor);
			this.getDBTLayerClassValuesTaluka(activity.value, district.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, "All", "All", applicationFor);
		}
		else if (activity.value === "All" && district.value !== "All" && taluka.value !== 'All' && village.value === 'All') {
			// disable button for downloading village profile			
			document.getElementById("villProfDiv").style.display = "none";

			// document.getElementById("loc-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
			// document.getElementById("work-comp-Radio-Div").style.display = "none";
			// document.getElementById("disburst-Radio-Div").style.display = "none";

			// document.getElementById("regestrationDiv").style.display = "block";

			$("#select-menu-stage option[value='stage-pocra-villages']").attr("disabled", "disabled");


			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text
					+ " | Taluka:" + taluka.options[taluka.selectedIndex].text
			})
			this.getDBTVectorLayerVillage(activity.value, district.value, taluka.value, applicationFor);
			this.getDBTLayerClassValuesVillage(activity.value, district.value, taluka.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, taluka.value, "All", applicationFor);
		}
		else if (activity.value !== "All" && district.value !== "All" && taluka.value !== 'All' && village.value === 'All') {
			// disable button for downloading village profile			
			document.getElementById("villProfDiv").style.display = "none";

			// document.getElementById("loc-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
			// document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
			// document.getElementById("work-comp-Radio-Div").style.display = "none";
			// document.getElementById("disburst-Radio-Div").style.display = "none";

			this.setState({
				headerLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text,
				graphCountLabel: labelValue,
				graphLabel: labelValue + " | Activity : " + activity.options[activity.selectedIndex].text + " | District: " + district.options[district.selectedIndex].text
					+ " | Taluka:" + taluka.options[taluka.selectedIndex].text
			})
			this.getDBTVectorLayerVillage(activity.value, district.value, taluka.value, applicationFor);
			this.getDBTLayerClassValuesVillage(activity.value, district.value, taluka.value, applicationFor);
			this.getCategoryApplicationCount(activity.value, district.value, taluka.value, "All", applicationFor);

			// var talukaCode = taluka.value;
			// console.log(talukaCode);
		}
		else if (activity.value == "All" && district.value !== "All" && taluka.value !== 'All' && village.value !== 'All') {
			// enable button for downloading village profile
			document.getElementById("villProfDiv").style.display = "block";

			// enable location div's on village level
			// document.getElementById("loc-Radio-Div").style.display = "block";
			// document.getElementById("pre-san-pend-Radio-Div").style.display = "block";
			// document.getElementById("pre-san-recv-Radio-Div").style.display = "block";
			// document.getElementById("work-comp-Radio-Div").style.display = "block";
			// document.getElementById("disburst-Radio-Div").style.display = "block";


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

			// vinCode = village.value;
			// alert("In All actiity");

			// passing vincode to getVillageProfile function
			// this.getVillageProfile(village.value)

		}
		else if (activity.value !== "All" && district.value !== "All" && taluka.value !== 'All' && village.value !== 'All') {
			// enable button for downloading village profile
			document.getElementById("villProfDiv").style.display = "block";

			// enable location div's on village level
			// document.getElementById("loc-Radio-Div").style.display = "block";
			// document.getElementById("pre-san-pend-Radio-Div").style.display = "block";
			// document.getElementById("pre-san-recv-Radio-Div").style.display = "block";
			// document.getElementById("work-comp-Radio-Div").style.display = "block";
			// document.getElementById("disburst-Radio-Div").style.display = "block";

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
					<div class="modal fade" id="myModal" role="dialog">
						<div class="modal-dialog modal-lg">
							<div class="modal-content">
								<div class="modal-body" style={{ background: 'darkgrey' }} >
									<img id='model_img' src="" class="img-fluid" alt="Activity Image" />
								</div>

							</div>
						</div>
					</div>

					{/* Main page */}
					<section className="content-header">
						<section className="content">
							<div className="container-fluid">
								{/* SELECT2 EXAMPLE */}
								<div className="card card-default" style={{ marginTop: "0.5%" }}>
									<div className="card-header ">
										<h3 className="card-title"><b>Farmer Dashboard</b></h3>
										<div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
										</div>
									</div>

									{/* /.card-header */}
									<div className="card-body">
										<div className="row" style={{ marginBottom: "-16px" }}>
											<div className="col-md-12">
												<div className="form-group form-inline">
													<div className="col-md-2">
														<select className="form-control   select2" id="activity" style={{ width: "100%", fontSize: "14px", wordWrap: "normal" }} onChange={this.updateHeaderLabel}  >
															<option value="All" >All Activity</option>
														</select>
													</div>
													<div className="col-md-2">
														<select className="form-control  select2" style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} id="district" onChange={this.getTaluka} >
															<option value="All" >District</option>
														</select>
													</div>
													<div className="col-md-2">
														<select className=" form-control select2" style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} onChange={this.getVillage} id="taluka">
															<option value="All" >All Taluka</option>
														</select>
													</div>
													<div className="col-md-2">
														<select className="margin2 form-control select2" style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} id="village" onChange={this.updateHeaderLabel} >
															<option value="All" >All Village</option>
														</select>

													</div>

													<div className="col-md-2" style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} id="villProfDiv">
														<div class="btn-group-vertical">
															<button type="button" class="btn btn-primary " id="villProf" onClick={this.getVillageProfile}>Village Profile</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>

								</div>
							</div>
						</section>
					</section>

					{/* Map div */}
					<section className="content-header" style={{ marginTop: "-50px" }}>
						<section className="content">
							<div className="container-fluid">
								{/* SELECT2 EXAMPLE */}
								<div className="card card-default" style={{ marginTop: "0.5%" }}>
									<div className="card-header">
										<h3 className="card-title"><b>{this.state.graphLabel}</b></h3>
										<div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
										</div>
									</div>

									{/* Attributes Dropdown controls */}
									<div className="card-body">
										<div className="row" style={{ marginBottom: "-16px" }}>
											<div className="col-md-12">
												<div className="form-group form-inline">
													{/* Attribute layer selection */}
													<div className="col-md-3">
														<select className="form-control  select2 menu-stage" id='select-menu-stage' style={{ width: "100%", fontSize: "14px", wordWrap: "normal" }} onChange={this.updateHeaderLabel} >
															{/* <optgroup label="--Please choose Application Stage--">																
															</optgroup> */}
															<option value="">--Please choose Application Stage--</option>
															<option value="stage-pocra-villages">PoCRA Villages</option>
															<option value="stage-registrations">Registrations</option>
															<option value="stage-applications" selected >Applications</option>
															<option value="stage-presanction">Pre Sanction</option>
															<option value="stage-work-completed">Work Completed</option>
															<option value="stage-disbursement">Disbursement</option>
														</select>
													</div>

													{/* Point layer selection */}
													<div className="col-md-3">
														<select className="form-control  select2 menu-stage-location" id='select-menu-stage-location' style={{ width: "100%", fontSize: "14px", marginLeft: "0.2%" }} onChange={this.updateHeaderLabel}>
															<option value="">--Please choose Application Stagewise Locations--</option>
															<option value="stage-location-all">All Locations</option>
															<option value="stage-location-pre-san-pend">Pre-Sanction Pending</option>
															<option value="stage-location-pre-san-rcv">Pre-Sanction Received</option>
															<option value="stage-location-work-comp">Work Completed</option>
															<option value="stage-location-payment-disb">Payment Disbursed</option>
														</select>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Attributes button controls */}
									{/* <section className="content" id="attributes-button" style={{display:"none"}}> */}
									{/* <section className="content" id="attributes-button" >
										<div className="card card-default" style={{ margin: "0.1%" }}>
											<div className="card-header bg-info text-white">
												<h3 className="card-title ">
													<b>Attributes</b>
												</h3>
												<div className="card-tools">
													<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
												</div>
											</div>

											<div className="card-body" >
												<div className="row" style={{ marginBottom: "-16px", fontWeight: 'bold', marginLeft: "1px" }}>
													<div className="col-md-12">
														<div className="form-group form-inline ">
															<div className="margin2 form-check form-check-inline col-md-2" id="villagediv">
																<input class="form-check-input" type="radio" id="villageRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="villageRadio">PoCRA Villages</label>
															</div>
															<div className="margin2 form-check form-check-inline col-md-2" id='regestrationDiv'>
																<input class="form-check-input" type="radio" id="regestrationRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="regestrationRadio">Registrations</label>
															</div>
															<div className="margin2 form-check form-check-inline col-md-2" >
																<input class="form-check-input" type="radio" id="applicationRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="applicationRadio">Applications</label>
															</div>
															<div className="margin2 form-check form-check-inline col-md-2">
																<input class="form-check-input" type="radio" id="presanctionRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="presanctionRadio">Pre Sanction</label>
															</div>
															<div className="margin2 form-check form-check-inline col-md-2">
																<input class="form-check-input" type="radio" id="workCompletedRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="workCompletedRadio">Work Completed</label>
															</div>
															<div className="margin2 form-check form-check-inline col-md-2">
																<input class="form-check-input" type="radio" id="paymentDoneRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="paymentDoneRadio">Disbursement</label>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</section> */}

									{/* Points button controls */}
									{/* <section className="content">
										<div className="card card-default" style={{ margin: "0.1%" }}>
											<div className="card-header bg-success text-white">
												<h3 className="card-title "><b>Point Locations</b></h3>
												<div className="card-tools">
													<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
												</div>
											</div>

											<div className="card-body" >
												<div className="row" style={{ marginBottom: "-16px", fontWeight: 'bold', marginLeft: "1px" }}>
													<div className="col-md-12">
														<div className="form-group form-inline ">
															<div className="margin2 form-check form-check-inline col-md-2" id='loc-Radio-Div' >
																<input class="form-check-input" type="radio" id="locationRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="locationRadio">All Locations</label>
															</div>
															<div className="margin2 form-check form-check-inline col-md-2" id='pre-san-pend-Radio-Div' >
																<input class="form-check-input" type="radio" id="pendingRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="pendingRadio">Pre-Sanction Pending</label>
															</div>
															<div className="margin2 form-check form-check-inline col-md-2" id='pre-san-recv-Radio-Div' >
																<input class="form-check-input" type="radio" id="RecvRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="RecvRadio">Pre-Sanction Received</label>
															</div>
															<div className="margin2 form-check form-check-inline col-md-2" id='work-comp-Radio-Div' >
																<input class="form-check-input" type="radio" id="workRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="workRadio">Work Completed</label>
															</div>
															<div className="margin2 form-check form-check-inline col-md-2" id='disburst-Radio-Div' >
																<input class="form-check-input" type="radio" id="disbursRadio" name="customRadio" onChange={this.updateHeaderLabel} />
																<label class="form-check-label" for="disbursRadio">Payment Disbursed</label>
															</div>

														</div>

													</div>
												</div>
											</div>
										</div>
									</section> */}

									{/* /.Legend Panel */}
									<div className="card-body">
										<div className="row">
											<div className="col-12" id="map" style={{ height: "70vh", width: "100%" }}>
											</div>
											<div id="popup" className="ol-popup">
												<a href="#" id="popup-closer" className="ol-popup-closer" />
												<div id="popup-content" />
											</div>

											{/* Legend Panel */}
											<div id="legend-div" className="legend-control ol-control">
												{/* onClick={this.testFunction()} */}
												Legend
												{/* <div>
													<Popover content={content}>
														<Button type="primary">Legend</Button>
													</Popover>
												</div> */}
											</div>

											<div id={"legend"} className="box stack-top">
												<LegendPanelDashboard props={this.state.classValues} />
											</div>

											<section className="content col-sm-5" style={{ position: "absolute", zIndex: "9", top: "20%", right: "0%" }} id="infoTable">
											</section>
										</div>
									</div>

								</div>
							</div>
						</section >

					</section >
					{/* Charts div */}
					< section className="content-header" style={{ marginTop: "-50px" }
					}>
						<section className="content">
							<div className="container-fluid">
								{/* SELECT2 EXAMPLE */}
								<div className="card card-default" style={{ marginTop: "0.5%" }}>
									<div className="card-header">
										<h3 className="card-title"><b>{this.state.graphLabel}</b></h3>
										<div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
										</div>
									</div>

									{/* Pie Chart */}
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
							</div>
						</section>
					</section >

					{/* Test div */}
					< section className="content-header" style={{ marginTop: "-50px" }}>
						<section className="content">
							<div className="container-fluid">
								<div className="card card-default" style={{ marginTop: "0.5%" }}>
									{/* Title */}
									<div className="card-header">
										<h3 className="card-title"><b>Dyanamic Legend</b></h3>
										<div className="card-tools">
											<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
										</div>
									</div>

									{/* Dynamic Legend Div  */}
									<div className="card-body">
										<div class="col-sm-3 container" id="dynamic-legend-div">
											<button type="button" class="btn btn-primary " id="dynamic-legend-button" onClick={this.getDynamicLegend}>Legend</button>
											<div class="row" id="dynamic-table">
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					</section >


				</div >

			</div >
		)
	}
}
