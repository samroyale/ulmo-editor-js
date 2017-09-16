import React from 'react';
import { Panel, Modal, Grid, Row, Col, ButtonToolbar, ButtonGroup, Button,
    ListGroup, ListGroupItem, Glyphicon, Well, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import RpgMapService from '../services/rpg-maps';
import './sprites-modal.css';

const rpgMapService = new RpgMapService();

const spriteTypes = ['flames', 'rock', 'key', 'door', 'chest', 'coin', 'checkpoint', 'blades', 'beetle', 'wasp'];

const numRegex = /[^0-9]/g;

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

  deleteSprite: function(evt) {
    var buttonId = evt.currentTarget.id;
    var index = parseInt(buttonId.slice(3), 10);
    var newSprites = this.state.sprites;
    newSprites.splice(index, 1);
    this.setState({ sprites: newSprites });
  },

  addSprite: function() {
    this.setState({
      editableSprite: null,
      showEditModal: true
    });
  },

  editSprite: function(evt) {
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
          onEdit={this.editSprite}
          onDelete={this.deleteSprite} />
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
            <ListGroup fill>
              {this.sprites()}
              <ListGroupItem className="sprite-list-item">
                <ButtonToolbar>
                  <Button onClick={this.addSprite}>Add Sprite</Button>
                </ButtonToolbar>
              </ListGroupItem>
            </ListGroup>
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

  getInitialState: function() {
    return {
      sprite: null,
      typeVal: '',
      levelVal: '',
      locations: [],
      okDisabled: true
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
    this.setTypeVal(event.target.value);
  },

  setTypeVal: function(newTypeVal) {
    var spriteValid = this.isSpriteValid(newTypeVal, this.state.levelVal, this.state.locations);
    this.setState({
      typeVal: newTypeVal,
      okDisabled: !spriteValid
    });
  },

  handleLevelChange: function(event) {
    this.setLevelVal(event.target.value.replace(numRegex, ''));
  },

  setLevelVal: function(newLevelVal) {
    var spriteValid = this.isSpriteValid(this.state.typeVal, newLevelVal, this.state.locations);
    this.setState({
      levelVal: newLevelVal,
      okDisabled: !spriteValid
    });
  },

  isSpriteValid: function(type, level, locations) {
    return spriteTypes.includes(type) && level.length > 0 && locations.length > 0;
  },

  moveItem: function(evt, func) {
    var buttonId = evt.currentTarget.id;
    var index = parseInt(buttonId.slice(3), 10);
    var newLocations = this.state.locations.slice();
    var location = newLocations[index];
    func(newLocations, location, index);
    var spriteValid = this.isSpriteValid(this.state.typeVal, this.state.levelVal, newLocations);
    this.setState({
      locations: newLocations,
      okDisabled: !spriteValid
    });
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

  addLocation: function(x, y) {
    var newLocations = this.state.locations.slice();
    newLocations.push([x, y]);
    var spriteValid = this.isSpriteValid(this.state.typeVal, this.state.levelVal, newLocations);
    this.setState({
      locations: newLocations,
      okDisabled: !spriteValid
    });
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
        sprite: props.sprite,
        typeVal: props.sprite.getType(),
        levelVal: props.sprite.getLevel(),
        locations: props.sprite.getLocation().slice(),
        okDisabled: false
      });
      return;
    }
    this.setState(this.getInitialState());
  },

  typeText: function(spriteType) {
    return spriteType[0].toUpperCase() + spriteType.slice(1);
  },

  modalTitle: function() {
    return this.state.sprite ? 'Edit Sprite' : 'Add Sprite';
  },

  spriteOptions: function() {
    if (this.state.sprite) {
      return spriteTypes.map((type, i) => <option key={i} value={type}>{this.typeText(type)}</option>);
    }
    var typesWithSelect = ['- Select -'].concat(spriteTypes);
    return typesWithSelect.map((type, i) => <option key={i} value={type}>{this.typeText(type)}</option>);
  },

  typeControl: function() {
    return (
      <FormGroup controlId="spriteType">
        <ControlLabel>Type</ControlLabel>
        <FormControl componentClass="select" value={this.state.typeVal} placeholder="type" onChange={this.handleTypeChange}>
          {this.spriteOptions()}
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
        <LocationItem key={i}
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
      <FormGroup className="location-panel" controlId="spriteType">
        <ControlLabel>Location</ControlLabel>
        <Panel className="location-panel">
          <ListGroup fill>
            {this.locationItems()}
            <AddLocationItem
                onAddLocation={this.addLocation} />
          </ListGroup>
        </Panel>
      </FormGroup>
    );
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose} dialogClassName="sprite-edit-modal">
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
          <Button onClick={this.handleSubmit} bsStyle="primary" disabled={this.state.okDisabled}>OK</Button>
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
function LocationItem(props) {
  var disabledFirst = props.position.includes('first');
  var disabledLast = props.position.includes('last');
  return (
    <ListGroupItem className="sprite-list-item">
      <Grid>
        <Row>
          <Col className="edit-sprite-col" lg={1}>
            <Well className="sprite-well" bsSize="small">[{props.locationX}, {props.locationY}]</Well>
          </Col>
          <Col className="location-controls-col" lg={2}>
            <ButtonToolbar>
              <ButtonGroup>
                <Button id={props.buttonId} onClick={props.onMoveTop} disabled={disabledFirst}>
                  <Glyphicon glyph="triangle-top" />
                </Button>
                <Button id={props.buttonId} onClick={props.onMoveUp} disabled={disabledFirst}>
                  <Glyphicon glyph="menu-up" />
                </Button>
                <Button id={props.buttonId} onClick={props.onMoveDown} disabled={disabledLast}>
                  <Glyphicon glyph="menu-down" />
                </Button>
                <Button id={props.buttonId} onClick={props.onMoveBottom} disabled={disabledLast}>
                  <Glyphicon glyph="triangle-bottom" />
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
          <Col className="edit-sprite-col" lg={1}>
            <ButtonToolbar>
              <Button id={props.buttonId} onClick={props.onDelete}>
                <Glyphicon glyph="trash" />
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
      </Grid>
    </ListGroupItem>
  );
};

/* =============================================================================
 * COMPONENT: ADD LOCATION ITEM
 * =============================================================================
 */
const AddLocationItem = React.createClass({

  getInitialState: function() {
    return {
      xVal: '',
      yVal: '',
      addDisabled: true
    }
  },

  handleXChange: function(event) {
    this.setXVal(event.target.value.replace(numRegex, ''));
  },

  handleYChange: function(event) {
    this.setYVal(event.target.value.replace(numRegex, ''));
  },

  setXVal: function(newXVal) {
    var locationValid = this.isLocationValid(newXVal, this.state.yVal);
    this.setState({
      xVal: newXVal,
      addDisabled: !locationValid
    });
  },

  setYVal: function(newYVal) {
    var locationValid = this.isLocationValid(this.state.xVal, newYVal);
    this.setState({
      yVal: newYVal,
      addDisabled: !locationValid
    });
  },

  isLocationValid: function(xVal, yVal) {
    return xVal.length > 0 && yVal.length > 0;
  },

  addLocation: function() {
    this.props.onAddLocation(this.state.xVal, this.state.yVal);
  },

  render: function() {
    return (
      <ListGroupItem>
        <Grid>
          <Row>
            <Col className="location-coord-col" lg={1}>
              <FormControl type="text"
                           placeholder="x"
                           value={this.state.xVal}
                           onChange={this.handleXChange} />
            </Col>
            <Col className="location-coord-col" lg={1}>
              <FormControl type="text"
                           placeholder="y"
                           value={this.state.yVal}
                           onChange={this.handleYChange} />
            </Col>
            <Col className="add-location-col" lg={1}>
              <ButtonToolbar className="sprite-controls">
                <Button onClick={this.addLocation} disabled={this.state.addDisabled}>
                  <Glyphicon glyph="plus" />
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
