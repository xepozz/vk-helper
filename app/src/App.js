import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './Panels/Home';
import Persik from './Panels/Persik';
import GroupsList from "./Panels/Groups/GroupsList";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'home',
			fetchedUser: null,
			groups: [],
		};
	}

	componentDidMount() {
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					this.setState({ fetchedUser: e.detail.data });
					break;
				default:
					console.log(e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
	}

	go = (e) => {
		this.setState({ activePanel: e.currentTarget.dataset.to })
	};

	render() {
		return (
			<View activePanel={this.state.activePanel}>
				<Home id="home" fetchedUser={this.state.fetchedUser} go={this.go} />
				<Persik id="persik" go={this.go} />
				<GroupsList id="groups-list" go={this.go} groups={this.state.groups} />
			</View>
		);
	}
}

export default App;
