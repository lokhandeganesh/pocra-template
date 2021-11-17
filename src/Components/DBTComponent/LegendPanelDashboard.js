import React, { Component } from 'react'
import "./LegendPanel.css"
import 'bootstrap/dist/css/bootstrap.min.css';
export default class LegendPanelDashboard extends Component {
	constructor(props) {
		super(props)


	}

	render() {
		if (this.props.props.legendLabelPoint===true){
			return (
				<div>
					<table >
						<tr>
							<th colSpan={2} className="borber" >Legend</th>
						</tr>
						<tr>
							<th colSpan={2}>Activity Symbology </th>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/dbt_point_symbols.png" />  </td>						
						</tr>					
						
					</table>
				</div>
			)
		}else{
			return (
				<div>
					<table >
						<tr>
							<th colSpan={2} className="borber" > Legend</th>
						</tr>
						<tr>
							<th colSpan={2}> {this.props.props.legendLabel}</th>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/appl_1.png" height={'20px'} width={'25px'} />  </td>
	
							<td>0 - {this.props.props.appl_1} </td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/appl_2.png" height={'20px'} width={'25px'} />  </td>
	
							<td>{this.props.props.appl_1 + 1} - {this.props.props.appl_2} </td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/appl_3.png" height={'20px'} width={'25px'} />  </td>
	
							<td>{this.props.props.appl_2 + 1} - {this.props.props.appl_3}  </td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/appl_4.png" height={'20px'} width={'25px'} />  </td>
	
							<td>{this.props.props.appl_3 + 1} - {this.props.props.appl_4} </td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/appl_5.png" height={'20px'} width={'25px'} />  </td>
	
							<td>{this.props.props.appl_4 + 1} - and above </td>
						</tr>
						{/* <tr>
							<td><img src="pocra_dashboard/dist/legend/appl_6.png" height={'20px'} width={'25px'} />  </td>
	
							<td>{this.props.props.appl_5 + 0.1} - and above </td>
						</tr> */}
					</table>
				</div>
			)
		}
		

	}
}
