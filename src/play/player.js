const upKey = 38, downKey = 40, leftKey = 37, rightKey = 39;

const up = 1, down = 2, left = 4, right = 8;

const movement = new Map([
    [up, [0, -2]],
    [down, [0, 2]],
    [left, [-2, 0]],
    [right, [2, 0]],
    [up + left, [-2, -2]],
    [up + right, [2, -2]],
    [down + left, [-2, 2]],
    [down + right, [2, 2]]
]);

/* =============================================================================
 * CLASS: KEYS
 * =============================================================================
 */
class Keys {
    constructor() {
        this._keysDown = Array(128).fill(false);
        this._keysUp = [];
    }

    keyDown(keyCode) {
        // console.log("DOWN: " + keyCode);
        if (keyCode < 128) {
            this._keysDown[keyCode] = true;
        }
    }

    keyUp(keyCode) {
        // console.log("UP: " + keyCode);
        if (keyCode < 128) {
            this._keysUp.push(keyCode);
        }
    }
    // keyUp(keyCode) {
    //     // console.log("UP: " + keyCode);
    //     if (keyCode < 128) {
    //         this._keysDown[keyCode] = false;
    //     }
    // }

    processKeysDown() {
        var keyBits = 0;
        if (this._keysDown[upKey]) {
            keyBits += up;
        }
        if (this._keysDown[downKey]) {
            keyBits += down;
        }
        if (this._keysDown[leftKey]) {
            keyBits += left;
        }
        if (this._keysDown[rightKey]) {
            keyBits += right;
        }
        return keyBits;
    }

    getMovement(keyBits) {
        return movement.get(keyBits);
    }

    flush() {
        if (this._keysUp.length === 0) {
            return;
        }
        this._keysUp.forEach(k => this._keysDown[k] = false);
        this._keysUp = [];
    }
    // flush() {
    //     // do nothing
    // }
}

export default Keys;