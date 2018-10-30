import React, { Component } from 'react';
import NewGrudge from './NewGrudge';
import Grudges from './Grudges';
import './Application.css';

import { API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

class Application extends Component {
  state = {
    grudges: [],
  };

  async componentDidMount() {
    const grudges = await API.get('grudgesCRUD', '/grudges');
    this.setState({ grudges });
  }

  addGrudge = async (grudge) => {
    const newGrudge = await API.post('grudgesCRUD', '/grudges', { body: grudge });
    this.setState({ grudges: [grudge, ...this.state.grudges] });
  };

  removeGrudge = async (grudge) => {
    await API.del('grudgesCRUD', `/grudges/object/${grudge.id}`);
    this.setState({
      grudges: this.state.grudges.filter(other => other.id !== grudge.id),
    });
  };

  toggle = async (grudge) => {
    const modGrudge = { ...grudge, avenged: !grudge.avenged };
    const updatedGrudge = await API.put('grudgesCRUD', '/grudges', { body: modGrudge });
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
