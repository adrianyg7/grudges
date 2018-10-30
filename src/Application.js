import React, { Component } from 'react';
import NewGrudge from './NewGrudge';
import Grudges from './Grudges';
import './Application.css';

import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import {
  ListGrudges, CreateGrudge, UpdateGrudge, DeleteGrudge, SubscribeToNewGrudges
} from './graphql';

class Application extends Component {
  state = {
    grudges: [],
  };

  async componentDidMount() {
    const response = await API.graphql(graphqlOperation(ListGrudges));
    const grudges = response.data.listGrudges.items;
    this.setState({ grudges });

    API.graphql(graphqlOperation(SubscribeToNewGrudges)).subscribe({
      next: (response) => {
        const grudge = response.value.data.onCreateGrudge;
        console.log('realtime added', grudge)
        this.setState({ grudges: [grudge, ...this.state.grudges] });
      }
    });
  }

  addGrudge = async (grudge) => {
    const response = await API.graphql(graphqlOperation(CreateGrudge, grudge));
    // const newGrudge = response.data.createGrudge;
    // this.setState({ grudges: [newGrudge, ...this.state.grudges] });
  };

  removeGrudge = async (grudge) => {
    const response = await API.graphql(graphqlOperation(DeleteGrudge, grudge));
    this.setState({
      grudges: this.state.grudges.filter(other => other.id !== grudge.id),
    });
  };

  toggle = async (grudge) => {
    const modGrudge = { ...grudge, avenged: !grudge.avenged };
    const response = await API.graphql(graphqlOperation(UpdateGrudge, modGrudge));
    // const updatedGrudge = await API.put('grudgesCRUD', '/grudges', { body: modGrudge });
    const othergrudges = this.state.grudges.filter(
      other => other.id !== grudge.id,
    );
    this.setState({ grudges: [modGrudge, ...othergrudges] });
  };

  render() {
    const { grudges } = this.state;
    const unavengedgrudges = grudges.filter(grudge => !grudge.avenged);
    const avengedgrudges = grudges.filter(grudge => grudge.avenged);

    return (
      <div className="Application">
        <NewGrudge onSubmit={this.addGrudge} />
        <Grudges
          title="Unavenged Grudges"
          grudges={unavengedgrudges}
          onCheckOff={this.toggle}
          onRemove={this.removeGrudge}
        />
        <Grudges
          title="Avenged Grudges"
          grudges={avengedgrudges}
          onCheckOff={this.toggle}
          onRemove={this.removeGrudge}
        />
      </div>
    );
  }
}

export default withAuthenticator(Application);
