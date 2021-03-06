import axios from "axios"; // This will likely need to move
import React from "react";
import Title from "./components/Title";
import Search from "./components/Search";
import Table from "./components/Table";
import Pagination from "./components/Pagination";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      name: "",
      currentPage: 1,
      totalCharacters: "",
      totalPages: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.parseResponse = this.parseResponse.bind(this);
    this.apiFetch = this.apiFetch.bind(this);
  }

  componentDidMount() {
    const searchUrl = "https://swapi.dev/api/people/";
    this.apiFetch(searchUrl);
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({
      name: value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const NEWSEARCH = this.state.name;
    const searchUrl = `https://swapi.dev/api/people/?search=${NEWSEARCH}`;
    this.apiFetch(searchUrl);
  }

  apiFetch(searchUrl) {
    axios
      .get(searchUrl)
      .then(async (response) => {
        const characters = await this.parseResponse(response);
        const totalPages = Math.ceil(response.data.count / 10);
        this.setState({
          tableData: characters,
          name: "",
          totalCharacters: response.data.count,
          totalPages: totalPages,
        });
      })
      .catch((error) => {});
  }

  parseResponse(response) {
    const responseData = response.data.results;

    const finalData = Promise.all(
      responseData.map(async (databit) => {
        if (databit.species.length === 0) {
          databit.species = "Human";
        } else {
          await axios.get(databit.species).then((getspecies) => {
            databit.species = getspecies.data.name;
          });
        }
        await axios.get(databit.homeworld).then((getworld) => {
          databit.homeworld = getworld.data.name;
        });
        return databit;
      })
    );
    return finalData;
  }

  render() {
    return (
      <div className="App border">
        <div className="container">
          <Title />
          <Search
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            name={this.state.name}
          />
          <Table tableData={this.state.tableData} />
          <Pagination
            currentPage={this.state.currentPage}
            totalCharacters={this.state.totalCharacters}
            totalPages={this.state.totalPages}
          />
        </div>
      </div>
    );
  }
}

export default App;
