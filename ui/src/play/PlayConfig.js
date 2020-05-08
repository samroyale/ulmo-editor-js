export const upKey = 38, downKey = 40, leftKey = 37, rightKey = 39;

export const up = 1, down = 2, left = 4, right = 8;

export const directions = [up, down, left, right];

export const movement = new Map([
    [up, [up, 0, -2, false]],
    [down, [down, 0, 2, false]],
    [left, [left, -2, 0, false]],
    [right, [right, 2, 0, false]],
    [up + left, [up, -2, -2, true]],
    [up + right, [up, 2, -2, true]],
    [down + left, [down, -2, 2, true]],
    [down + right, [down, 2, 2, true]]
]);

export const fallUnit = 4;

export const spritesImgPath = "/img/sprites";

export const defaultBaseRectWidth = 16;
export const defaultBaseRectHeight = 18;
export const baseRectExtension = 2;


