export default class Tile {
    constructor(position, value) {
        this.x = position.x;
        this.y = position.y;
        this.value = value || 2;

        this.previousPosition = null;
        this.mergedFrom = null;
    }

    // 记录格子上次的位置
    savePosition() {
        this.previousPosition = {
            x: this.x,
            y: this.y
        };
    }

    // 更新当前格子的位置
    updatePosition(position) {
        this.x = position.x;
        this.y = position.y;
    }

    serialize() {
        return {
            position: {
                x: this.x,
                y: this.y
            },
            value: this.value
        };
    }
}
