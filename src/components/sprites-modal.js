import React from 'react';
import { Panel, Modal, Grid, Row, Col, ButtonToolbar, ButtonGroup, Button,
    ListGroup, ListGroupItem, Glyphicon, Well, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import RpgMapService from '../services/rpg-maps';
import './sprites-modal.css';

const rpgMapService = new RpgMapService();

const spriteTypes = ['flames', 'rock', 'key', 'door', 'chest', 'coin', 'checkpoint', 'blades', 'beetle', 'wasp'];

/* =============================================================================
 * COMPONENT: SPRITES MODAL
 * =============================================================================
 */
const SpritesModal = React.createClass({
  getInitialState: function() {
    return {
      sprites: [],
      editableSprite: null,
      showEditModal: false
    };
  },

  handleSubmit: function(e) {
    this.props.onSubmit(this.state.sprites);
  },

  delete: function(evt) {
    console.log("DELETE: " + evt.currentTarget.id);
    var buttonId = evt.currentTarget.id;
    var index = parseInt(buttonId.slice(3), 10);
    var newSprites = this.state.sprites;
    newSprites.splice(index, 1);
    this.setState({ sprites: newSprites });
  },

  edit: function(evt) {
    console.log("EDIT: " + evt.currentTarget.id);
    var buttonId = evt.currentTarget.id;
    var index = parseInt(buttonId.slice(3), 10);
    this.setState({
      editableSprite: this.state.sprites[index],
      showEditModal: true
    });
  },
  
  applySpriteEdit: function(newSprite) {
    var newSprites = this.state.sprites.slice();
    if (this.state.editableSprite) {
      console.log('EDIT: ' + newSprite);
      var index = this.state.sprites.indexOf(this.state.editableSprite);
      if (index > -1) {
        newSprites.splice(index, 1, newSprite);
        this.setState({
          sprites: newSprites,
          showEditModal: false
        });
        return;
      }
    }
    console.log('NEW: ' + newSprite);
    newSprites.push(newSprite);
    this.setState({
      sprites: newSprites,
      showEditModal: false
    });
  },

  closeEditModal: function() {
    this.setState({
      showEditModal: false
    });
  },

  componentWillMount: function() {
    this.populateStateFromProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this.populateStateFromProps(nextProps);
  },

  populateStateFromProps: function(props) {
    if (props.showModal) {
      this.setState({ sprites: props.sprites.slice() });
    }
  },

  sprites: function() {
    return this.state.sprites.map((sprite, i) => (
      <SpriteItem
          key={i}
          buttonId={'btn' + i}
          sprite={sprite}
          onEdit={this.edit}
          onDelete={this.delete} />
    ));
  },

  render: function() {
    return (
      <div>
      <Modal show={this.props.showModal} onHide={this.props.onClose} dialogClassName="sprites-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Sprites</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Panel className="sprites-panel">
            <ListGroup fill>{this.sprites()}</ListGroup>
          </Panel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      <SpriteEditModal
          showModal={this.state.showEditModal}
          sprite={this.state.editableSprite}
          onSubmit={this.applySpriteEdit}
          onClose={this.closeEditModal} />
      </div>
    );
  }
});

/* =============================================================================
 * COMPONENT: SPRITE ITEM
 * =============================================================================
 */
const SpriteItem = React.createClass({

  typeText: function(spriteType) {
    return spriteType[0].toUpperCase() + spriteType.slice(1);
  },

  locationText: function(spriteLocation) {
    return spriteLocation
        .map(loc => '[' + loc[0] + ',' + loc[1] + ']')
        .join(' ');
  },

  render: function() {
    return (
      <ListGroupItem className="sprite-list-item">
        <Grid>
          <Row>
            <Col className="sprite-type-col" lg={1}>
              <Well className="sprite-well" bsSize="small"><b>{this.typeText(this.props.sprite.getType())}</b></Well>
            </Col>
            <Col className="sprite-level-col" lg={1}>
              <Well className="sprite-well" bsSize="small">level: {this.props.sprite.getLevel()}</Well>
            </Col>
            <Col className="edit-sprite-col" lg={3}>
              <Well className="sprite-well" bsSize="small">
                <div className="sprite-location">{this.locationText(this.props.sprite.getLocation())}</div>
              </Well>
            </Col>
            <Col className="edit-sprite-col" lg={2}>
              <ButtonToolbar>
                <Button id={this.props.buttonId} onClick={this.props.onEdit}>
                  <Glyphicon glyph="edit" />
                </Button>
                <Button id={this.props.buttonId} onClick={this.props.onDelete}>
                  <Glyphicon glyph="trash" />
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </Grid>
      </ListGroupItem>
    );
  }
});

/* =============================================================================
 * COMPONENT: SPRITE EDIT MODAL
 * =============================================================================
 */
const SpriteEditModal = React.createClass({

  _regex: /[^0-9]/g,

  getInitialState: function() {
    return {
      typeVal: null,
      levelVal: null,
      locations: []
    }
  },

  handleSubmit: function() {
    this.props.onSubmit(rpgMapService.newSprite(
      this.state.typeVal,
      this.state.levelVal,
      this.state.locations
    ));
  },

  handleTypeChange: function(event) {
    this.setState({ typeVal: event.target.value });
  },

  handleLevelChange: function(event) {
    this.setLevelVal(event.target.value.replace(this._regex, ''));
  },

  moveItem: function(evt, func) {
    var buttonId = evt.currentTarget.id;
    var index = parseInt(buttonId.slice(3), 10);
    var newLocations = this.state.locations.slice();
    var location = newLocations[index];
    func(newLocations, location, index);
    this.setState({ locations: newLocations });
  },

  moveTop: function(evt) {
    this.moveItem(evt, (locations, location, index) => {
      if (index > 0) {
        locations.splice(index, 1);
        locations.splice(0, 0, location);
      }
    });
  },

  moveUp: function(evt) {
    this.moveItem(evt, (locations, location, index) => {
      if (index > 0) {
        locations.splice(index, 1);
        locations.splice(index - 1, 0, location);
      }
    });
  },

  moveDown: function(evt) {
    this.moveItem(evt, (locations, location, index) => {
      if (index < locations.length - 1) {
        locations.splice(index, 1);
        locations.splice(index + 1, 0, location);
      }
    });
  },

  moveBottom: function(evt) {
    this.moveItem(evt, (locations, location, index) => {
      if (index < locations.length - 1) {
        locations.splice(index, 1);
        locations.push(location);
      }
    });
  },

  delete: function(evt) {
    this.moveItem(evt, (locations, location, index) => {
      locations.splice(index, 1);
    });
  },

  setLevelVal: function(newLevelVal) {
    this.setState({ levelVal: newLevelVal });
  },

  componentWillMount: function() {
    this.populateStateFromProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this.populateStateFromProps(nextProps);
  },

  populateStateFromProps: function(props) {
    if (props.sprite) {
      this.setState({
        typeVal: props.sprite.getType(),
        levelVal: props.sprite.getLevel(),
        locations: props.sprite.getLocation().slice()
      });
      return;
    }
    this.setState(this.getInitialState());
  },

  typeText: function(spriteType) {
    return spriteType[0].toUpperCase() + spriteType.slice(1);
  },

  modalTitle: function() {
    return this.state.typeVal ? 'Edit Sprite' : 'New Sprite';
  },

  typeControl: function() {
    return (
      <FormGroup controlId="spriteType">
        <ControlLabel>Type</ControlLabel>
        <FormControl componentClass="select" value={this.state.typeVal} placeholder="type" onChange={this.handleTypeChange}>
          { spriteTypes.map((type, i) => <option key={i} value={type}>{this.typeText(type)}</option>) }
        </FormControl>
      </FormGroup>
    );
  },

  levelControl: function() {
    return (
      <FormGroup controlId="spriteLevel">
        <ControlLabel>Level</ControlLabel>
        <FormControl type="text"
                 placeholder="level"
                 value={this.state.levelVal}
                 onChange={this.handleLevelChange} />
      </FormGroup>
    );
  },

  listPosition: function(index, lastIndex) {
    var position = [];
    if (index === 0) {
      position.push('first');
    }
    if (index === lastIndex) {
      position.push('last');
    }
    return position;
  },

  locationItems: function() {
    return this.state.locations.map((loc, i) => {
      var listPosition = this.listPosition(i, this.state.locations.length - 1);
      return (
        <SpriteLocationItem key={i}
            buttonId={'btn' + i}
            position={listPosition}
            locationX={loc[0]}
            locationY={loc[1]}
            onMoveTop={this.moveTop}
            onMoveUp={this.moveUp}
            onMoveDown={this.moveDown}
            onMoveBottom={this.moveBottom}
            onDelete={this.delete} />
      );
    });
  },

  locationControl: function() {
    return (
      <FormGroup controlId="spriteType">
        <ControlLabel>Location</ControlLabel>
        <Panel className="location-panel">
          <ListGroup fill>{this.locationItems()}</ListGroup>
        </Panel>
      </FormGroup>
    );
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} dialogClassName="sprites-edit-modal">
        <Modal.Header closeButton>
          <Modal.Title>{this.modalTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <Row>
              <Col lg={2}>{this.typeControl()}</Col>
              <Col lg={2}>{this.levelControl()}</Col>
            </Row>
            <Row>
              <Col lg={4}>{this.locationControl()}</Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: SPRITE LOCATION ITEM
 * =============================================================================
 */
const SpriteLocationItem = React.createClass({
  render: function() {
    var disabledFirst = this.props.position.includes('first');
    var disabledLast = this.props.position.includes('last');
    return (
      <ListGroupItem className="sprite-list-item">
        <Grid>
          <Row>
            <Col className="edit-sprite-col" lg={1}>
              <Well className="sprite-well" bsSize="small">[{this.props.locationX}, {this.props.locationY}]</Well>
            </Col>
            <Col className="sprite-controls-col" lg={2}>
              <ButtonToolbar>
                <ButtonGroup>
                  <Button id={this.props.buttonId} onClick={this.props.onMoveTop} disabled={disabledFirst}>
                    <Glyphicon glyph="triangle-top" />
                  </Button>
                  <Button id={this.props.buttonId} onClick={this.props.onMoveUp} disabled={disabledFirst}>
                    <Glyphicon glyph="menu-up" />
                  </Button>
                  <Button id={this.props.buttonId} onClick={this.props.onMoveDown} disabled={disabledLast}>
                    <Glyphicon glyph="menu-down" />
                  </Button>
                  <Button id={this.props.buttonId} onClick={this.props.onMoveBottom} disabled={disabledLast}>
                    <Glyphicon glyph="triangle-bottom" />
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
            <Col className="edit-sprite-col" lg={1}>
              <ButtonToolbar>
                <Button id={this.props.buttonId} onClick={this.props.onDelete}>
                  <Glyphicon glyph="trash" />
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </Grid>
      </ListGroupItem>
    );
  }
});

export default SpritesModal;
