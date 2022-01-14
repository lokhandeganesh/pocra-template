import React, { Component } from 'react'
import "./LegendPanel.css"
export default class LegendPanel extends Component {
	render() {


		const renderAuthButton = () => {

			if (this.props.props.pname == "rainfall_mm") {
				return (
					<>
						<table >
							<tr>
								<th colSpan={2} className="borber" > Legend</th>
							</tr>
							<tr>
								<th colSpan={2}> Rainfall (mm)</th>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast1.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.rain1} - {this.props.props.rain2} </td>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast2.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.rain2 + 0.1} - {this.props.props.rain3} </td>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast3.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.rain3 + 0.1} - {this.props.props.rain4} </td>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast4.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.rain4 + 0.1} and above </td>
							</tr>
						</table>
					</>
				)

			} else if (this.props.props.pname == "temp_min_deg_c") {
				return (
					<>
						<table>
							<tr>
								<th colSpan={2} className="borber" > Legend</th>
							</tr>
							<tr>
								<th colSpan={2}> Minimun Temprature (&#176;C)</th>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast1.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.rain1} - {this.props.props.tempmin1} </td>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast2.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.tempmin1 + 0.1} - {this.props.props.tempmin2} </td>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast3.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.tempmin2 + 0.1} - {this.props.props.tempmin3} </td>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast4.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.tempmin3 + 0.1} and above </td>
							</tr>
						</table>
					</>
				)

			} else if (this.props.props.pname == "temp_max_deg_c") {
				return (
					<>
						<table>
							<tr>
								<th colSpan={2} className="borber" > Legend</th>
							</tr>
							<tr>
								<th colSpan={2}> Maximum Temprature (&#176;C)</th>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast1.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.rain1} - {this.props.props.tempmax1} </td>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast2.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.tempmax1 + 0.1} - {this.props.props.tempmax2} </td>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast3.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.tempmax2 + 0.1} - {this.props.props.tempmax3} </td>
							</tr>
							<tr>
								<td><img src="pocra_dashboard/dist/legend/forcast4.jpg" height={'30px'} width={'50px'} />  </td>

								<td>{this.props.props.tempmax3 + 0.1} and above </td>
							</tr>
						</table>
					</>
				)

			}
		}
		return (
			<div>
				{renderAuthButton()}
			</div>
		)

	}
}
