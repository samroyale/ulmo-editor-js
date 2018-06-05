import React from 'react';
import { Panel, Modal, Grid, Row, Col, ButtonToolbar, ButtonGroup, Button,
    ListGroup, ListGroupItem, Glyphicon, Well, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { newSprite } from '../services/RpgMaps';
import './SpritesModal.css';

const spriteTypes = ['flames', 'rock', 'key', 'door', 'chest', 'coin', 'checkpoint', 'blades', 'beetle', 'wasp'];

const xyRegex = /[^\d-]/g; // can be negative

const numRegex = /\D/g;

/* =============================================================================
 * COMPONENT: SPRITES MODAL
 * =============================================================================
 */
class SpritesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sprites: [],
      editableSprite: null,
      showEditModal: false
    };
  };

  handleSubmit = evt => this.props.onSubmit(this.state.sprites);

  editSprite = index => {
    this.setState({
      editableSprite: this.state.sprites[index],
      showEditModal: true
    });
  };

  deleteSprite = index => {
    var newSprites = [...this.state.sprites];
    newSprites.splice(index, 1);
    this.setState({ sprites: newSprites });
  };

  addSprite = () => {
    this.setState({
      editableSprite: null,
      showEditModal: true
    });
  };

  applySpriteEdit = newSprite => {
    const { sprites } = this.state;
    if (this.state.editableSprite) {
      var index = sprites.indexOf(this.state.editableSprite);
      if (index > -1) {
        var newSprites = [...sprites]
        newSprites[index] = newSprite;
        this.setState({
          sprites: newSprites,
          showEditModal: false
        });
        return;
      }
    }
    this.setState({
      sprites: [...sprites, newSprite],
      showEditModal: false
    });
  };

  closeEditModal = () => this.setState({ showEditModal: false });

  static getDerivedStateFromProps = ({ showModal, sprites }) => {
    if (showModal) {
      return { sprites: [...sprites] };
    }
    return null;
  };

  sprites = () => {
    return this.state.sprites.map((sprite, i) => (
      <SpriteItem
          key={i}
          index={i}
          sprite={sprite}
          onEdit={this.editSprite}
          onDelete={this.deleteSprite} />
    ));
  };

  render = () => {
    const { showModal, onClose } = this.props;
    return (
      <div>
      <Modal show={showModal} onHide={onClose} dialogClassName="sprites-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Sprites</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Panel className="sprites-panel">
            <ListGroup>
              {this.sprites()}
              <ListGroupItem className="sprite-list-item">
                <ButtonToolbar>
                  <Button onClick={this.addSprite}>Add Sprite <Glyphicon glyph="plus" /></Button>
                </ButtonToolbar>
              </ListGroupItem>
            </ListGroup>
          </Panel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
          <Button onClick={onClose}>Cancel</Button>
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
}

/* =============================================================================
 * COMPONENT: SPRITE ITEM
 * =============================================================================
 */
class SpriteItem extends React.Component {

  typeText = spriteType => {
    return spriteType[0].toUpperCase() + spriteType.slice(1);
  };

  locationText = spriteLocation => {
    return spriteLocation
        .map(loc => '[' + loc[0] + ',' + loc[1] + ']')
        .join(' ');
  };

  render = () => {
    const { sprite, index, onEdit, onDelete } = this.props;
    return (
      <ListGroupItem className="sprite-list-item">
        <Grid>
          <Row>
            <Col className="sprite-type-col" lg={1}>
              <Well className="sprite-well" bsSize="small"><b>{this.typeText(sprite.getType())}</b></Well>
            </Col>
            <Col className="sprite-level-col" lg={1}>
              <Well className="sprite-well" bsSize="small">level: {sprite.getLevel()}</Well>
            </Col>
            <Col className="edit-sprite-col" lg={3}>
              <Well className="sprite-well" bsSize="small">
                <div className="sprite-location">{this.locationText(sprite.getLocation())}</div>
              </Well>
            </Col>
            <Col className="edit-sprite-col" lg={2}>
              <ButtonToolbar>
                <Button id={index} onClick={() => onEdit(index)}>
                  <Glyphicon glyph="edit" />
                </Button>
                <Button id={index} onClick={() => onDelete(index)}>
                  <Glyphicon glyph="trash" />
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </Grid>
      </ListGroupItem>
    );
  }
}

/* =============================================================================
 * COMPONENT: SPRITE EDIT MODAL
 * =============================================================================
 */
class SpriteEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = SpriteEditModal._initialState();
  };

  static _initialState = () => {
    return {
      sprite: null,
      typeVal: '',
      levelVal: '',
      locations: []
    }
  }

  handleSubmit = () => this.props.onSubmit(newSprite(
    this.state.typeVal,
    parseInt(this.state.levelVal, 10),
    this.state.locations));

  handleTypeChange = evt => this.setTypeVal(evt.target.value);

  setTypeVal = newTypeVal => this.setState({ typeVal: newTypeVal });

  handleLevelChange = evt => this.setLevelVal(evt.target.value.replace(numRegex, ''));

  setLevelVal = newLevelVal => this.setState({ levelVal: newLevelVal });

  isSpriteValid = (type, level, locations) => {
    return spriteTypes.includes(type) && level.length > 0 && locations.length > 0;
  };

  moveItem = (index, func) => {
    var newLocations = [...this.state.locations];
    var location = newLocations[index];
    func(newLocations, location, index);
    this.setState({ locations: newLocations });
  };

  moveTop = index => {
    this.moveItem(index, (locations, location, index) => {
      if (index > 0) {
        locations.splice(index, 1);
        locations.splice(0, 0, location);
      }
    });
  };

  moveUp = index => {
    this.moveItem(index, (locations, location, index) => {
      if (index > 0) {
        locations.splice(index, 1);
        locations.splice(index - 1, 0, location);
      }
    });
  };

  moveDown = index => {
    this.moveItem(index, (locations, location, index) => {
      if (index < locations.length - 1) {
        locations.splice(index, 1);
        locations.splice(index + 1, 0, location);
      }
    });
  };

  moveBottom = index => {
    this.moveItem(index, (locations, location, index) => {
      if (index < locations.length - 1) {
        locations.splice(index, 1);
        locations.push(location);
      }
    });
  };

  delete = index => {
    this.moveItem(index, (locations, location, index) => {
      locations.splice(index, 1);
    });
  };

  addLocation = (x, y) => this.setState({ locations: [...this.state.locations, [x, y]] });

  static getDerivedStateFromProps = ({ sprite }) => {
    if (sprite) {
      return {
        sprite: sprite,
        typeVal: sprite.getType(),
        levelVal: '' + sprite.getLevel(),
        locations: [...sprite.getLocation()]
      };
    }
    return SpriteEditModal._initialState();
  };

  typeText = spriteType => {
    return spriteType[0].toUpperCase() + spriteType.slice(1);
  };

  modalTitle = () => {
    return this.state.sprite ? 'Edit Sprite' : 'Add Sprite';
  };

  spriteOptions = () => {
    if (this.state.sprite) {
      return spriteTypes.map((type, i) => <option key={i} value={type}>{this.typeText(type)}</option>);
    }
    var typesWithSelect = ['- Select -'].concat(spriteTypes);
    return typesWithSelect.map((type, i) => <option key={i} value={type}>{this.typeText(type)}</option>);
  };

  typeControl = () => {
    return (
      <FormGroup controlId="spriteType">
        <ControlLabel>Type</ControlLabel>
        <FormControl componentClass="select" value={this.state.typeVal} placeholder="type" onChange={this.handleTypeChange}>
          {this.spriteOptions()}
        </FormControl>
      </FormGroup>
    );
  };

  levelControl = ()  => {
    return (
      <FormGroup controlId="spriteLevel">
        <ControlLabel>Level</ControlLabel>
        <FormControl type="text"
                 placeholder="level"
                 value={this.state.levelVal}
                 onChange={this.handleLevelChange} />
      </FormGroup>
    );
  };

  listPosition = (index, lastIndex) => {
    var position = [];
    if (index === 0) {
      position.push('first');
    }
    if (index === lastIndex) {
      position.push('last');
    }
    return position;
  };

  locationItems = () => {
    return this.state.locations.map((loc, i) => {
      var listPosition = this.listPosition(i, this.state.locations.length - 1);
      return (
        <LocationItem key={i}
            index={i}
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
  };

  locationControl = () => {
    return (
      <FormGroup className="location-panel" controlId="spriteType">
        <ControlLabel>Location</ControlLabel>
        <Panel className="location-panel">
          <ListGroup>
            {this.locationItems()}
            <AddLocationItem
                onAddLocation={this.addLocation} />
          </ListGroup>
        </Panel>
      </FormGroup>
    );
  };

  render = () => {
    const { showModal, onClose } = this.props;
    var okDisabled = !this.isSpriteValid(
        this.state.typeVal,
        this.state.levelVal,
        this.state.locations
    );
    return (
      <Modal show={showModal} onHide={onClose} dialogClassName="sprite-edit-modal">
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
          <Button onClick={this.handleSubmit} bsStyle="primary" disabled={okDisabled}>OK</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

/* =============================================================================
 * COMPONENT: SPRITE LOCATION ITEM
 * =============================================================================
 */
const LocationItem = ({
  index,
  position,
  locationX,
  locationY,
  onMoveTop,
  onMoveUp,
  onMoveDown,
  onMoveBottom,
  onDelete }) => {
  var disabledFirst = position.includes('first');
  var disabledLast = position.includes('last');
  return (
    <ListGroupItem className="sprite-list-item">
      <Grid>
        <Row>
          <Col className="edit-sprite-col" lg={1}>
            <Well className="sprite-well" bsSize="small">[{locationX}, {locationY}]</Well>
          </Col>
          <Col className="location-controls-col" lg={2}>
            <ButtonToolbar>
              <ButtonGroup>
                <Button id={index} onClick={() => onMoveTop(index)} disabled={disabledFirst}>
                  <Glyphicon glyph="triangle-top" />
                </Button>
                <Button id={index} onClick={() => onMoveUp(index)} disabled={disabledFirst}>
                  <Glyphicon glyph="menu-up" />
                </Button>
                <Button id={index} onClick={() => onMoveDown(index)} disabled={disabledLast}>
                  <Glyphicon glyph="menu-down" />
                </Button>
                <Button id={index} onClick={() => onMoveBottom(index)} disabled={disabledLast}>
                  <Glyphicon glyph="triangle-bottom" />
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
          <Col className="edit-sprite-col" lg={1}>
            <ButtonToolbar>
              <Button id={index} onClick={() => onDelete(index)}>
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
class AddLocationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xVal: '',
      yVal: ''
    }
  }

  handleXChange = evt => this.setXVal(evt.target.value.replace(xyRegex, ''));

  handleYChange = evt => this.setYVal(evt.target.value.replace(xyRegex, ''));

  setXVal = newXVal => this.setState({ xVal: newXVal });

  setYVal = newYVal => this.setState({ yVal: newYVal });

  isLocationValid = (xVal, yVal) => {
    if (xVal.length === 0 || yVal.length === 0) {
      return false;
    }
    var x = parseInt(this.state.xVal, 10);
    var y = parseInt(this.state.yVal, 10);
    if (isNaN(x) || isNaN(y)) {
      return false;
    }
    return true;
  };

  addLocation = () => this.props.onAddLocation(
    parseInt(this.state.xVal, 10),
    parseInt(this.state.yVal, 10));

  render = () => {
    var addDisabled = !this.isLocationValid(
        this.state.xVal,
        this.state.yVal
    );
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
                <Button onClick={this.addLocation} disabled={addDisabled}>
                  <Glyphicon glyph="plus" />
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </Grid>
      </ListGroupItem>
    );
  }
}

export default SpritesModal;
