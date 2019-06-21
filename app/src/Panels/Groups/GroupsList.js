import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, HeaderButton, platform, IOS, Avatar, ListItem} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Users from '@vkontakte/icons/dist/24/users';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import Group from "@vkontakte/vkui/src/components/Group/Group";
import List from "@vkontakte/vkui/src/components/List/List";
import Cell from "@vkontakte/vkui/src/components/Cell/Cell";
import Link from "@vkontakte/vkui/src/components/Link/Link";
import connect from "@vkontakte/vkui-connect";
import Div from "@vkontakte/vkui/src/components/Div/Div";
import Button from "@vkontakte/vkui/src/components/Button/Button";
import {FormLayout} from "@vkontakte/vkui/src";
import ScreenSpinner from "@vkontakte/vkui/src/components/ScreenSpinner/ScreenSpinner";
import Alert from "@vkontakte/vkui/src/components/Alert/Alert";
import View from "@vkontakte/vkui/src/components/View/View";

const osname = platform();

class GroupsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popout: null,
            activePanel: 'home',
            groupsList: [],
            invalidGroups: [],
            selectedGroups: {}
        };
        this.onChange = this.onChange.bind(this);
        this.closePopout = this.closePopout.bind(this);
        this.setSpinner = this.setSpinner.bind(this);
    }

    componentDidMount() {
        connect.subscribe((e) => {
            switch (e.detail.type) {
                case 'VKWebAppCallAPIMethodResult':
                    console.log('VKWebAppCallAPIMethodResult');
                    const response = e.detail.data.response;
                    const groupsList = response.items;
                    console.log(response, groupsList);
                    this.setState({groupsList: groupsList});
                    const invalidGroups = GroupsList.filterInvalidGroups(groupsList);
                    console.log(invalidGroups);
                    this.setState({invalidGroups: invalidGroups});
                    this.setSpinner(false);
                    break;
                default:
                    console.log(e.detail.type);
            }
        });
        this.setSpinner(true);
        connect.send("VKWebAppCallAPIMethod", {
            "method": "groups.get",
            "request_id": Math.random(),
            "params": {
                "fields": "activity,is_hidden_from_feed,is_messages_blocked,member_status,verified,deactivated,ban_info,has_photo",
                "user_ids": this.props.user.id,
                "extended": true,
                "v": process.env.VK_API_VERSION,
                "access_token": this.props.accessToken
            }
        });
    }

    setSpinner(isActive) {
        const popout = isActive ? <ScreenSpinner/> : null;
        this.setState({popout: popout});
    }

    static filterInvalidGroups(groupsList) {
        return groupsList.filter((group, index) => {
            console.log(group.name);
            const isDeactivated = 'deactivated' in group;
            isDeactivated && console.log('isDeactivated');

            const isUserBanned = 'ban_info' in group;
            isUserBanned && console.log('isUserBanned');

            const hasNoPhoto = 'has_photo' in group && parseInt(group.has_photo) === 0;
            hasNoPhoto && console.log('hasNoPhoto');

            const isHiddenFromFeed = 'is_hidden_from_feed' in group && parseInt(group.is_hidden_from_feed) === 1;
            isHiddenFromFeed && console.log('isHiddenFromFeed');

            // этот флаг "1" не только тогда, когда тебя кинули в чс, но и тогда, когда ты "не разрешил сообщения"
            const isMessagesBlocked = false;//'is_messages_blocked' in group && parseInt(group.is_messages_blocked) === 1;
            isMessagesBlocked && console.log('isMessagesBlocked');

            const statuses = [
                0, // — не является участником;
                // 1, // — является участником;
                2, // — не уверен, что посетит мероприятие;
                3, // — отклонил приглашение;
                4, // — запрос на вступление отправлен;
                // 5, // — приглашен.
            ];
            const invalidMemberStatus = 'member_status' in group && statuses.includes(group.member_status);
            invalidMemberStatus && console.log('invalidMemberStatus');

            const smallMembersCount = 'members_count' in group && group.members_count < 5;
            smallMembersCount && console.log('smallMembersCount');

            const isEventPassed = 'finish_date' in group && group.finish_date < (new Date()).getTime();
            isEventPassed && console.log('isEventPassed');

            return isDeactivated || isUserBanned || hasNoPhoto || isHiddenFromFeed || isMessagesBlocked ||
                isEventPassed || invalidMemberStatus || smallMembersCount;
        });
    }

    unsubscribe = () => {
        const items = this.getSelectedGroups();
        const activeItems = Object.keys(items).filter((id) => !!(items[id]));
        // groups that needs to unsubscribe
        const groupNames = this.state.groupsList.filter((index, group) => activeItems.includes(group.id)).join(', ');

        this.setState({
            popout:
                <Alert
                    actionsLayout="vertical"
                    actions={[{
                        title: 'Отписаться',
                        autoclose: true,
                        style: 'destructive'
                    }, {
                        title: 'Отмена',
                        autoclose: true,
                        style: 'cancel'
                    }]}
                    onClose={this.closePopout}
                >
                    <h2>Подтвердите действие</h2>
                    <p>Вы действительно хотите отписаться от следующих сообществ/событий: {groupNames}?</p>
                </Alert>
        });
        console.log(activeItems)
    };

    onChange(e) {
        const control = e.currentTarget;
        const dataset = control.dataset;
        const items = this.getSelectedGroups();
        items[dataset.groupId] = control.checked;
        this.setState({items: items});
    }

    getSelectedGroups() {
        return this.state.selectedGroups;
    }

    createTable = () => {
        const list = [];
        const groups = this.state.invalidGroups;
        const groupCount = groups.length;
        if (groupCount > 0) {
            for (let i = 0; i < groupCount; ++i) {
                let group = groups[i];
                list.push(
                    <Cell key={i} selectable data-group-id={group.id} onChange={this.onChange}
                          before={group.photo_200 ? <Avatar src={group.photo_200}/> : <Icon24Users/>}>
                        <Link href={"https://vk.com/group" + group.id} target="_blank">{group.name}</Link>
                    </Cell>
                );
            }
            list.push(
                <Div>
                    <Button size="xl" level="primary" onClick={this.unsubscribe}
                            before={<Icon24Delete/>}>Отписаться</Button>
                </Div>
            )
        } else {
            list.push(
                <Cell>Групп не обнаружено</Cell>
            );
        }

        return list
    };

    render() {
        const table = this.createTable();

        return (
            <View popout={this.state.popout} activePanel={this.props.id}>
                <Panel id={this.props.id}>
                    <PanelHeader
                        left={<HeaderButton onClick={this.props.go} data-to="home">
                            {osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                        </HeaderButton>}
                    >
                        Сообщества, от которых можно отписаться
                    </PanelHeader>
                    <Group>
                        <List>
                            {table}
                        </List>
                    </Group>
                </Panel>
            </View>
        );
    }
}

GroupsList.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    groupsList: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.unique,
        name: PropTypes.string,
    })),
    accessToken: PropTypes.string.isRequired,
    user: PropTypes.shape({
        id: PropTypes.number.isRequired
    }).isRequired
};

export default GroupsList;
