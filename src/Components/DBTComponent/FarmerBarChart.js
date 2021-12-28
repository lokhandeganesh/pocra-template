import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


export default class FarmerBarChart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ActivityGroupName: [],
			no_of_registration: [],
			no_of_application: [],
			no_of_presanction: [],			
			no_of_work_completed: [],
			no_of_paymentdone: []
		}
	}

	componentDidMount() {
		this.getFarmerActivity();
	}

	getFarmerActivity() {
		let initialActivity = [];
		let activityGroupName = [], total_no_of_registration = [], total_no_of_application = [],total_no_of_presanction = [],
		total_no_of_work_completed = [] ,total_no_of_paymentdone = [];
		fetch('http://gis.mahapocra.gov.in/weatherservices/meta/dbtActivityMaster?activity=' + this.props.chartProps.activity)
			.then(response => {
				return response.json();
			}).then(data => {
				// console.log(data)
				initialActivity = data.activity.map((farmers) => {
					activityGroupName.push(farmers.ActivityGroupName);
					total_no_of_registration.push(farmers.no_of_registration);
					total_no_of_application.push(farmers.no_of_application);
					total_no_of_presanction.push(farmers.no_of_presanction);
					total_no_of_work_completed.push(farmers.no_of_work_completed);
					total_no_of_paymentdone.push(farmers.no_of_paymentdone);
				});

				this.setState({

					ActivityGroupName: activityGroupName,
					no_of_registration: total_no_of_registration,
					no_of_application: total_no_of_application,
					no_of_presanction: total_no_of_presanction,			
					no_of_work_completed: total_no_of_work_completed,
					no_of_paymentdone:total_no_of_paymentdone
				});
			});
	}

	render() {
		const options = {

			chart: {
				type: 'column'
			},
			title: {
				text: this.props.chartProps.activityLabel
			},
			subtitle: {
				text: this.props.chartProps.xlabel
			},
			xAxis: {
				categories: this.state.ActivityGroupName,
				crosshair: true
			},
			yAxis: {
				type: 'logarithmic',
				minorTickInterval: 0.1,
				accessibility: {
					rangeDescription: 'Range: 0.1 to 1000'
				},
				title: {
					text: 'Total'
				}
			}, credits: {
				enabled: false
			},
			tooltip: {
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
							'<td style="padding:0"><b>{point.y}</b></td></tr>',
				footerFormat: '</table>',
				shared: true,
				useHTML: true
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0.5
				}
			},legend: {
				itemStyle: {
				  fontWeight: 'lighter'
				}
			  },
			series: [{
				name: 'Registration',
				data: this.state.no_of_registration

			},{
				name: 'Applications',
				data: this.state.no_of_application

			},{
				name: 'Presanctions',
				data: this.state.no_of_presanction

			}, {
				name: 'Work Completed',
				data: this.state.no_of_work_completed

			}, {
				name: 'Payment Done',
				data: this.state.no_of_paymentdone

			}]
		};
		return (
			<div >
				<HighchartsReact highcharts={Highcharts} options={options} />
			</div>
		)
	}
}
