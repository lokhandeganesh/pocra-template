import React, { Component } from 'react'
import "./selection.css"

export default class SelectionMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
    }

    //function binding which are used
    this.getTaluka = this.getTaluka.bind(this)
    this.getVillage = this.getVillage.bind(this)

  }


  // function for activity
  getActivity() {
    let initialActivity = [];
    var ele = document.getElementById("activity");;
    ele.innerHTML = "<option value='All'>All Activity</option>";
    fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtActivityMaster?activity=Farmer')
      .then(response => {
        return response.json();
      }).then(data => {
        console.log(data)
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

  }

  // load pocra village
  getVillage(event) {
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

  }




  render() {
    return (
      <div>
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header" >
            <section className="content">
              <div className="container-fluid">
                {/* SELECT2 EXAMPLE */}
                <div className="card card-default" style={{ marginTop: "0.5%" }}>
                  <div className="card-header " style={{ paddingBottom: "0" }}>
                    <h3 className="card-title"><b>Select Options</b></h3>
                    <div className="card-tools">
                      <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
                    </div>
                  </div>
                  {/* /.card-header */}
                  <div className="card-body">
                    <div className="row" style={{ marginBottom: "-16px" }}>
                      <div className="col-md-12 ">
                        <div className="form-group form-inline">
                          <div className="col-md-3 col-sm-6">
                            <select className="form-control  cursor-pointer selection-custom ml word-wrap" id="activity" onChange={this.getActivity}  >
                              <option value="All" >All Activity</option>
                            </select>
                          </div>
                          <div className="col-md-3 col-sm-6">
                            <select className="form-control  cursor-pointer selection-custom ml" id="district" onChange={this.getTaluka} >
                              <option value="All">All District</option>
                            </select>
                          </div>
                          <div className="col-md-3 col-sm-6">
                            <select className=" form-control cursor-pointer selection-custom ml" id="taluka" onChange={this.getVillage} >
                              <option value="All" >All Taluka</option>
                            </select>
                          </div>
                          <div className="col-md-3 col-sm-6">
                            <select className=" form-control cursor-pointer selection-custom ml" id="village" onChange={this.getVillage} >
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
        </div>
      </div>
    )
  }
}