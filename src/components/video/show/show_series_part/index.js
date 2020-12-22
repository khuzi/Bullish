import Link from 'next/link';
import React from 'react';
import { ROUTES } from 'src/const';
import { ShowRecord } from 'src/docs/jstypes';

export class SeriesPartWidget extends React.Component {

    render(){
        /**
         * @type {ShowRecord} The series
         */
        let series = this.props.series;
        let showRoute = ROUTES.SERIES_PARTICULAR.replace(":serie-slug", series.showId);
        return <div style={{display:'flex', alignItems:'center', width:'max-content', marginTop:'1em'}}>
            <div>
                Part of &nbsp;&nbsp;
            </div>
            <div>
                <p className="tags" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 0
                }}><span> <Link href={showRoute}>{series.name}</Link></span></p>
            </div>
        </div>
    }
}