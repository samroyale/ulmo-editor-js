export const upKey = 38, downKey = 40, leftKey = 37, rightKey = 39;

export const up = 1, down = 2, left = 4, right = 8;

export const directions = [up, down, left, right];

export const movement = new Map([
    [up, [up, 0, -2]],
    [down, [down, 0, 2]],
    [left, [left, -2, 0]],
    [right, [right, 2, 0]],
    [up + left, [up, -2, -2]],
    [up + right, [up, 2, -2]],
    [down + left, [down, -2, 2]],
    [down + right, [down, 2, 2]]
]);

export const fallUnit = 4;

export const spritesImgPath = "/img/sprites";

export const defaultBaseRectWidth = 16;
export const defaultBaseRectHeight = 18;
export const baseRectExtension = 2;


