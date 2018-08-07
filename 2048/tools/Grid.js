export default class Grid {
    constructor(size) {
        this.size = size;
        this.cells = this.empty();
    }

    // 构造一个空的矩阵[[null,..,size.length],[]]
    empty() {
        const cells = [];
        for (let i = 0; i < this.size; i++) {
            const row = cells[i] = [];
            for (let j = 0; j < this.size; j++) {
                row.push(null);
            }
        }
        console.log(cells);
        // [[{x:0,y:0},{x:0,y:1}],[]]
        return cells;
    }

    // 在空格子中随机挑选出一个格子
    randomAvailableCell() {
        // 所有可填充的坐标
        var cells = this.availableCells();

        // 存在可填充的格子
        if (cells.length) {
            // 随机返回一个格子的坐标数据
            return cells[Math.floor(Math.random() * cells.length)];
        }
    }

    // 获取可填充的格子坐标
    availableCells() {
        var cells = [];

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {

                // 当前格子无内容
                if (!this.cells[i][j]) {
                    cells.push({
                        x: i,
                        y: j
                    });
                }
            }
        }

        return cells;
    }

    // 是否存在空单元格
    cellsAvailable() {
        return !!this.availableCells().length;
    }

    cellAvailable(cell) {
        return !this.cellContent(cell);
    }

    insertTile(tile) {
        this.cells[tile.x][tile.y] = tile;
    }

    /* 
     * 删除单元格内容
     * @param {object} tile {x:0,y:0} 单元格坐标
     */
    removeTile(tile) {
        this.cells[tile.x][tile.y] = null;
    }

    /* 
     * 获取单元格内容
     * @param {object} cell {x:0,y:0} 单元格坐标
     */
    cellContent(cell) {
        if (this.withinBounds(cell)) {
            return this.cells[cell.x][cell.y] || null;
        } else {
            return null;
        }
    }

    /*
     * 空单元格，格子还未填充数字
     */
    emptyCell(cell) {
        return !this.cellContent(cell);
    }

    withinBounds(cell) {
        return cell.x >= 0 && cell.x < this.size && cell.y >= 0 && cell.y < this.size;
    }

    eachCell(callback) {
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                callback(x, y, this.cells[x][y]);
            }
        }
    }
}