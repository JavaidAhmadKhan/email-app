import React, { Component } from "react";
import "./App.css";
import EmailList from "./components/EmailList";
import EmailBody from "./components/EmailBody";
import Scroll from "./components/Scroll";

class App extends Component {
  constructor() {
    super();
    this.state = {
      email: [],
      body: " ",
      currentId: 0,
      currentDate: " ",
      currentSender: " ",
      currentSubject: " ",
      dualPanel: false,
      fav: [],
      filteredByFav: false,
      filteredByRead: false,
      filteredBySearch: false,
      filteredByUnread: false,
      noFilter: true,
      read: [],
      searchField: " ",
    };
  }

  processDate = (date) => {
    let formattedDate = new Date(date);
    const mnth = ("0" + (formattedDate.getMonth() + 1)).slice(-2);
    const day = ("0" + formattedDate.getDate()).slice(-2);
    const hours = ("0" + formattedDate.getHours()).slice(-2);
    const minutes = ("0" + formattedDate.getMinutes()).slice(-2);
    const displayTime = [hours - 12, minutes].join(":");
    const displayDate = [day, mnth, formattedDate.getFullYear()].join("-");
    return [displayDate, " ", displayTime, " ", hours > 12 ? "pm" : "am"];
  };

  onSearchChange = (event) => {
    this.setState({
      searchField: event.target.value,
      filteredBySearch: true,
      filteredByFav: false,
      filteredByRead: false,
      filteredByUnread: false,
      noFilter: true,
    });
  };

  setDualPanel = () => {
    this.setState({ dualPanel: true });
  };

  resetDualPanel = () => {
    this.setState({ dualPanel: false });
  };

  findEmailId = (id) => {
    fetch(`http://localhost:3000/emailbody?id=${id}`)
      .then((data) => data.json())
      .then((data) => this.setState({ body: data[0]["body"] }))
      .catch((err) => console.log(err));

    this.setState({
      currentDate: this.processDate(this.state.email[id - 1].date),
      currentSubject: this.state.email[id - 1].subject,
      currentSender: this.state.email[id - 1].from.name,
      currentId: id - 1,
    });

    if (!this.state.read.includes(parseInt(id - 1))) {
      this.setState({
        read: [...this.state.read, parseInt(id - 1)],
      });
    }
  };

  markAsFav = () => {
    if (!this.state.fav.includes(parseInt(this.state.currentId))) {
      this.setState({
        fav: [...this.state.fav, parseInt(this.state.currentId)],
      });
    }
  };

  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  setFilterByRead = () => {
    this.setState({
      filteredByRead: !this.state.filteredByRead,
      filteredByFav: false,
      filteredByUnread: false,
      filteredBySearch: false,
    });
  };

  setFilterByUnread = () => {
    this.setState({
      filteredByUnread: !this.state.filteredByUnread,
      filteredByFav: false,
      filteredBySearch: false,
      filteredByRead: false,
    });
  };

  setFilterByFav = () => {
    this.setState({
      filteredByFav: !this.state.filteredByFav,
      filteredByRead: false,
      filteredByUnread: false,
      filteredBySearch: false,
    });
  };

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    fetch("https://my-json-server.typicode.com/lalith1403/jsonemaillist/db")
      .then((data) => data.json())
      .then((email) => this.setState({ email: email["list"] }))
      .catch((err) => console.log(err));
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  render() {
    const { email, searchField } = this.state;

    const filterEmails = email.filter((emails) => {
      return emails.short_description
        .toLowerCase()
        .includes(searchField.toLowerCase());
    });

    const filterByRead = email.filter((item) => {
      return this.state.read.includes(parseInt(item.id - 1));
    });

    const filterByUnread = email.filter((item) => {
      return !this.state.read.includes(parseInt(item.id - 1));
    });

    const filterByFav = email.filter((item) => {
      return this.state.fav.includes(parseInt(item.id - 1));
    });

    if (!email.length) {
      return !this.state.dualPanel && <h1>Loading</h1>;
    } else {
      return (
        <div className="dualpanel">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "50px",
              marginTop: "15px",
            }}
          >
            <button
              className={"buttons"}
              style={{
                cursor: "default",
                background: "transparent",
                fontWeight: "bold",
              }}
            >
              FilterBy
            </button>
            <button
              className={
                !this.state.filteredByRead ? "buttons clicked" : "buttons"
              }
              onClick={this.setFilterByRead}
            >
              Inbox
            </button>
            <button
              className={
                !this.state.filteredByUnread ? "buttons clicked" : "buttons"
              }
              onClick={this.setFilterByUnread}
            >
              Spam
            </button>
            <button
              className={
                !this.state.filteredByFav ? "buttons clicked" : "buttons"
              }
              onClick={this.setFilterByFav}
            >
              Favourite
            </button>

            {this.state.dualPanel && (
              <button
                style={{
                  cursor: "pointer",
                  background: "#e54065",
                  border: "1px solid black",
                  width: "80px",
                  outline: "none",
                }}
                onClick={this.resetDualPanel}
              >
                Back
              </button>
            )}
          </div>

          <div
            onClick={this.setDualPanel}
            style={
              this.state.dualPanel
                ? { display: "flex", flexDirection: "row" }
                : {}
            }
          >
            {!filterEmails.length && (
              <div style={{ marginRight: "10em", fontSize: "2em" }}>
                No Emails Found
              </div>
            )}

            {this.state.filteredByRead && (
              <Scroll>
                <EmailList
                  currentCard={this.state.currentId}
                  markfav={this.state.fav}
                  read={this.state.read}
                  email={filterByRead}
                  onClick={this.findEmailId}
                />
              </Scroll>
            )}

            {this.state.filteredByUnread && (
              <Scroll>
                <EmailList
                  currentCard={this.state.currentId}
                  markfav={this.state.fav}
                  read={this.state.read}
                  email={filterByUnread}
                  onClick={this.findEmailId}
                />
              </Scroll>
            )}

            {this.state.filteredByFav && (
              <Scroll>
                <EmailList
                  currentCard={this.state.currentId}
                  markfav={this.state.fav}
                  read={this.state.read}
                  email={filterByFav}
                  onClick={this.findEmailId}
                />
              </Scroll>
            )}

            {this.state.filteredBySearch && (
              <Scroll>
                <EmailList
                  currentCard={this.state.currentId}
                  markfav={this.state.fav}
                  read={this.state.read}
                  email={filterEmails}
                  onClick={this.findEmailId}
                />
              </Scroll>
            )}

            {!this.state.filteredByFav &&
              !this.state.filteredByRead &&
              !this.state.filteredByUnread &&
              !this.state.filteredBySearch &&
              this.state.noFilter && (
                <Scroll>
                  <EmailList
                    currentCard={this.state.currentId}
                    markfav={this.state.fav}
                    read={this.state.read}
                    email={filterEmails}
                    onClick={this.findEmailId}
                  />
                </Scroll>
              )}

            {this.state.dualPanel && filterEmails.length !== 0 && (
              <EmailBody
                markAsFav={this.markAsFav}
                currentSender={this.state.currentSender}
                currentSubject={this.state.currentSubject}
                currentDate={this.state.currentDate}
                currentId={this.state.currentId}
                body={this.state.body}
              />
            )}
          </div>
        </div>
      );
    }
  }
}

export default App;
