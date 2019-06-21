import React from 'react';
import connect from '@vkontakte/vkui-connect';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './Panels/Home';
import GroupsListView from "./Panels/Groups/GroupsList";
import Root from "@vkontakte/vkui/src/components/Root/Root";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'home',
            user: null,
            groups: [],
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
        this.setState({activePanel: e.currentTarget.dataset.to})
    };

    render() {
        return (
            <Root activeView={this.state.activeView}>
                <View activePanel={this.state.activePanel}>
                    <Home id="home" fetchedUser={this.state.user} go={this.go}/>
                </View>
                <GroupsListView id="groups-list"
                                go={this.go}
                                groups={this.state.groups}
                                accessToken={this.state.accessToken} user={this.state.user}/>
            </Root>
        );
    }
}

export default App;
