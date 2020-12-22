import React from 'react';


export class CountFilter extends React.Component {
    state = {
        value: ""
    }

    constructor(props){
        super(props);
        if(props.value){
            this.setState({
                value: props.value
            });
        }
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleFilterChange(event){
        let value = event.target.value;
        this.setState({
            value: value
        });
        if(this.props.onChange){
            this.props.onChange(value);
        }
    }

    render(){
        const {placeholder} = this.props;
        return (
            <input
                className='filter-counter'
                type="number"
                placeholder={placeholder}
                value={this.value}
                onChange={this.handleFilterChange}/>
        )
    }
}