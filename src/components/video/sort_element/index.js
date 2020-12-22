import React from 'react';

export class SortElement extends React.Component {

    render() {
        return (
            <div className="btn-group float-right right-action">
                <a href="#" className="right-action-link text-gray" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Sort by <i className="fa fa-caret-down" aria-hidden="true"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                    <a className="dropdown-item" href="#" name="publish_start_date" onClick={this.props.sort}><i className="fas fa-calendar-alt"></i> &nbsp; Created</a>
                    <a className="dropdown-item" href="#" name="duration" onClick={this.props.sort}><i className="fas fa-clock"></i> &nbsp; Duration</a>
                    <a className="dropdown-item" href="#"><i className="fas fa-fw fa-times-circle"></i> &nbsp; Close</a>
                </div>
            </div>
        );
    }
}