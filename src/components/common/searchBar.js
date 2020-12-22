import React from "react";

class SearchBar extends React.Component {
  state = {
    value: "",
    foundItems: [],
  };

  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value: value,
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.searchState = this.searchState.bind(this);
    this.handleOnResultSelected = this.handleOnResultSelected.bind(this);
    this.setInputText = this.setInputText.bind(this);
  }

  setInputText(value) {
    this.setState({
      value,
    });
  }

  handleOnChange(event) {
    this.setState({
      value: event.target.value,
    });
    this.searchState(event.target.value);
  }

  handleOnBlur() {
    setTimeout(() => {
      this.setState({ foundItems: [] });
    }, 250);
  }

  handleOnFocus() {
    this.searchState(this.state.value);
  }

  searchState(valueToSearch) {
    if (!valueToSearch) {
      this.setState({
        foundItems: [],
      });
      return;
    }
    this.setState({
      foundItems: this.props.data.filter((element) => {
        return element.toLowerCase().match(valueToSearch.toLowerCase());
      }),
    });
  }

  handleOnResultSelected(selectedResult) {
    this.setState({
      foundItems: [],
      value: selectedResult,
    });
    this.props.onChange(selectedResult);
  }

  render() {
    return (
      <div className="searchbar">
        <div className="searchbar-input">
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label full-size">
            <input
              type="text"
              className="mdl-textfield__input"
              placeholder="Enter your search"
              value={this.state.value}
              onInput={this.handleOnChange}
              onBlur={this.handleOnBlur}
              disabled={this.props.disabled}
            />
          </div>
          <i className="material-icons search-icon">search</i>
        </div>
        <div className="results-container">
          <table
            className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp"
            style={{ width: "100%" }}
          >
            <tbody>
              {this.state.foundItems ? (
                this.state.foundItems.map((element, index) => (
                  <tr key={index}>
                    <td
                      className="mdl-data-table__cell--non-numeric"
                      style={{ cursor: "pointer" }}
                      onClick={() => this.handleOnResultSelected(element)}
                    >
                      {element}
                    </td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default SearchBar;
