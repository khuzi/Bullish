import { Article } from '@lib/objects/article';
import React from 'react';
import * as moment from 'moment';
import AuthorWidget from '../author_widget';


export class ArticleItem extends React.Component {


    formattedDate(date){
        return moment(date).format("MMMM D, YYYY")
    }

    render(){
        /**
         * @type {Article} The article to be used
         */
        let article = this.props.item;

        function decodeHtmlCharCodes(str) { 
            return str.replace(/(&#(\d+);)/g, function(match, capture, charCode) {
              return String.fromCharCode(charCode);
            });
          }

        return (
            <div class="card blog mb-4">
                <div class="blog-header">
                    <img class="card-img-top" src={article.featured.link} alt={article.featured.alt_text || "Blog Main Image"}/>
                </div>
                <div class="card-body">
                    <h5 class="card-title">{decodeHtmlCharCodes(article.title)}</h5>
                    <div class="entry-meta">
                        <ul class="tag-info list-inline">
                            <li class="list-inline-item"><i class="fas fa-calendar"></i> {this.formattedDate(article.date)}</li>
                            <li class="list-inline-item"><i class="fas fa-comment"></i> {article.commentCount} Comments</li>
                        </ul>
                    </div>
                    <div class="body" dangerouslySetInnerHTML={{__html:article.content}}>
                    </div>
                    <footer class="entry-footer">
                        <div class="blog-post-tags">
                            <ul class="list-inline">
                                <li class="list-inline-item"><i class="fas fa-tag"></i> Tags: </li>
                                {
                                    article.tags.map((tag)=>(
                                        <li class="list-inline-item"><a rel="tag" href="#">{tag.name}</a></li>
                                    ))
                                }
                            </ul>
                        </div>
                        <AuthorWidget author={article.author} />
                    </footer>
                </div>
            </div>
        )
    }
}