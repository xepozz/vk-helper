import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, HeaderButton, platform, IOS, Avatar, ListItem} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Users from '@vkontakte/icons/dist/24/users';
import Group from "@vkontakte/vkui/src/components/Group/Group";
import List from "@vkontakte/vkui/src/components/List/List";
import Cell from "@vkontakte/vkui/src/components/Cell/Cell";
import Link from "@vkontakte/vkui/src/components/Link/Link";
import connect from "@vkontakte/vkui-connect";

const osname = platform();

class GroupsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'home',
            groupsList: [],
            invalidGroups: [],
        };
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
                    break;
                default:
                    console.log(e.detail.type);
            }
        });
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

    static filterInvalidGroups(groupsList) {
        return groupsList.filter((group, index) => {
            console.log(group.name);
            const isDeactivated = 'deactivated' in group;
            isDeactivated && console.log('isDeactivated');

            const isUserBanned = 'ban_info' in group;
            isUserBanned && console.log('isUserBanned');

            const hasNoPhoto = 'has_photo' in group && parseInt(group.has_photo) === 0;
            hasNoPhoto && console.log('hasNoPhoto');

            const isHiddenFromFeed = 'is_hidden_from_feed' in group;
            isHiddenFromFeed && console.log('isHiddenFromFeed');

            const isMessagesBlocked = 'is_messages_blocked' in group;
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

    createTable = () => {
        const list = [];
        const groups = this.state.invalidGroups;
        const groupCount = groups.length;
        if (groupCount > 0) {
            for (let i = 0; i < groupCount; ++i) {
                let group = groups[i];
                list.push(
                    <Cell key={i}
                          before={group.photo_200 ? <Avatar src={group.photo_200}/> : <Icon24Users/>}>
                        <Link href={"https://vk.com/group" + group.id} target="_blank">{group.name}</Link>
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
                    Сообщества, от которых можно отписаться
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
        id: PropTypes.number.unique,
        name: PropTypes.string,
    })),
    accessToken: PropTypes.string.isRequired,
    user: PropTypes.shape({
        id: PropTypes.number.isRequired
    }).isRequired
};

export default GroupsList;
