import React from 'react';
import connect from '@vkontakte/vkui-connect';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './Panels/Home';
import GroupsListView from "./Panels/Groups/GroupsList";
import Root from "@vkontakte/vkui/src/components/Root/Root";
import HomeView from "./Pages/Home/HomeView";

class App extends React.Component {
    constructor(props) {
        super(props);

        console.log('App');
        this.state = {
            activeView: 'home-view',
            activePanel: 'home-index-panel',
            user: null,
            accessToken: null
        };
    }

    componentDidMount() {
        connect.subscribe((e) => {
            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    this.setState({user: e.detail.data});
                    break;
                case 'VKWebAppAccessTokenReceived':
                    console.log('VKWebAppAccessTokenReceived');
                    console.log(e.detail.data);
                    this.setState({accessToken: e.detail.data.access_token});
                    break;
                case 'VKWebAppAccessTokenFailed':
                    console.log('VKWebAppAccessTokenFailed');
                    console.log(e.detail.data);
                    break;
                default:
                    console.log(e.detail.type);
            }
        });
        console.log(process.env, process.env.AUTH_SCOPES);
        connect.send("VKWebAppGetAuthToken", {
            "app_id": parseInt(process.env.VK_APP_ID),
            "scope": process.env.AUTH_SCOPES
        });
        connect.send('VKWebAppGetUserInfo', {});
    }

    go = (e) => {
        const dataset = e.currentTarget.dataset;
        const state = dataset.toPanel
            ? {activePanel: dataset.toPanel}
            : dataset.toView
                ? {activeView: dataset.toView}
                : null;

        console.log('go ', state);
        if (state !== null) {
            this.setState(state)
        }
    };

    render() {
        return (
            <Root activeView={this.state.activeView}>
                <HomeView
                    id="home-view"
                    activePanel={this.state.activePanel}
                    go={this.go}
                />

                <GroupsListView id="groups-list-view"
                                go={this.go}
                                accessToken={this.state.accessToken}
                                user={this.state.user}
                />
            </Root>
        );
    }
}

export default App;
