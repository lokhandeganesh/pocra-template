import React, { Component } from 'react'
import "./LegendPanel.css"
import 'bootstrap/dist/css/bootstrap.min.css';
export default class LegendPanelHome extends Component {
	constructor(props) {
		super(props)


	}

	render() {
		return (
				<div>
					<table >
						<tr>
							<th colSpan={2} className="borber"> Legend</th>
						</tr>
						<tr>
							<th colSpan={2}> {this.props.props.legendLabel}</th>
						</tr>
						<tr>
							{/* <img src="pocra_dashboard/dist/legend/home_appl_1.png" 

							when we build the project and access it on VM of
							pocra_server the address of image is loading wrong the extra 'pocra_dashboard' was getting added to address this in img location we pass without 'pocra_dashboard'*/}
							
							<td><img src="dist/legend/home_appl_1.png" height={'20px'} width={'25px'} />  </td>
	
							<td>0 - {this.props.props.appl_1} </td>
						</tr>
						<tr>
							<td><img src="dist/legend/home_appl_2.png" height={'20px'} width={'25px'} />  </td>
	
							<td>{this.props.props.appl_1 + 1} - {this.props.props.appl_2} </td>
						</tr>
						<tr>
							<td><img src="dist/legend/home_appl_3.png" height={'20px'} width={'25px'} />  </td>
	
							<td>{this.props.props.appl_2 + 1} - {this.props.props.appl_3}  </td>
						</tr>
						<tr>
							<td><img src="dist/legend/home_appl_4.png" height={'20px'} width={'25px'} />  </td>
	
							<td>{this.props.props.appl_3 + 1} - {this.props.props.appl_4} </td>
						</tr>
						<tr>
							<td><img src="dist/legend/home_appl_5.png" height={'20px'} width={'25px'} />  </td>
	
							<td>{this.props.props.appl_4 + 1} - and above </td>
						</tr>
						{/* <tr>
							<td><img src="dist/legend/appl_6.png" height={'20px'} width={'25px'} />  </td>
	
							<td>{this.props.props.appl_5 + 0.1} - and above </td>
						</tr> */}
					</table>
				</div>
			)
		}
		

	}
