import React from "react";
import Head from "next/head";

export default class HeadComponent extends React.Component {
  render() {
    return (
      <>
        <Head key="main">
          <title>{this.props.meta.title}</title>

          <script src="https://d3js.org/d3.v5.min.js"></script>
          <script src="/range_slider/d3RangeSlider.js"></script>
          <link href="/range_slider/d3RangeSlider.css" rel="stylesheet" />

          <meta
            name="viewport"
            content="width=device-width, user-scalable=no"
          />
        </Head>
        {(this.props.cssImports ? this.props.cssImports : []).map(
          (element, key) => {
            return (
              <Head key={`head-css-${key}`}>
                <link rel="stylesheet" href={element} />
              </Head>
            );
          }
        )}
        {this.props.meta.tags.map((element, key) => {
          return (
            <Head key={`head-meta-${element.property}`}>
              <meta
                property={element.property}
                key={key}
                content={element.content}
              />
            </Head>
          );
        })}
        {this.props.jsonLD ? (
          <Head key={`jsonld-data`}>
            <script
              type={`application/ld+json`}
              dangerouslySetInnerHTML={{ __html: this.props.jsonLD }}
            ></script>
          </Head>
        ) : (
          <></>
        )}
      </>
    );
  }
}
