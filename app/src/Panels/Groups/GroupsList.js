import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, HeaderButton, platform, IOS} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24User from '@vkontakte/icons/dist/24/user';
import Group from "@vkontakte/vkui/src/components/Group/Group";
import List from "@vkontakte/vkui/src/components/List/List";
import Cell from "@vkontakte/vkui/src/components/Cell/Cell";

const osname = platform();

class GroupsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: 'home',
            fetchedUser: null,
            groups: [],
        };
    }

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
                        {/*{groups}*/}
                        <Cell before={<Icon24User/>}>Учетная запись</Cell>
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
};

export default GroupsList;
