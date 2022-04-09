// logic to display data on radio and dropdown change
updateHeaderLabels() {
	var activity = document.getElementById("activity");
	var district = document.getElementById("district");
	var taluka = document.getElementById("taluka");
	var village = document.getElementById("village");


	var selectMenuStage = document.getElementById("select-menu-stage");

	// console.log(activity.options[activity.selectedIndex].text)
	// console.log(activity.value)
	// var actID = activity.options[activity.selectedIndex].value;

	var applicationFor = "";
	var labelValue = "";
	var vinCode = "";

	// var statusCode = "";
	// var pocraDBTLayer_point_status = "";

	var villageRadio = document.getElementById("villageRadio").checked;

	var regestrationRadio = document.getElementById("regestrationRadio").checked;
	var applicationRadio = document.getElementById("applicationRadio").checked;
	var presanctionRadio = document.getElementById("presanctionRadio").checked;
	var workCompletedRadio = document.getElementById("workCompletedRadio").checked;
	var paymentDoneRadio = document.getElementById("paymentDoneRadio").checked;

	// Point Location Radio Functions
	var locationRadio = document.getElementById("locationRadio").checked;
	var pendingRadio = document.getElementById("pendingRadio").checked;
	var RecvRadio = document.getElementById("RecvRadio").checked;
	var workRadio = document.getElementById("workRadio").checked;
	var disbursRadio = document.getElementById("disbursRadio").checked;

	// WMS Layers display
	if (villageRadio === true && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false && pendingRadio === false && RecvRadio === false && workRadio === false && disbursRadio === false) {
		document.getElementById("villageRadio").checked = true;

		document.getElementById("regestrationRadio").checked = false;
		document.getElementById("applicationRadio").checked = false;
		document.getElementById("presanctionRadio").checked = false;
		document.getElementById("workCompletedRadio").checked = false;
		document.getElementById("paymentDoneRadio").checked = false;
		document.getElementById("locationRadio").checked = false;
		document.getElementById("pendingRadio").checked = false;
		document.getElementById("RecvRadio").checked = false;
		document.getElementById("workRadio").checked = false;
		document.getElementById("disbursRadio").checked = false;

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

	}
	else if (villageRadio === false && regestrationRadio === true && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false && pendingRadio === false && RecvRadio === false && workRadio === false && disbursRadio === false) {
		document.getElementById("villageRadio").checked = false;
		document.getElementById("regestrationRadio").checked = true;

		document.getElementById("applicationRadio").checked = false;
		document.getElementById("presanctionRadio").checked = false;
		document.getElementById("workCompletedRadio").checked = false;
		document.getElementById("paymentDoneRadio").checked = false;
		document.getElementById("locationRadio").checked = false;
		document.getElementById("pendingRadio").checked = false;
		document.getElementById("RecvRadio").checked = false;
		document.getElementById("workRadio").checked = false;
		document.getElementById("disbursRadio").checked = false;

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

	}
	else if (villageRadio === false && regestrationRadio === false && applicationRadio == true && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false && pendingRadio === false && RecvRadio === false && workRadio === false && disbursRadio === false) {
		document.getElementById("villageRadio").checked = false;
		document.getElementById("regestrationRadio").checked = false;
		document.getElementById("applicationRadio").checked = true;

		document.getElementById("presanctionRadio").checked = false;
		document.getElementById("workCompletedRadio").checked = false;
		document.getElementById("paymentDoneRadio").checked = false;
		document.getElementById("locationRadio").checked = false;
		document.getElementById("pendingRadio").checked = false;
		document.getElementById("RecvRadio").checked = false;
		document.getElementById("workRadio").checked = false;
		document.getElementById("disbursRadio").checked = false;

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

	}
	else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === true && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false && pendingRadio === false && RecvRadio === false && workRadio === false && disbursRadio === false) {
		document.getElementById("villageRadio").checked = false;
		document.getElementById("regestrationRadio").checked = false;
		document.getElementById("applicationRadio").checked = false;
		document.getElementById("presanctionRadio").checked = true;

		document.getElementById("workCompletedRadio").checked = false;
		document.getElementById("paymentDoneRadio").checked = false;
		document.getElementById("locationRadio").checked = false;
		document.getElementById("pendingRadio").checked = false;
		document.getElementById("RecvRadio").checked = false;
		document.getElementById("workRadio").checked = false;
		document.getElementById("disbursRadio").checked = false;

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

	}
	else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === true && paymentDoneRadio === false && locationRadio === false && pendingRadio === false && RecvRadio === false && workRadio === false && disbursRadio === false) {
		document.getElementById("villageRadio").checked = false;
		document.getElementById("regestrationRadio").checked = false;
		document.getElementById("applicationRadio").checked = false;
		document.getElementById("presanctionRadio").checked = false;
		document.getElementById("workCompletedRadio").checked = true;

		document.getElementById("paymentDoneRadio").checked = false;
		document.getElementById("locationRadio").checked = false;
		document.getElementById("pendingRadio").checked = false;
		document.getElementById("RecvRadio").checked = false;
		document.getElementById("workRadio").checked = false;
		document.getElementById("disbursRadio").checked = false;

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

	}
	else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === true && locationRadio === false && pendingRadio === false && RecvRadio === false && workRadio === false && disbursRadio === false) {
		document.getElementById("villageRadio").checked = false;
		document.getElementById("regestrationRadio").checked = false;
		document.getElementById("applicationRadio").checked = false;
		document.getElementById("presanctionRadio").checked = false;
		document.getElementById("workCompletedRadio").checked = false;
		document.getElementById("paymentDoneRadio").checked = true;

		document.getElementById("locationRadio").checked = false;
		document.getElementById("pendingRadio").checked = false;
		document.getElementById("RecvRadio").checked = false;
		document.getElementById("workRadio").checked = false;
		document.getElementById("disbursRadio").checked = false;

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

	}

	// Drop down of buttons
	if (selectMenuStage.value === 'stage-pocra-villages') {
		console.log('selectMenuStage called')
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
	}
	else if (selectMenuStage.value === 'stage-registrations') {
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

	}
	else if (selectMenuStage.value === 'stage-applications') {
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

	}

	// Point location Layer display
	else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === true && pendingRadio === false && RecvRadio === false && workRadio === false && disbursRadio === false) {
		document.getElementById("villageRadio").checked = false;
		document.getElementById("regestrationRadio").checked = false;
		document.getElementById("applicationRadio").checked = false;
		document.getElementById("presanctionRadio").checked = false;
		document.getElementById("workCompletedRadio").checked = false;
		document.getElementById("paymentDoneRadio").checked = false;
		document.getElementById("locationRadio").checked = true;

		document.getElementById("pendingRadio").checked = false;
		document.getElementById("RecvRadio").checked = false;
		document.getElementById("workRadio").checked = false;
		document.getElementById("disbursRadio").checked = false;

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
	else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false && pendingRadio === true && RecvRadio === false && workRadio === false && disbursRadio === false) {
		document.getElementById("villageRadio").checked = false;
		document.getElementById("regestrationRadio").checked = false;
		document.getElementById("applicationRadio").checked = false;
		document.getElementById("presanctionRadio").checked = false;
		document.getElementById("workCompletedRadio").checked = false;
		document.getElementById("paymentDoneRadio").checked = false;
		document.getElementById("locationRadio").checked = false;
		document.getElementById("pendingRadio").checked = true;

		document.getElementById("RecvRadio").checked = false;
		document.getElementById("workRadio").checked = false;
		document.getElementById("disbursRadio").checked = false;

		labelValue = "Locations";
		statusCode = 1;

		this.getApplicationStatusLayer(statusCode, village.value, activity.value, labelValue);

	}
	else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false && pendingRadio === false && RecvRadio === true && workRadio === false && disbursRadio === false) {
		document.getElementById("villageRadio").checked = false;
		document.getElementById("regestrationRadio").checked = false;
		document.getElementById("applicationRadio").checked = false;
		document.getElementById("presanctionRadio").checked = false;
		document.getElementById("workCompletedRadio").checked = false;
		document.getElementById("paymentDoneRadio").checked = false;
		document.getElementById("locationRadio").checked = false;
		document.getElementById("pendingRadio").checked = false;
		document.getElementById("RecvRadio").checked = true;

		document.getElementById("workRadio").checked = false;
		document.getElementById("disbursRadio").checked = false;

		labelValue = "Locations";
		statusCode = 2;

		this.getApplicationStatusLayer(statusCode, village.value, activity.value, labelValue);

	}
	else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false && pendingRadio === false && RecvRadio === false && workRadio === true && disbursRadio === false) {
		document.getElementById("villageRadio").checked = false;
		document.getElementById("regestrationRadio").checked = false;
		document.getElementById("applicationRadio").checked = false;
		document.getElementById("presanctionRadio").checked = false;
		document.getElementById("workCompletedRadio").checked = false;
		document.getElementById("paymentDoneRadio").checked = false;
		document.getElementById("locationRadio").checked = false;
		document.getElementById("pendingRadio").checked = false;
		document.getElementById("RecvRadio").checked = false;

		document.getElementById("workRadio").checked = true;
		document.getElementById("disbursRadio").checked = false;

		labelValue = "Locations";
		statusCode = 3;

		this.getApplicationStatusLayer(statusCode, village.value, activity.value, labelValue);



	}
	else if (villageRadio === false && regestrationRadio === false && applicationRadio == false && presanctionRadio === false && workCompletedRadio === false && paymentDoneRadio === false && locationRadio === false && pendingRadio === false && RecvRadio === false && workRadio === false && disbursRadio === true) {
		document.getElementById("villageRadio").checked = false;
		document.getElementById("regestrationRadio").checked = false;
		document.getElementById("applicationRadio").checked = false;
		document.getElementById("presanctionRadio").checked = false;
		document.getElementById("workCompletedRadio").checked = false;
		document.getElementById("paymentDoneRadio").checked = false;
		document.getElementById("locationRadio").checked = false;
		document.getElementById("pendingRadio").checked = false;
		document.getElementById("RecvRadio").checked = false;
		document.getElementById("workRadio").checked = false;
		document.getElementById("disbursRadio").checked = true;

		labelValue = "Locations";
		statusCode = 4;

		this.getApplicationStatusLayer(statusCode, village.value, activity.value, labelValue)

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

	// to display graph header label
	if (activity.value === "All" && district.value === "All" && taluka.value === 'All' && village.value == 'All') {
		document.getElementById("loc-Radio-Div").style.display = "none";
		document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
		document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
		document.getElementById("work-comp-Radio-Div").style.display = "none";
		document.getElementById("disburst-Radio-Div").style.display = "none";

		// document.getElementById("villagediv").style.display = "block";
		document.getElementById("regestrationDiv").style.display = "block";

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
		document.getElementById("loc-Radio-Div").style.display = "none";
		document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
		document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
		document.getElementById("work-comp-Radio-Div").style.display = "none";
		document.getElementById("disburst-Radio-Div").style.display = "none";
		document.getElementById("regestrationDiv").style.display = "none";

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
		document.getElementById("loc-Radio-Div").style.display = "none";
		document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
		document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
		document.getElementById("work-comp-Radio-Div").style.display = "none";
		document.getElementById("disburst-Radio-Div").style.display = "none";

		document.getElementById("regestrationDiv").style.display = "block";

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
		document.getElementById("loc-Radio-Div").style.display = "none";
		document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
		document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
		document.getElementById("work-comp-Radio-Div").style.display = "none";
		document.getElementById("disburst-Radio-Div").style.display = "none";

		document.getElementById("regestrationDiv").style.display = "block";

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

		document.getElementById("loc-Radio-Div").style.display = "none";
		document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
		document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
		document.getElementById("work-comp-Radio-Div").style.display = "none";
		document.getElementById("disburst-Radio-Div").style.display = "none";

		document.getElementById("regestrationDiv").style.display = "block";

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

		document.getElementById("loc-Radio-Div").style.display = "none";
		document.getElementById("pre-san-pend-Radio-Div").style.display = "none";
		document.getElementById("pre-san-recv-Radio-Div").style.display = "none";
		document.getElementById("work-comp-Radio-Div").style.display = "none";
		document.getElementById("disburst-Radio-Div").style.display = "none";

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
		document.getElementById("loc-Radio-Div").style.display = "block";
		document.getElementById("pre-san-pend-Radio-Div").style.display = "block";
		document.getElementById("pre-san-recv-Radio-Div").style.display = "block";
		document.getElementById("work-comp-Radio-Div").style.display = "block";
		document.getElementById("disburst-Radio-Div").style.display = "block";


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
		document.getElementById("loc-Radio-Div").style.display = "block";
		document.getElementById("pre-san-pend-Radio-Div").style.display = "block";
		document.getElementById("pre-san-recv-Radio-Div").style.display = "block";
		document.getElementById("work-comp-Radio-Div").style.display = "block";
		document.getElementById("disburst-Radio-Div").style.display = "block";

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


};
//

// Location radio functions 
if (activity === "All" && district !== "All" && taluka === "All" && village === "All" && allLocationRadio === false) {
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

} 
else if (activity !== "All" && district !== "All" && taluka === "All" && village === "All" && allLocationRadio === false) {

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
}
 else if (activity == "All" && district !== "All" && taluka !== "All" && village === "All" && allLocationRadio === false) {

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
} 
else if (activity !== "All" && district !== "All" && taluka !== "All" && village === "All" && allLocationRadio === false) {
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
} 
else if (activity === "All" && district !== "All" && taluka !== "All" && village !== "All" && allLocationRadio === true || preSanPendLocRadio === true || preSanRecLocRadio === true || workDoneLocRadio === true || disbLocRadio === true) {

	if (allLocationRadio == true) {
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

	if (allLocationRadio == true) {
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
} 
else if (activity !== "All" && district !== "All" && taluka !== "All" && village !== "All" && allLocationRadio === true || preSanPendLocRadio === true || preSanRecLocRadio === true || workDoneLocRadio === true || disbLocRadio === true) {

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