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
							<td><img src="pocra_dashboard/dist/legend/APC.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Apiculture</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/POL.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Backyard Poultry</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/COM.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Compost (Vermicompost / NADEP / Organic input production unit)</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/DRP.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Drip Irrigation</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/FME.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Farm Mechanization</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/FPD.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Farm Pond (Individual)</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/FPL.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Farm Pond Lining</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/OTH.png" height={'20px'} width={'25px'} />  </td>
	
							<td>FFS host farmer assistance / Promotion of BBF technology etc.</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/HPL.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Horticulture Plantation / Agroforestry</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/IFA.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Inland Fisheries</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/PIP.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Pipes</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/PMP.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Planting material in polytunnels / Polyhouse / Shadenet house</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/PTL.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Polyhouse/ Poly tunnels</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/RDW.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Recharge of open dug wells</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/KHR.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Saline and Sodic lands (Farm ponds/ Sprinklers / Water pump/ FFS)</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/SPD.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Seed Production</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/SRC.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Sericulture</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/SDH.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Shadenet House</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/RUM.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Small ruminants</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/SPR.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Sprinkler Irrigation</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/PMPS.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Water Pumps</td>
						</tr>
						<tr>
							<td><img src="pocra_dashboard/dist/legend/WEL.png" height={'20px'} width={'25px'} />  </td>
	
							<td>Well</td>
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
