var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    tileSize = require('../config.js').tileSize,
    getDrawingContext = require('../utils.js').getScalableDrawingContext;

var Modal = Bootstrap.Modal,
    Grid = Bootstrap.Grid,
    Row = Bootstrap.Row,
    Col = Bootstrap.Col,
    Panel = Bootstrap.Panel,
    ListGroup = Bootstrap.ListGroup,
    ListGroupItem = Bootstrap.ListGroupItem,
    ButtonToolbar = Bootstrap.ButtonToolbar,
    ButtonGroup = Bootstrap.ButtonGroup,
    Button = Bootstrap.Button,
    Glyphicon = Bootstrap.Glyphicon,
    FormGroup = Bootstrap.FormGroup,
    Input = Bootstrap.Input,
    Checkbox = Bootstrap.Checkbox;

/* =============================================================================
 * COMPONENT: EDIT TILES MODAL
 * =============================================================================
 */
const EditImagesModal = React.createClass({
  _previewCanvas: null,

  moveTile: function(evt, func) {
    var buttonId = evt.currentTarget.id;
    var maskTiles = this.props.editableTile.getMaskTiles();
    var index = maskTiles.length - parseInt(buttonId.slice(3), 10) - 1;
    var maskTile = maskTiles[index];
    func(maskTiles, maskTile, index);
    this.forceUpdate();
  },

  moveTop: function(evt) {
    this.moveTile(evt, (maskTiles, maskTile, index) => {
      if (index < maskTiles.length - 1) {
        maskTiles.splice(index, 1);
        maskTiles.push(maskTile);
      }
    });
  },

  moveUp: function(evt) {
    this.moveTile(evt, (maskTiles, maskTile, index) => {
      if (index < maskTiles.length - 1) {
        maskTiles.splice(index, 1);
        maskTiles.splice(index + 1, 0, maskTile);
      }
    });
  },

  moveDown: function(evt) {
    this.moveTile(evt, (maskTiles, maskTile, index) => {
      if (index > 0) {
        maskTiles.splice(index, 1);
        maskTiles.splice(index - 1, 0, maskTile);
      }
    });
  },

  moveBottom: function(evt) {
    this.moveTile(evt, (maskTiles, maskTile, index) => {
      if (index > 0) {
        maskTiles.splice(index, 1);
        maskTiles.splice(0, 0, maskTile);
      }
    });
  },

  delete: function(evt) {
    this.moveTile(evt, (maskTiles, maskTile, index) => {
      maskTiles.splice(index, 1);
    });
  },

  componentDidUpdate: function(oldProps, oldState) {
    if (!this.props.editableTile) {
      return;
    }
    var maskTiles = this.props.editableTile.getMaskTiles();
    if (maskTiles.length === 0) {
      return;
    }
    maskTiles = maskTiles.slice(0).reverse(); // copy + reverse the array
    maskTiles.forEach((maskTile, i) => {
      var item = this.refs["item" + i];
      if (item) {
        item.drawToCanvas(maskTile);
      }
    });
    if (this._previewCanvas) {
      var ctx = getDrawingContext(this._previewCanvas);
      ctx.clearRect(0, 0, this._previewCanvas.width, this._previewCanvas.height);
      ctx.drawImage(this.props.editableTile.getCanvas(), 0, 0, this._previewCanvas.width, this._previewCanvas.height);
    }
  },

  tilePosition: function(tileIndex, lastIndex) {
    var position = [];
    if (tileIndex === 0) {
      position.push("first")
    }
    if (tileIndex === lastIndex) {
      position.push("last")
    }
    return position;
  },

  tileListGroup: function() {
    if (!this.props.editableTile) {
      return <ListGroup fill />;
    }
    var maskTiles = this.props.editableTile.getMaskTiles();
    if (maskTiles.length === 0) {
      return <ListGroup fill />;
    }
    var tileItems = maskTiles.map((maskTile, i) => {
      var tilePosition = this.tilePosition(i, maskTiles.length - 1);
      return (
        <TileImageItem key={i}
          ref={"item" + i}
          buttonId={"btn" + i}
          position={tilePosition}
          onMoveTop={this.moveTop}
          onMoveUp={this.moveUp}
          onMoveDown={this.moveDown}
          onMoveBottom={this.moveBottom}
          onDelete={this.delete} />
      );
    });
    return (<ListGroup fill>{tileItems}</ListGroup>);
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <Row>
              <Col className="edit-tiles-col" lg={4}>
                <Panel className="tile-images-panel" header="Images">
                  {this.tileListGroup()}
                </Panel>
              </Col>
              <Col className="edit-tiles-col" lg={2}>
                <Panel className="tile-preview-panel" header="Preview">
                  <canvas className="tiles tile-preview" width={tileSize * 2} height={tileSize * 2}
                      ref={cvs => this._previewCanvas = cvs} />
                </Panel>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button onClick={this.props.onSubmit} bsStyle="primary">OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: TILE IMAGE ITEM
 * =============================================================================
 */
const TileImageItem = React.createClass({
  _canvas: null,

  drawToCanvas: function(maskTile) {
    var ctx = getDrawingContext(this._canvas);
    ctx.drawImage(maskTile.getTile().getCanvas(), 0, 0, this._canvas.width, this._canvas.height);
  },

  render: function() {
    var disabledFirst = this.props.position.includes("first");
    var disabledLast = this.props.position.includes("last");
    return (
      <ListGroupItem>
        <Grid>
          <Row>
            <Col className="edit-tiles-item-col" lg={1}>
              <div className="tile-canvas-container">
                <canvas className="tiles" width={tileSize * 2} height={tileSize * 2}
                    ref={cvs => this._canvas = cvs} />
              </div>
            </Col>
            <Col className="edit-tiles-item-col" lg={2}>
              <ButtonToolbar className="tile-buttons">
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
            <Col className="edit-tiles-item-col" lg={1}>
              <ButtonToolbar className="tile-buttons">
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
 * COMPONENT: EDIT MASKS MODAL
 * =============================================================================
 */
const EditMasksModal = React.createClass({
  handleSubmit: function() {
    var maskTiles = this.props.editableTile.getMaskTiles();
    var maskLevels = [];
    var i = 0;
    var item = this.refs["item" + i];
    while (item) {
      var maskTile = maskTiles[maskTiles.length - i - 1];
      maskTile.setMaskLevel(this.getMaskLevel(item));
      var item = this.refs["item" + ++i];
    }
    this.props.onSubmit();
  },

  getMaskLevel: function(tileMaskItem) {
    var maskLevel = parseInt(tileMaskItem.state.levelVal, 10);
    if (!maskLevel) {
      return null;
    }
    if (tileMaskItem.state.verticalVal) {
      return 'V' + maskLevel;
    }
    return maskLevel.toString();
  },

  componentDidUpdate: function(oldProps, oldState) {
    if (!this.props.editableTile) {
      return;
    }
    var maskTiles = this.props.editableTile.getMaskTiles();
    if (maskTiles.length === 0) {
      return;
    }
    maskTiles = maskTiles.slice(0).reverse(); // copy + reverse the array
    maskTiles.forEach((maskTile, i) => {
      var item = this.refs["item" + i];
      if (item) {
        item.drawToCanvas(maskTile);
      }
    });
  },

  tileListGroup: function() {
    if (!this.props.editableTile) {
      return <ListGroup fill />;
    }
    var maskTiles = this.props.editableTile.getMaskTiles();
    if (maskTiles.length === 0) {
      return <ListGroup fill />;
    }
    maskTiles = maskTiles.slice(0).reverse(); // copy + reverse the array
    var tileItems = maskTiles.map((maskTile, i) => {
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
        <TileMaskItem key={i}
          ref={"item" + i}
          level={maskLevel}
          vertical={maskVertical} />
      );
    });
    return (<ListGroup fill>{tileItems}</ListGroup>);
  },

  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <Row>
              <Col className="edit-tiles-col" lg={5}>
                <Panel className="tile-images-panel" header="Masks">
                  {this.tileListGroup()}
                </Panel>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>Cancel</Button>
          <Button onClick={this.handleSubmit} bsStyle="primary">OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/* =============================================================================
 * COMPONENT: TILE MASK ITEM
 * =============================================================================
 */
const TileMaskItem = React.createClass({
  _canvas: null,
  _regex: /\D/g,

  getInitialState: function() {
    return {
      levelVal: '',
      verticalVal: false
    };
  },

  handleLevelChange: function(event) {
    console.log(event.target.value);
    this.setState({ levelVal: event.target.value.replace(this._regex, '') });
    console.log(this.state);
  },

  handleVerticalChange: function(event) {
    console.log(event.target.checked);
    this.setState({ verticalVal: event.target.checked });
    console.log(this.state);
  },

  drawToCanvas: function(maskTile) {
    var ctx = getDrawingContext(this._canvas);
    ctx.drawImage(maskTile.getTile().getCanvas(), 0, 0, this._canvas.width, this._canvas.height);
  },

  componentWillMount: function() {
    console.log("componentWillMount: " + this.props);
    this.setState({
      levelVal: this.props.level,
      verticalVal: this.props.vertical
    });
  },

  componentWillReceiveProps: function(nextProps) {
    console.log("componentWillReceiveProps: " + nextProps);
    this.setState({
      levelVal: nextProps.level,
      verticalVal: nextProps.vertical
    });
  },

  render: function() {
    //return (<ListGroupItem>yo</ListGroupItem>);
    return (
      <ListGroupItem>
        <form>
          <Grid>
            <Row>
              <Col className="edit-tiles-item-col" lg={1}>
                <div className="tile-canvas-container">
                  <canvas className="tiles" width={tileSize * 2} height={tileSize * 2}
                      ref={cvs => this._canvas = cvs} />
                </div>
              </Col>
              <Col className="edit-tiles-item-col" lg={2}>
                <Input type="text" placeholder="level"
                    value={this.state.levelVal} onChange={this.handleLevelChange} />
              </Col>
              <Col className="edit-tiles-item-col" lg={1}>
                <Input type="checkbox" label="Vertical"
                    checked={this.state.verticalVal} onChange={this.handleVerticalChange} />
              </Col>
            </Row>
          </Grid>
        </form>
      </ListGroupItem>
    );
  }
});

module.exports = {
  EditImagesModal,
  EditMasksModal
};
