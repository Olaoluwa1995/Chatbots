import React from "react";
import { Button } from "antd";
import axios from "axios";
import { connect } from "react-redux";
import Contact from "../../components/Contact";
import * as authActions from "../../store/actions/auth";
import * as navActions from "../../store/actions/nav";
import * as messageActions from "../../store/actions/message";
import { LoadingOutlined } from "@ant-design/icons";

class Sidepanel extends React.Component {
  state = {
    loginForm: true,
  };

  // componentWillReceiveProps(newProps) {
  //   if (newProps.token !== null && newProps.username !== null) {
  //     this.getUserChats(newProps.token, newProps.username);
  //   }
  // }

  // componentDidMount() {
  //   if (this.props.token !== null && this.props.username !== null) {
  //     this.getUserChats(this.props.token, this.props.username);
  //   }
  // }

  // getUserChats = (token, username) => {
  //   axios.defaults.headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Token ${token}`,
  //   };
  //   axios
  //     .get(`http://127.0.0.1:8000/chat/?username=${username}`)
  //     .then((res) => this.setState({ chats: res.data }));
  // };

  waitForAuthDetails() {
    const component = this;
    setTimeout(function () {
      if (
        component.props.token !== null &&
        component.props.token !== undefined
      ) {
        component.props.getUserChats(
          component.props.username,
          component.props.token
        );
        return;
      } else {
        console.log("waiting for authentication details...");
        component.waitForAuthDetails();
      }
    }, 100);
  }

  componentDidMount() {
    this.waitForAuthDetails();
  }

  openAddChatPopup() {
    this.props.addChat();
  }

  changeForm = () => {
    this.setState({ loginForm: !this.state.loginForm });
  };

  authenticate = (e) => {
    e.preventDefault();
    if (this.state.loginForm) {
      this.props.login(e.target.username.value, e.target.password.value);
    } else {
      this.props.signup(
        e.target.username.value,
        e.target.email.value,
        e.target.password1.value,
        e.target.password2.value
      );
    }
  };

  render() {
    const activeChats = this.props.chats.map((c) => {
      return (
        <Contact
          key={c.id}
          name="Harvey"
          picURL="http://emilcarlsson.se/assets/louislitt.png"
          status="busy"
          chatURL={`/${c.id}`}
        />
      );
    });
    return (
      <div id="sidepanel">
        <div id="profile">
          <div className="wrap">
            <img
              id="profile-img"
              src="http://emilcarlsson.se/assets/mikeross.png"
              className="online"
              alt=""
            />
            {this.props.isAuthenticated ? (
              <p>{this.props.username}</p>
            ) : (
              <p>No Name Yet</p>
            )}
            <i
              className="fa fa-chevron-down expand-button"
              aria-hidden="true"
            ></i>
            <div id="status-options">
              <ul>
                <li id="status-online" className="active">
                  <span className="status-circle"></span> <p>Online</p>
                </li>
                <li id="status-away">
                  <span className="status-circle"></span> <p>Away</p>
                </li>
                <li id="status-busy">
                  <span className="status-circle"></span> <p>Busy</p>
                </li>
                <li id="status-offline">
                  <span className="status-circle"></span> <p>Offline</p>
                </li>
              </ul>
            </div>
            <div id="expanded">
              {this.props.loading ? (
                <LoadingOutlined />
              ) : this.props.isAuthenticated ? (
                <Button onClick={() => this.props.logout()} className="authBtn">
                  <span>Logout</span>
                </Button>
              ) : (
                <div>
                  <form method="POST" onSubmit={this.authenticate}>
                    {this.state.loginForm ? (
                      <div>
                        <input
                          name="username"
                          type="text"
                          placeholder="username"
                        />
                        <input
                          name="password"
                          type="password"
                          placeholder="password"
                        />
                      </div>
                    ) : (
                      <div>
                        <input
                          name="username"
                          type="text"
                          placeholder="username"
                        />
                        <input name="email" type="email" placeholder="email" />
                        <input
                          name="password1"
                          type="password"
                          placeholder="password"
                        />
                        <input
                          name="password2"
                          type="password"
                          placeholder="password confirm"
                        />
                      </div>
                    )}

                    <Button htmlType="submit">Authenticate</Button>
                  </form>

                  <Button onClick={this.changeForm}>Switch</Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div id="search">
          <label htmlFor="">
            <i className="fa fa-search" aria-hidden="true"></i>
          </label>
          <input type="text" placeholder="Search contacts..." />
        </div>
        <div id="contacts">
          <ul>{activeChats}</ul>
        </div>
        <div id="bottom-bar">
          <button id="addChat" onClick={() => this.openAddChatPopup()}>
            <i className="fa fa-user-plus fa-fw" aria-hidden="true"></i>{" "}
            <span>Create chat</span>
          </button>
          <button id="settings">
            <i className="fa fa-cog fa-fw" aria-hidden="true"></i>{" "}
            <span>Settings</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    loading: state.auth.loading,
    token: state.auth.token,
    username: state.auth.username,
    chats: state.message.chats,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (userName, password) =>
      dispatch(authActions.authLogin(userName, password)),
    logout: () => dispatch(authActions.logout()),
    signup: (username, email, password1, password2) =>
      dispatch(authActions.authSignup(username, email, password1, password2)),
    addChat: () => dispatch(navActions.openAddChatPopup()),
    getUserChats: (username, token) =>
      dispatch(messageActions.getUserChats(username, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidepanel);
