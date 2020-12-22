import React from 'react';
import Head from 'next/head';
import { ArticleAuthor } from '@lib/objects/article_author';

export default class AuthorWidget extends React.Component {

    render(){
        /**
         * @type {ArticleAuthor}
         */
        let author = this.props.author;
        return (
            <>
                <Head> <link rel="stylesheet" href="/styles/components/article/author_widget.css" /> </Head>
                <div className={`author-widget-container`} >
                    <div className="author-contact-me">
                        <img src={author.picture_url} alt="" className="img-fluid" />
                        {/* <a href=""><i class="fas fa-user-circle"></i> View Profile</a> */}
                    </div>
                    <div className="author-content">
                        <h2><a href="">{author.name}</a></h2>
    
                        <p>{author.description}</p>
    
                        {/* <p>You can reach {author.name.split(" ")[0]} on Twitter: <a href="">@AuthorTwitter</a></p> */}
                    </div>
                </div>
            </>
        )
    }
}