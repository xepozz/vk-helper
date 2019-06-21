import React from 'react';
import Index from "./Panels/Index";
import {View} from '@vkontakte/vkui';
import PropTypes from "prop-types";

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        console.log('HomeView');
        this.state = {
            activePanel: 'home-index-panel',
        };
    }

    render() {
        return (
            <View id={this.props.id} activePanel={this.state.activePanel}>
                <Index id="home-index-panel" go={this.props.go}/>
            </View>
        );
    }
}

HomeView.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};
export default HomeView;
