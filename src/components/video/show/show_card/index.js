import React, { Component } from "react";
import Link from "next/link";
import { ROUTES } from "src/const";


export class ShowCard extends Component {

	render() {
		const { created_at, description, id, meta, name, poster_image_url, profile_picture_url, showId, updated_at } = this.props;
		let showRoute = ROUTES.SERIES_PARTICULAR.replace(":serie-slug", showId);
		return (
			<div className="showCard">
				<div className="banner-container">
					<Link href={showRoute}>
						<img src={meta.portrait_image || poster_image_url} alt='magyk' className="showBanner"></img>
					</Link>
				</div>
				<Link href={showRoute}>
					<div className="subscribe" className="subscribe">Watch Now</div>
				</Link>
				<h4 className="showName">{name}</h4>
				<p className="subscribers">{description}</p>
			</div>
		)
	}
}

