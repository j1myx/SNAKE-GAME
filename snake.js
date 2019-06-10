var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var app = {
    score: {
        tag: document.getElementById('score'),
        mark: 0,
        show: function () {
            this.tag.innerHTML = this.mark;
        }
    },
    finish: function () {
        this.lost = true;
        this.score.tag.innerHTML += ' (Lost)';
    },
    start: true,
    lost: false
};
var snake = {
    posX: 0, /** Horizontal */
    posY: 0, /** Vertical */
    progress: 10,
    size: 0,
    length: [{
        posX: 0,
        posY: 0
    }],
    currentAddress: 'ArrowRight',
    beforeReady: function () {
        switch (this.currentAddress) {
            case 'ArrowDown':
                if (this.posY == 290) this.posY = 0;
                else this.posY += this.progress;
                break;
            case 'ArrowUp':
                if (this.posY == 0) this.posY = 290;
                else this.posY -= this.progress;
                break;
            case 'ArrowLeft':
                if (this.posX == 0) this.posX = 790;
                else this.posX -= this.progress;
                break;
            case 'ArrowRight':
                if (this.posX == 790) this.posX = 0;
                else this.posX += this.progress;
                break;
        }

        this.length.forEach(function (item) {
            if (item.posX == snake.posX && item.posY == snake.posY) {
                app.finish();
            }
        });
    },
    ready: function () {
        if (!app.start || app.lost) return;

        this.beforeReady();
        this.length.push({posX: this.posX, posY: this.posY});

        var limitPos = this.length.length - this.size;
        this.length.forEach(function (item, index) {
            if ((index + 1) < limitPos) {
                snake.length.splice(index, 1);
                ctx.clearRect(item.posX, item.posY, 10, 10);
            }
        });

        ctx.fillRect(snake.posX , snake.posY, 10, 10);
        this.afterReady();
    },
    afterReady: function () {
        /**
         * Chip eaten by snake
         */
        if (this.posY == chip.posY && this.posX == chip.posX) {
            chip.generate();
            app.score.mark += chip.value;
            app.score.show();
            snake.size += 1;
        }
    }
};
var chip = {
    posX: 0,
    posY: 0,
    value: 1,
    generate: function () {
        this.posX = helper.roundSize(helper.randomNumber(0, 790), 10, this.posX);
        this.posY = helper.roundSize(helper.randomNumber(0, 290), 10, this.posY);
        ctx.fillRect(this.posX , this.posY, 10, 10);

        return this;
    }
};
var helper = {
    randomNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    roundSize: function (number, size, notNumber) {
        while (number % size != 0) number += 1;

        if (notNumber == number) this.roundSize(number, size);

        return number;
    }
};

setInterval(function () {
    snake.ready();
}, 100);
chip.generate();
app.score.show();

document.onkeyup = function (evObject) {
    if ((evObject.key === 'ArrowDown' && snake.currentAddress !== 'ArrowUp') ||
        (evObject.key === 'ArrowUp' && snake.currentAddress !== 'ArrowDown') ||
        (evObject.key === 'ArrowLeft' && snake.currentAddress !== 'ArrowRight') ||
        (evObject.key === 'ArrowRight' && snake.currentAddress !== 'ArrowLeft')
    ) {
        snake.currentAddress = evObject.key;
    }
};
document.getElementById('play-pause').onclick = function () {
    app.start = !app.start;
};
