import React from 'react';
import { Modal, Grid, Row, Col, Panel, ListGroup, ListGroupItem, ButtonToolbar,
    ButtonGroup, Button, Glyphicon, FormGroup, FormControl,
    Checkbox, Well } from 'react-bootstrap';
import { tileSize } from '../config';
import { getDrawingContext, drawTile, parseLevel } from '../utils';
import './MapModal.css';

// allows 'specials' eg. S1.5, S2 and 'drops' eg. D3-2
const levelRegex = /[^\dSD.-]/g;

const numRegex = /\D/g;

/* =============================================================================
 * COMPONENT: EDIT LEVELS MODAL
 * =============================================================================
 */
export class EditLevelsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = EditLevelsModal.initialState();
  }

  static initialState = () => {
    return {
      levelVal: '',
      levels: [],
      selectedIndices: [],
      addDisabled: true,
      deleteDisabled: true
    };
  }

  handleSubmit = () => this.props.onSubmit(this.state.levels);

  handleLevelChange = evt => this.setLevelVal(evt.target.value.replace(levelRegex, ''));

  setLevelVal = newLevelVal => {
    var levelValid = this.isLevelValid(newLevelVal);
    this.setState({
      levelVal: newLevelVal,
      addDisabled: !levelValid
    });
  };

  isLevelValid = levelVal => {
    try {
      parseLevel(levelVal);
      return true;
    }
    catch (e) {
      // console.log(e.message);
    }
    return false;
  };

  addLevel = () => {
    try {
      let level = this.normalizeLevel(this.state.levelVal)
      if (this.state.levels.includes(level)) {
        return;
      }
      this.setState({
        levelVal: '',
        levels: [...this.state.levels, level],
        addDisabled: true
      });
    }
    catch (e) {
      console.log(e.name + ": " + e.message);
    }
  };

  normalizeLevel = levelStr => {
    let result = parseLevel(levelStr);
    if (result.type === 'special') {
      return `S${result.level}`;
    }
    if (result.type === 'down') {
      return `D${result.level}-${result.drop}`;
    }
    return `${result.level}`;
  };

  delete = index => {
    var newLevels = [...this.state.levels];
    newLevels.splice(index, 1);
    this.setState({
      levelVal: '',
      levels: newLevels
    });
  };

  static getDerivedStateFromProps = ({ showModal, editableTile }) => {
    if (showModal) {
      var initialState = EditLevelsModal.initialState();
      return {
        ...initialState,
        levels: EditLevelsModal.getLevels(editableTile)
      };
    }
    return null;
  };

  static getLevels = editableTile => {
    if (!editableTile) {
      return [];
    }
    // return a copy of the levels array
    return [...editableTile.getLevels()];
  };

  levels = () => {
    return this.state.levels.map((level, i) => {
      return (
        <LevelItem
            key={i}
            index={i}
            level={level}
            onDelete={this.delete} />
      );
    })
  };

  render = () => {
    const { showModal, onClose } = this.props;
    return (
      <Modal show={showModal} onHide={onClose} dialogClassName="tile-levels-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Panel className="edit-levels-panel" header="Levels">
            <ListGroup>
              {this.levels()}
              <ListGroupItem>
                <Grid>
                  <Row>
                    <Col className="edit-level-col" lg={1}>
                      <FormControl type="text"
                                   placeholder="level"
                                   value={this.state.levelVal}
                                   onChange={this.handleLevelChange} />
                    </Col>
                    <Col className="edit-tiles-col" lg={1}>
                      <ButtonToolbar className="sprite-controls">
                        <Button onClick={this.addLevel} disabled={this.state.addDisabled}>
                          <Glyphicon glyph="plus" />
                        </Button>
                      </ButtonToolbar>
                    </Col>
                  </Row>
                </Grid>
              </ListGroupItem>
            </ListGroup>
          </Panel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

/* =============================================================================
 * COMPONENT: LEVEL ITEM
 * =============================================================================
 */
const LevelItem = ({ level, index, onDelete }) => (
  <ListGroupItem>
    <Grid>
      <Row>
        <Col className="edit-level-col" lg={1}>
          <Well className="level-well" bsSize="small">level: {level}</Well>
        </Col>
        <Col className="edit-tiles-col" lg={1}>
          <ButtonToolbar className="sprite-controls">
            <Button onClick={() => onDelete(index)}>
              <Glyphicon glyph="trash" />
            </Button>
          </ButtonToolbar>
        </Col>
      </Row>
    </Grid>
  </ListGroupItem>
);


/* =============================================================================
 * COMPONENT: EDIT IMAGES MODAL
 * =============================================================================
 */
export class EditImagesModal extends React.Component {
  constructor(props) {
    super(props);
    this._previewCanvas = React.createRef();
    this.state = {
      maskTiles: [],
    };
  };

  handleSubmit = () => this.props.onSubmit(this.state.maskTiles);

  moveTile = (index, func) => {
    var newMaskTiles = [...this.state.maskTiles];
    var rIndex = newMaskTiles.length - index - 1;
    var maskTile = newMaskTiles[rIndex];
    func(newMaskTiles, maskTile, rIndex);
    this.setState({ maskTiles: newMaskTiles });
  };

  moveTop = index => {
    this.moveTile(index, (maskTiles, maskTile, index) => {
      if (index < maskTiles.length - 1) {
        maskTiles.splice(index, 1);
        maskTiles.push(maskTile);
      }
    });
  };

  moveUp = index => {
    this.moveTile(index, (maskTiles, maskTile, index) => {
      if (index < maskTiles.length - 1) {
        maskTiles.splice(index, 1);
        maskTiles.splice(index + 1, 0, maskTile);
      }
    });
  };

  moveDown = index => {
    this.moveTile(index, (maskTiles, maskTile, index) => {
      if (index > 0) {
        maskTiles.splice(index, 1);
        maskTiles.splice(index - 1, 0, maskTile);
      }
    });
  };

  moveBottom = index => {
    this.moveTile(index, (maskTiles, maskTile, index) => {
      if (index > 0) {
        maskTiles.splice(index, 1);
        maskTiles.splice(0, 0, maskTile);
      }
    });
  };

  delete = index => {
    this.moveTile(index, (maskTiles, maskTile, index) => {
      maskTiles.splice(index, 1);
    });
  };

  static getDerivedStateFromProps = ({ showModal, editableTile }) => {
    if (showModal) {
      return { maskTiles: EditImagesModal.getMaskTiles(editableTile) };
    }
    return null;
  };

  static getMaskTiles = editableTile => {
    if (!editableTile) {
      return [];
    }
    return editableTile.getMaskTiles();
  };

  componentDidUpdate = (oldProps, oldState) => {
    const { showModal } = this.props;
    if (!showModal) {
      return;
    }
    if (this.updateRequired()) {
      this.forceUpdate(); // need this to populate refs
    }
    var maskTiles = [...this.state.maskTiles].reverse(); // copy + reverse the array
    maskTiles.forEach((maskTile, i) => {
      var item = this.refs[`item${i}`];
      if (item) {
        item.drawToCanvas(maskTile);
      }
    });
    const previewCanvas = this._previewCanvas.current;
    if (previewCanvas) {
      var ctx = getDrawingContext(previewCanvas);
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      ctx.drawImage(drawTile(this.state.maskTiles), 0, 0,
          previewCanvas.width, previewCanvas.height);
    }
  };

  updateRequired = () => {
    return this.state.maskTiles.length > 0 && !this.refs['item0'];
  }

  listPosition = (tileIndex, lastIndex) => {
    var position = [];
    if (tileIndex === 0) {
      position.push('first');
    }
    if (tileIndex === lastIndex) {
      position.push('last');
    }
    return position;
  };

  tileItems = ({ maskTiles }) => {
    return maskTiles.map((maskTile, i) => {
      var listPosition = this.listPosition(i, maskTiles.length - 1);
      return (
        <TileImageItem key={i}
          index={i}
          ref={`item${i}`}
          position={listPosition}
          onMoveTop={this.moveTop}
          onMoveUp={this.moveUp}
          onMoveDown={this.moveDown}
          onMoveBottom={this.moveBottom}
          onDelete={this.delete} />
      );
    });
  };

  render = () => {
    const { showModal, onClose } = this.props;
    return (
      <Modal show={showModal} onHide={onClose} dialogClassName="tile-images-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <Row>
              <Col className="tile-images-col" lg={4}>
                <Panel className="tile-images-panel" header="Images">
                  <ListGroup>{this.tileItems(this.state)}</ListGroup>
                </Panel>
              </Col>
              <Col className="edit-tiles-col" lg={2}>
                <Panel className="tile-preview-panel" header="Preview">
                  <ListGroup>
                    <ListGroupItem className="tile-list-item">
                      <canvas className="tile-preview"
                              width={tileSize * 2}
                              height={tileSize * 2}
                              ref={this._previewCanvas} />
                    </ListGroupItem>
                  </ListGroup>
                </Panel>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

/* =============================================================================
 * COMPONENT: TILE IMAGE ITEM
 * =============================================================================
 */
class TileImageItem extends React.Component {
  constructor(props) {
    super(props);
    this._canvas = React.createRef();
  }

  drawToCanvas = maskTile => {
    const canvas = this._canvas.current;
    var ctx = getDrawingContext(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(maskTile.getTile().getCanvas(), 0, 0, canvas.width, canvas.height);
  };

  render = () => {
    const { position, index, onMoveTop, onMoveUp, onMoveDown, onMoveBottom, onDelete } = this.props;
    var disabledFirst = position.includes('first');
    var disabledLast = position.includes('last');
    return (
      <ListGroupItem className="tile-list-item">
        <Grid>
          <Row>
            <Col className="tile-canvas-col" lg={1}>
              <div className="tile-canvas-container">
                <canvas className="tiles"
                        width={tileSize * 2}
                        height={tileSize * 2}
                        ref={this._canvas} />
              </div>
            </Col>
            <Col className="tile-controls-col" lg={2}>
              <ButtonToolbar className="tile-controls">
                <ButtonGroup>
                  <Button onClick={() => onMoveTop(index)} disabled={disabledFirst}>
                    <Glyphicon glyph="triangle-top" />
                  </Button>
                  <Button onClick={() => onMoveUp(index)} disabled={disabledFirst}>
                    <Glyphicon glyph="menu-up" />
                  </Button>
                  <Button onClick={() => onMoveDown(index)} disabled={disabledLast}>
                    <Glyphicon glyph="menu-down" />
                  </Button>
                  <Button onClick={() => onMoveBottom(index)} disabled={disabledLast}>
                    <Glyphicon glyph="triangle-bottom" />
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
            <Col className="edit-tiles-item-col" lg={1}>
              <ButtonToolbar className="tile-controls">
                <Button onClick={() => onDelete(index)}>
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
 * COMPONENT: EDIT MASKS MODAL
 * =============================================================================
 */
export class EditMasksModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maskTiles: []
    };
  }

  handleSubmit = () => {
    this.state.maskTiles.forEach((maskTile, i) => {
      var item = this.refs[`item${i}`];
      maskTile.setMaskLevel(this.getMaskLevel(item));
    });
    this.props.onSubmit(this.state.maskTiles.reverse());
  };

  getMaskLevel = tileMaskItem => {
    var maskLevel = parseInt(tileMaskItem.state.levelVal, 10);
    if (!maskLevel) {
      return null;
    }
    if (tileMaskItem.state.verticalVal) {
      return `V${maskLevel}`;
    }
    return maskLevel.toString();
  };

  static getDerivedStateFromProps = ({ showModal, editableTile }) => {
    if (showModal) {
      return { maskTiles: EditMasksModal.getMaskTiles(editableTile) };
    }
    return null;
  };

  static getMaskTiles = editableTile => {
    if (!editableTile) {
      return [];
    }
    return editableTile.getMaskTiles().reverse();
  };

  componentDidUpdate = (oldProps, oldState) => {
    const { showModal } = this.props;
    if (!showModal) {
      return;
    }
    if (this.updateRequired()) {
      this.forceUpdate(); // need this to populate refs
    }
    this.state.maskTiles.forEach((maskTile, i) => {
      var item = this.refs[`item${i}`];
      if (item) {
        item.drawToCanvas(maskTile);
      }
    });
  };

  updateRequired = () => {
    return this.state.maskTiles.length > 0 && !this.refs['item0'];
  }

  tileItems = () => {
    return this.state.maskTiles.map((maskTile, i) => {
      var maskLevel = maskTile.getMaskLevel();
      var maskVertical = false;
      if (maskLevel) {
        if (maskLevel.startsWith('V')) {
          maskVertical = true;
          maskLevel = maskLevel.substr(1);
        }
      }
      else {
        maskLevel = '';
      }
      return (
        <TileMaskItem key={i} index={i} ref={`item${i}`} level={maskLevel} vertical={maskVertical} />
      );
    });
  };

  render = () => {
    const { showModal, onClose } = this.props;
    return (
      <Modal show={showModal} onHide={onClose} dialogClassName="tile-masks-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Panel className="tile-masks-panel" header="Masks">
            <ListGroup>{this.tileItems()}</ListGroup>
          </Panel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

/* =============================================================================
 * COMPONENT: TILE MASK ITEM
 * =============================================================================
 */
class TileMaskItem extends React.Component {
  constructor(props) {
    super(props);
    this._canvas = React.createRef();
    this.state = {
      levelVal: '',
      verticalVal: false
    };
  }

  handleLevelChange = evt => this.setState({ levelVal: evt.target.value.replace(numRegex, '') });

  handleVerticalChange = evt => this.setState({ verticalVal: evt.target.checked });

  drawToCanvas = maskTile => {
    const canvas = this._canvas.current;
    var ctx = getDrawingContext(canvas);
    ctx.drawImage(maskTile.getTile().getCanvas(), 0, 0, canvas.width, canvas.height);
  };

  static getDerivedStateFromProps = ({ level, vertical }) => {
    return {
      levelVal: level,
      verticalVal: vertical
    };
  };

  render = () => {
    const { index } = this.props;
    return (
      <ListGroupItem className="tile-list-item">
        <Grid>
          <Row>
            <Col className="tile-canvas-col" lg={1}>
              <div className="tile-canvas-container">
                <canvas className="tiles"
                        width={tileSize * 2}
                        height={tileSize * 2}
                        ref={this._canvas} />
              </div>
            </Col>
            <Col className="edit-tiles-item-col" lg={1}>
              <div className="tile-controls">
                <FormGroup controlId={"levelGroup" + index}>
                  <FormControl type="text" placeholder="level"
                      value={this.state.levelVal} onChange={this.handleLevelChange} />
                </FormGroup>
              </div>
            </Col>
            <Col className="edit-tiles-item-col" lg={1}>
              <div className="tile-checkbox">
                <FormGroup controlId={"verticalGroup" + index}>
                  <Checkbox checked={this.state.verticalVal} onChange={this.handleVerticalChange}>
                    Vertical
                  </Checkbox>
                </FormGroup>
              </div>
            </Col>
          </Row>
        </Grid>
      </ListGroupItem>
    );
  }
}
