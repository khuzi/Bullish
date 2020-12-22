import React from 'react';

const CHANNELS = [{
    title: "Channels Name",
    image_src: "/vidoe_template/img/s1.png",
    views: "1.4M",
    description: "382,323 subscribers",
    href: "#"
},{
    title: "Channels Name",
    image_src: "/vidoe_template/img/s2.png",
    views: "1.4M",
    description: "382,323 subscribers",
    href: "#"
},{
    title: "Channels Name",
    image_src: "/vidoe_template/img/s3.png",
    views: "1.4M",
    description: "382,323 subscribers",
    href: "#"
}]


export class ChannelsB extends React.Component {

    render(){
        return (
            <div className="video-block section-padding">
                <div className="row">
                    <div className="col-md-12">
                        <div className="main-title">
                            <div className="btn-group float-right right-action">
                                <a href="#" className="right-action-link text-gray" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Sort by <i className="fa fa-caret-down" aria-hidden="true"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="#"><i className="fas fa-fw fa-star"></i> &nbsp; Top Rated</a>
                                    <a className="dropdown-item" href="#"><i className="fas fa-fw fa-signal"></i> &nbsp; Viewed</a>
                                    <a className="dropdown-item" href="#"><i className="fas fa-fw fa-times-circle"></i> &nbsp; Close</a>
                                </div>
                            </div>
                            <h6>Popular Channels</h6>
                        </div>
                    </div>
                    {
                        CHANNELS.map((element, key) => (
                            <div className="col-xl-3 col-sm-6 mb-3" key={key}>
                                <div className="channels-card">
                                <div className="channels-card-image">
                                    <a href={element.href}><img className="img-fluid" src={element.image_src} alt=""/></a>
                                </div>
                                <div className="channels-card-body">
                                    <div className="channels-title">
                                        <a href="#">{element.title}</a>
                                    </div>
                                    <div className="channels-view">
                                        {element.description}
                                    </div>
                                </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}