import Grid from './Grid';
import Tile from './Tile';
export default class GameManager {
    constructor(size) {
        this.size = size;
        this.startTiles = 2;
    }
    setup() {
        // 初始化数据
        this.grid = new Grid(this.size);
        // 初始化分数
        this.score = 0;
        // 是否失败
        this.over = false;
        // 是否胜利
        this.won = false;
        // 添加初始化数据
        this.addStartTiles();
        // 返回当前的所有数据
        return this.grid.cells;
    }

    // 初始化数据，生成两个随机位置和数值
    addStartTiles() {
        for (var i = 0; i < this.startTiles; i++) {
            // 添加随机数字
            this.addRandomTiles();
        }
    }

    // 在一个随机单元格中随机填充2或4
    addRandomTiles() {
        // 判断是否可用
        if (this.grid.cellsAvailable()) {
            var value = Math.random() < 0.9 ? 2 : 4;
            var cell = this.grid.randomAvailableCell();
            var tile = new Tile(cell, value);
            this.grid.insertTile(tile); // 插入一个单元格
        }

    }

    // 返回当前数据和状态
    actuate() {

        return {
            grids: this.grid.cells,
            over: this.over,
            won: this.won,
            score: this.score
        }
    }

    // 偏移向量
    getVector(direction) {
        // 0: 向上, 1: 向右, 2: 向下, 3: 向左
        const map = [{ // 上
            x: -1,
            y: 0
        }, { // 右
            x: 0,
            y: 1
        }, { // 下
            x: 1,
            y: 0
        }, { // 左
            x: 0,
            y: -1
        }];
        return map[direction];
    }

    buildTraversals(vector) {
        var traversals = {
            x: [],
            y: []
        };

        for (var pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }

        // 为什么要加这个，看findFarthestTail
        if (vector.x === 1) {
            // 向右时，数组取反
            traversals.x = traversals.x.reverse();
        }

        if (vector.y === 1) {
            // 向下，数组取反
            traversals.y = traversals.y.reverse();
        }
        console.log(traversals);
        return traversals;
    }

    // 把当前单元格挪至下一个可放置的区域
    moveTile(tile, cell) {
        this.grid.cells[tile.x][tile.y] = null;
        this.grid.cells[cell.x][cell.y] = tile;
        tile.updatePosition(cell);
    }

    // 特定方向移动单元格
    move(direction) {
        // 0: 向上, 1: 向右, 2: 向下, 3: 向左
        const self = this;
        // 获得偏移量，并根据偏移量获取移动路径
        const vector = this.getVector(direction);
        const traversals = this.buildTraversals(vector);

        let cell;
        let tile;
        let moved = false;
        self.prepareTiles();

        traversals.x.forEach(function (x) {
            traversals.y.forEach(function (y) {
                // 定义当前坐标
                cell = {
                    x: x,
                    y: y
                };
                tile = self.grid.cellContent(cell);

                if (tile) { // 单元格有内容
                    var positions = self.findFarthestTail(cell, vector);
                    var next = self.grid.cellContent(positions.next);

                    if (next && next.value === tile.value && !next.mergedFrom) {
                        // 当前格子和其移动方向格子内容相同，需要合并
                        var merged = new Tile(positions.next, tile.value * 2); // 合并后的格子信息

                        merged.mergedFrom = [tile, next];

                        self.grid.insertTile(merged); // 把合并的盒子插入到当前格子数据中
                        self.grid.removeTile(tile); // 删除当前格子内容

                        tile.updatePosition(positions.next);

                        self.score += merged.value;
                        if (merged.value === 2048) self.won = true;
                    } else {
                        self.moveTile(tile, positions.farthest);
                    }

                    // 是否从当前位置移到当前位置
                    if (!self.positionsEqual(cell, tile)) {
                        moved = true;
                    }
                }
            });
        });

        // 移动完成
        if (moved) {
            // 添加新的棋盘数据
            this.addRandomTiles();
            // 判断是否还能够移动
            if (!this.movesAvailable()) {
                // 不能移动，游戏结束
                this.over = true;
            }
            // 返回当前的棋盘数据，分数等信息
            return this.actuate();
        }
    }

    prepareTiles() {

        var tile;
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                tile = this.grid.cells[x][y];
                if (tile) {
                    tile.mergedFrom = null;
                    tile.savePosition();
                }
            }
        }
    }

    positionsEqual(first, second) {
        return first.x === second.x && first.y === second.y;
    }

    movesAvailable() {
        return this.grid.cellsAvailable() || this.tileMatchesAvailable();
    }

    tileMatchesAvailable() {
        var self = this;

        var tile;

        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                tile = this.grid.cellContent({
                    x: x,
                    y: y
                });

                if (tile) {
                    for (var direction = 0; direction < 4; direction++) {
                        var vector = self.getVector(direction);
                        var cell = {
                            x: x + vector.x,
                            y: y + vector.y
                        };

                        var other = self.grid.cellContent(cell);

                        if (other && other.value === tile.value) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    // 找到当前偏移方向存在最远的空单元格
    // 如：向右偏移，那么返回当前行最靠右的空单元格及其右侧距离其最远的一个格子，向下一样
    findFarthestTail(cell, vector) {
        var previous;

        // 当前单元格在范围内且存在可用单元格
        do {
            previous = cell;
            cell = {
                x: previous.x + vector.x,
                y: previous.y + vector.y
            };
        }
        while (this.grid.withinBounds(cell) && this.grid.emptyCell(cell));

        return {
            farthest: previous,
            next: cell
        }
    }

    // 重新开始
    restart() {
        return this.setup();
    }
}