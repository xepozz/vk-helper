import React from 'react';
import PropTypes from 'prop-types';
import {Panel, ListItem, Button, Group, Div, Avatar, PanelHeader} from '@vkontakte/vkui';

class Home extends React.Component {
    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader>VK Helper</PanelHeader>
                {this.props.fetchedUser &&
                <Group title="Информация о текущем пользователе">
                    <ListItem
                        before={this.props.fetchedUser.photo_200 ?
                            <Avatar src={this.props.fetchedUser.photo_200}/> : null}
                        description={this.props.fetchedUser.city && this.props.fetchedUser.city.title ? this.props.fetchedUser.city.title : ''}
                    >
                        {`${this.props.fetchedUser.first_name} ${this.props.fetchedUser.last_name}`}
                    </ListItem>
                </Group>}

                <Group title="Действия">
                    <Div>
                        <Button size="xl" level="2" onClick={this.props.go} data-to="groups-list-view">
                            Группы, от которых можно отписаться
                        </Button>
                    </Div>
                </Group>
            </Panel>
        );
    }
}


Home.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};

export default Home;
