import React from 'react';
import Router from 'next/router';
import { Utils } from '@components/common/util';
import Link from 'next/link';
import { ShowSearchBar } from '../search_bar';
import { ROUTES } from 'src/const';

export class ShowHeader extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <nav className="navbar navbar-expand navbar-light bg-white static-top osahan-nav sticky-top">
                &nbsp;&nbsp;
                <Link href={ROUTES.VIDEO}>
                    <a className="navbar-brand mr-1">
                        <img className="img-fluid" alt="" src="/new_logo.png"/>
                    </a>
                </Link>
                <ShowSearchBar formClass="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-5 my-2 my-md-0 osahan-navbar-search"/>

                <ul className="navbar-nav ml-auto ml-md-0 osahan-right-navbar">
                    <li className="nav-item mx-1">
                    </li>
                    <li className="nav-item dropdown no-arrow mx-1">
                        <a
                            className="nav-link dropdown-toggle"
                            href="https://askbootstrap.com/preview/vidoe-v2-3/index.html#"
                            id="alertsDropdown"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <i className="fas fa-bell fa-fw"></i>
                            <span className="badge badge-danger">9+</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="alertsDropdown">
                            <a className="dropdown-item" href="https://askbootstrap.com/preview/vidoe-v2-3/index.html#"
                            ><i className="fas fa-fw fa-edit"></i> &nbsp; Action</a
                            >
                            <a className="dropdown-item" href="https://askbootstrap.com/preview/vidoe-v2-3/index.html#"
                            ><i className="fas fa-fw fa-headphones-alt"></i> &nbsp; Another action</a
                            >
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="https://askbootstrap.com/preview/vidoe-v2-3/index.html#"
                            ><i className="fas fa-fw fa-star"></i> &nbsp; Something else here</a
                            >
                        </div>
                    </li>
                    <li className="nav-item dropdown no-arrow mx-1">
                        <a
                            className="nav-link dropdown-toggle"
                            href="https://askbootstrap.com/preview/vidoe-v2-3/index.html#"
                            id="messagesDropdown"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <i className="fas fa-envelope fa-fw"></i>
                            <span className="badge badge-success">7</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="messagesDropdown">
                            <a className="dropdown-item" href="https://askbootstrap.com/preview/vidoe-v2-3/index.html#"
                            ><i className="fas fa-fw fa-edit"></i> &nbsp; Action</a
                            >
                            <a className="dropdown-item" href="https://askbootstrap.com/preview/vidoe-v2-3/index.html#"
                            ><i className="fas fa-fw fa-headphones-alt"></i> &nbsp; Another action</a
                            >
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="https://askbootstrap.com/preview/vidoe-v2-3/index.html#"
                            ><i className="fas fa-fw fa-star"></i> &nbsp; Something else here</a
                            >
                        </div>
                    </li>
                    <li className="nav-item dropdown no-arrow osahan-right-navbar-user">
                        <a
                            className="nav-link dropdown-toggle user-dropdown-link"
                            href="https://askbootstrap.com/preview/vidoe-v2-3/index.html#"
                            id="userDropdown"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <img alt="Avatar" src="/vidoe_template/img/s1.png" />
						Osahan
					</a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                            <a className="dropdown-item" href="https://askbootstrap.com/preview/vidoe-v2-3/account.html"
                            ><i className="fas fa-fw fa-user-circle"></i> &nbsp; My Account</a
                            >
                            <a className="dropdown-item" href="https://askbootstrap.com/preview/vidoe-v2-3/subscriptions.html"
                            ><i className="fas fa-fw fa-video"></i> &nbsp; Subscriptions</a
                            >
                            <a className="dropdown-item" href="https://askbootstrap.com/preview/vidoe-v2-3/settings.html"
                            ><i className="fas fa-fw fa-cog"></i> &nbsp; Settings</a
                            >
                            <div className="dropdown-divider"></div>
                            <a
                                className="dropdown-item"
                                href="https://askbootstrap.com/preview/vidoe-v2-3/index.html#"
                                data-toggle="modal"
                                data-target="#logoutModal"
                            ><i className="fas fa-fw fa-sign-out-alt"></i> &nbsp; Logout</a
                            >
                        </div>
                    </li>
                </ul>
            </nav>
        )
    }
}