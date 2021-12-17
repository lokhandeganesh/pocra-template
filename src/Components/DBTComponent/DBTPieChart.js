import React, { Component } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import "./DBTDashboard.css"
let cat = "";
export default class DBTPieChart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			districtName: "",
			districtCode: "",
			total: 0,
			g_other: 0,
			male: 0,
			female: 0,
			c_others: 0,
			c_other: 0,
			sc: 0,
			st: 0,
			category: '',
		}

	}

	componentDidMount() {
	}

	render() {
		const options = {

			chart: {
				plotBackgroundColor: "#ebebe0",
				plotBorderWidth: "#8c8c5a",
				plotShadow: true,
				type: 'pie',
				height: '50%'
			},
			title: {
				style: {
					color: '#FF0000',
					fontWeight: 'bold'
				},
				text: ''
			}, credits: {
				enabled: false
			},
			subtitle: {
				style: {
					fontWeight: 'bold'
				},
				// text:'Application on DBT Portal in '+this.props.pieChartProps.activityLabel+' wise'
				// text: 'District : ' + this.state.districtName +
				// 	"<br/>Total Application  : " + this.state.total
			},
			tooltip: {
				pointFormat:
					// "{point.name}: <b>{point.percentage:.1f}%",
					"<b>{point.percentage:.1f}%",
				// pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
			},
			accessibility: {
				point: {
					valueSuffix: ''
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					size: '50%',
					height: '100%',
					allowPointSelect: true,
					cursor: 'pointer',
					// colors: pieColors,
					dataLabels: {
						enabled: true,
						format: "{point.name}: <br>{point.y} <br>({point.percentage:.1f}%)</b>",
						// format: '<b>{point.name}</b>: {point.y:.0f}',
						connectorShape: 'straight',
						crookDistance: '5%',
					},
					showInLegend: false
				}
			},
			// legend: {
			// 	backgroundColor: '#FCFFC5',
			// 	borderRadius: 5,
			// 	borderColor: '#C98657',
			// 	borderWidth: 1,
			// 	align: 'right',
			// 	verticalAlign: 'top',
			// 	layout: 'vertical',
			// 	x: 0,
			// 	y: 50
			// },
			series: [{
				name: '',
				colorByPoint: true,
				data: this.props.pieChartProps.data
				// data: [
				// 	{
				// 		name: 'Male',
				// 		y: this.state.male,
				// 	},
				// 	{
				// 		name: 'Female',
				// 		y: this.state.female,
				// 	},
				// 	{
				// 		name: 'Other',
				// 		y: this.state.g_other,
				// 	}
				// ]
			}],

		};
		return (
			<>
				<section className="col-lg-4 connectedSortable">
					<div className="card">
						<div className="card-header">
							<h6 className="card-title">
								<i className="fas fa-users"> </i> <b>{this.props.pieChartProps.activityLabel}</b>
							</h6>
							<div className="card-tools">
								<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"></i>
								</button>
							</div>
						</div>
						<div className="card-body">
							<HighchartsReact highcharts={Highcharts} options={options} />
						</div>
					</div>
				</section>
			</>

		)
	}
}
