import { Utils } from '@components/common/util';
import Link from 'next/link';
import React from 'react';
import { ROUTES } from 'src/const';
import CategoryComponent from '../component_category_span';

export class VideoCard extends React.Component {

    render() {
        const {element} = this.props;
        return (
            <div className="video-card">
                <div className="video-card-image">
                    <Link href={`${ROUTES.VIDEO}/${element.mediaid}`}>
                        <a className="play-icon">
                            <i className="fas fa-play-circle"></i>
                        </a>
                    </Link>
                    <Link href={`${ROUTES.VIDEO}/${element.mediaid}`}>
                        <img className="img-fluid" src={element.images[0].src} alt="" />
                    </Link>
                    <div className="time">{Utils.getDuration(element.duration)}</div>
                </div>
                <div className="video-card-body">
                    <div className="video-title">
                        <Link href={`${ROUTES.VIDEO}/${element.mediaid}`}>
                            {element.title}
                        </Link>
                    </div>
                    <div className="video-page tags">
                        {
                            element.tags ? element.tags.split(",").slice(0, 5).map((element, key) =>
                                <CategoryComponent key={`${element.mediaid}-${key}`} element={element}/>
                            ) : <></>
                        }
                    </div>
                    <div className="video-view">
                        {element.views} &nbsp;<i className="fas fa-calendar-alt"></i> {Utils.getTimeSince(element.pubdate*1000)}
                    </div>
                </div>
            </div>
        )
    }
}