import React from 'react';
import { getUsername } from '../Utils/Common';
import Link from 'next/link';
import { ROUTES } from '../../const';

export default class MDLHeader extends React.Component{
    state = {
        username: null
    }

    componentDidMount(){
        this.setState({
            username: getUsername()
        })
    }

    render(){
        return (
            <header className="mdl-layout__header">
                <div className="mdl-layout__header-row">
                    <div className="mdl-navigation">
                        <Link href={ROUTES.MARKET}>
                            <a className="unstyled-link">
                                <h1>Bullish Twitter Listener</h1>
                            </a>
                        </Link>
                    </div>
                    <div className="mdl-navigation username">
                        {
                            this.state.username ? 
                            <h3>
                                {this.state.username
                                ? `Welcome back, ${this.state.username}`
                                : this.state.username}
                            </h3> : <></>
                        }
                    </div>
                </div>
            </header>
        )
    }
}