import React from 'react';
import connect from '@vkontakte/vkui-connect';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './Panels/Home';
import GroupsList from "./Panels/Groups/GroupsList";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'home',
            fetchedUser: null,
            groups: [],
            accessToken: null
        };
    }

    componentDidMount() {
        connect.subscribe((e) => {
            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    this.setState({fetchedUser: e.detail.data});
                    break;
                case 'VKWebAppAccessTokenReceived':
                    console.log('VKWebAppAccessTokenReceived');
                    console.log(e.detail, e.detail.data, e.detail.data.access_token);
                    this.setState({accessToken: e.detail.data.access_token});
                    break;
                case 'VKWebAppAccessTokenFailed':
                    console.log('VKWebAppAccessTokenFailed');
                    console.log(e.detail, e.detail.data);
                    break;
                default:
                    console.log(e.detail.type);
            }
        });
        connect.send("VKWebAppGetAuthToken", {app_id: process.env.VK_APP_ID, scope: process.env.AUTH_SCOPES});
        connect.send('VKWebAppGetUserInfo', {});
    }

    go = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    };

    render() {
        return (
            <View activePanel={this.state.activePanel}>
                <Home id="home" fetchedUser={this.state.fetchedUser} go={this.go}/>
                <GroupsList id="groups-list" go={this.go} groups={this.state.groups}/>
            </View>
        );
    }
}

export default App;
