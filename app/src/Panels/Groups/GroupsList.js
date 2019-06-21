import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, HeaderButton, platform, IOS} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Users from '@vkontakte/icons/dist/24/users';
import Group from "@vkontakte/vkui/src/components/Group/Group";
import List from "@vkontakte/vkui/src/components/List/List";
import Cell from "@vkontakte/vkui/src/components/Cell/Cell";
import Link from "@vkontakte/vkui/src/components/Link/Link";
import connect from "@vkontakte/vkui-connect";
import App from "./../../App";

const osname = platform();

class GroupsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'home',
            groupsList: [],
            token: App.props.accessToken
        };
    }

    componentDidMount() {
        connect.subscribe((e) => {
            switch (e.detail.type) {
                case 'VKWebAppCallAPIMethodResult':
                    console.log('VKWebAppCallAPIMethodResult');
                    console.log(e.detail.data);
                    this.setState({groupsList: e.detail.data});
                    break;
                default:
                    console.log(e.detail.type);
            }
        });
    }

    createTable = () => {
        const list = [];
        const groups = this.state.groupsList;
        const groupCount = groups.length;
        if (groupCount > 0) {
            for (let i = 0; i < groupCount; ++i) {
                let group = groups[i];
                list.push(
                    <Cell before={<Icon24Users/>}>
                        <Link href="/group/{group.id}">{group.name}</Link>
                    </Cell>
                );
            }
        } else {
            list.push(
                <Cell>Групп не обнаружено</Cell>
            );
        }

        return list
    };

    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader
                    left={<HeaderButton onClick={this.props.go} data-to="home">
                        {osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                    </HeaderButton>}
                >
                    Groups list
                </PanelHeader>
                <Group>
                    <List>
                        {this.createTable()}
                    </List>
                </Group>
            </Panel>
        );
    }
}

GroupsList.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    groupsList: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    })),
    VkSdk: PropTypes.object
};

export default GroupsList;
