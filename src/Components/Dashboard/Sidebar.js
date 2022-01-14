import React, { Component } from 'react'
import "./Sidebar.css"
import Content from '../content'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
export default class Sidebar extends Component {

    render() {
        const items = [
            { name: 'home', css: 'nav-icon fas fa-home', label: 'Home' },           
            {
                name: '#',
                label: 'DBT',
                css: 'nav-icon fas fa-rupee-sign',
                items: [
                    { name: 'dbtfarmer', label: 'Farmer', css: 'nav-icon fas fa-tractor', style:'color:white ! important' },
                    // <a href="https://icons8.com/icon/Y0OtRmz8nX1e/cultivation">Cultivation icon by Icons8</a>
                    { name: 'nrm', label: 'Community', css: 'nav-icon fas fa-users' },
                    { name: 'fpc_fpo', label: 'FPC/FPO', css: 'nav-icon fas fa-store-alt' },

                ],
            },
            { name: 'forecast', css: 'nav-icon fas fa-cloud-moon-rain', label: 'Weather Forecast' },
            // { name: 'soilcard', css: 'nav-icon fas fa-copy', label: 'मृद आरोग्य पत्रिका ' },
            // { name: 'dbt', css: 'nav-icon fas fa-tachometer-alt', label: 'PoCRA DBT' },
        ]
        return (
           
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    {/* Brand Logo */}
                    <a className="brand-link">
                        <img src="https://mahapocra.gov.in/assets/images/pocra.png" alt="PoCRA Logo" className="brand-image img-square" />
                        <span className="brand-text font-weight " id="title">PoCRA</span>
                    </a>
                    {/* Sidebar */}
                    <div className="sidebar ">
                        {/* Sidebar user panel (optional) */}
                        <div className="form-inline" style={{ paddingTop: 5 }} >
                            <div className="input-group" data-widget="sidebar-search">
                                <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                                <div className="input-group-append">
                                    <button className="btn btn-sidebar">
                                        <i className="fas fa-search fa-fw" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <nav className="mt-2">
                            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                {items.map(({ label, name, css, items: subItems, ...rest }, index) => (
                                    <li className="nav-item" key={index + name}>
                                        {
                                            Array.isArray(subItems) ? (

                                                <li class="nav-item has-treeview" >
                                                    <Link to={"/" + name} class="nav-link">
                                                        <i class={css}></i>
                                                        <p>
                                                            {label}
                                                            <i class="right fas fa-angle-left"></i>
                                                        </p>
                                                    </Link>

                                                    {subItems.map(({ label, name, css, items: itm, ...rest }, index) => (
                                                        <ul class="nav nav-treeview" key={index + name}>
                                                            {
                                                                Array.isArray(itm) ? (<>
                                                                    <li class="nav-item has-treeview">
                                                                        <Link  class="nav-link">
                                                                            <i class={css}></i>
                                                                            <p>
                                                                                {label}
                                                                                <i class="right fas fa-angle-left"></i>
                                                                            </p>
                                                                        </Link>
                                                                        <ul class="nav nav-treeview">
                                                                            {itm.map((itmn, index) => (
                                                                                <li class="nav-item" key={index + itmn.name}>
                                                                                    <Link to={"/" + name} class="nav-link">
                                                                                        <i class={css}></i>
                                                                                        <p>{itmn.label}</p>
                                                                                    </Link>
                                                                                </li>

                                                                            ))}
                                                                        </ul>
                                                                    </li>
                                                                </>) : <>
                                                                    <li class="nav-item" key={index + name}>
                                                                    <Link to={"/" + name} class="nav-link"><i class={css}></i>
                                                                            <p>{label}</p>
                                                                            </Link>
                                                                    </li>
                                                                </>
                                                            }
                                                        </ul>
                                                    ))}
                                                </li>) :
                                                <>
                                                    <li class="nav-item has-treeview" key={index + name}>
                                                        <Link to={"/" + name} class="nav-link">
                                                            <i class={css}></i>
                                                            <p>
                                                                {label}
                                                                <i class="right fas"></i>
                                                            </p>
                                                        </Link>
                                                    </li>
                                                </>
                                        }
                                    </li>
                                ))}
                                {/* <Content /> */}
                            </ul>
                        </nav>
                        {/* /.sidebar-menu */}
                    </div>


                    {/* /.sidebar */}
                </aside>

        )
    }
}
