$(document).ready(function() {
jQuery.fn.reverse = [].reverse;

var gameInterval;
var curBlockType;
var nextBlockType;
var rotateState = "I";
var i = 1;
var speed = 10;
var linesCleared = 0;
var level = 0;
var multiplier = 1;

$("#zentris").bind("click", function() {
    gameInterval = '';
    curBlockType = '';
    nextBlockType = '';
    rotateState = "I";
    i = 1;
    speed = 10;
    linesCleared = 0;
    level = 0;
    multiplier = 1;
    gameover();
    var board = $(this);
    board.html('');
    board.addClass('zentris');
    for (var i = -2; i < 15; i++) {
        for (var j = 0; j < 10; j++) {
            board.append("<div class='cell' data-row='" + i + "' data-col='" + j + "'></div>");
        }
    }
    $(".cell").each(function() {
        var sq = $(this);
        var row = sq.data("row");
        var col = sq.data("col");
        sq.css("left", 11 * col);
        sq.css("top", 11 * row);
    });
    board.append("<div class='scoreboard'>Score: <span id='score'>0</span></div>");

    dropNewBlock(board);

    $("body").bind("keydown", function(e) {
        controls(e.which);
    });

    gameInterval = window.setInterval(update, 100);
});

function controls(n) {
    if (n == 39) {
        if (!collideSet($(".playerBlock"), "right")) {
            $(".playerBlock").reverse().each(function() {
                var active = $(this);
                var r = active.data("row");
                var c = active.data("col");
                var right = getCell(c + 1, r);
                swap(active, right);
            });
        }
    }
    if (n == 37) {
        if (!collideSet($(".playerBlock"), "left")) {
            $(".playerBlock").each(function() {
                var active = $(this);
                var r = active.data("row");
                var c = active.data("col");
                var left = getCell(c - 1, r);
                swap(active, left);
            });
        }
    }
    if (n == 40) {
        if (!collideSet($(".playerBlock"), "below")) {
            $(".playerBlock").reverse().each(function() {
                var active = $(this);
                var r = active.data("row");
                var c = active.data("col");
                var below = getCell(c, r + 1);
                swap(active, below);
            });
        }
    }
    if (n == 38) {
        rotateRight();
    }
}

function dropNewBlock(board) {
    var newc = Math.floor((Math.random() * 7));
    switch (newc) {
    case 0:
        curBlockType = "zl";
        createBlock(5, 1, 6, 1, 4, 2, 5, 2); //zl
        break;
    case 1:
        curBlockType = "zr";
        createBlock(4, 1, 5, 1, 5, 2, 6, 2); //zr
        break;
    case 2:
        curBlockType = "long";
        createBlock(3, 2, 4, 2, 5, 2, 6, 2); //long
        break;
    case 3:
        curBlockType = "square";
        createBlock(4, 1, 5, 1, 4, 2, 5, 2); //square
        break;
    case 4:
        curBlockType = "wr";
        createBlock(4, 1, 5, 1, 6, 1, 6, 2); //wr
        break;
    case 5:
        curBlockType = "wl";
        createBlock(4, 1, 4, 2, 5, 1, 6, 1); //wl
        break;
    case 6:
        curBlockType = "T";
        createBlock(4, 1, 5, 1, 5, 2, 6, 1); //T
        break;
    }
    rotateState = "I";
}

function createBlock(a1, a2, b1, b2, c1, c2, d1, d2) {
    if (test(a1, a2 - 2) && test(b1, b2 - 2) && test(c1, c2 - 2) && test(d1, d2 - 2)) {
        getCell(a1, a2 - 2).addClass("activeBlock").addClass("playerBlock").addClass(curBlockType);
        getCell(b1, b2 - 2).addClass("activeBlock").addClass("playerBlock").addClass(curBlockType);
        getCell(c1, c2 - 2).addClass("activeBlock").addClass("playerBlock").addClass(curBlockType);
        getCell(d1, d2 - 2).addClass("activeBlock").addClass("playerBlock").addClass(curBlockType);
    }
    else {
        gameover();
    }
}

function rotateRight() {
    if (curBlockType != "square") {
        var p = new Array();
        var newpos = new Array();
        var valid = true;
        $(".playerBlock").each(function() {
            p.push($(this).data("col"));
            p.push($(this).data("row"));
        });
        if (curBlockType === "long") {
            if (rotateState === "I" || rotateState === "III") {
                newpos = new Array(p[4], p[5], p[4], p[5] - 2, p[4], p[5] - 1, p[4], p[5] + 1);
            }
            else if (rotateState === "II" || rotateState === "IV") {
                newpos = new Array(p[4] - 2, p[5], p[4] + 1, p[5], p[4], p[5], p[4] - 1, p[5]);
            }
        }
        if (curBlockType === "zl") {
            if (rotateState === "I" || rotateState === "III") {
                newpos = new Array(p[0], p[1], p[2], p[3], p[0], p[1] - 1, p[2], p[3] + 1);
            }
            else if (rotateState === "II" || rotateState === "IV") {
                newpos = new Array(p[2], p[3], p[4], p[5], p[2], p[3] + 1, p[2] - 1, p[3] + 1);
            }
        }
        if (curBlockType === "zr") {
            if (rotateState === "I" || rotateState === "III") {
                newpos = new Array(p[2], p[3], p[4], p[5], p[2] + 1, p[3], p[2] + 1, p[3] - 1);
            }
            else if (rotateState === "II" || rotateState === "IV") {
                newpos = new Array(p[2], p[3], p[6], p[7], p[2] - 1, p[3], p[6] + 1, p[7]);
            }
        }
        if (curBlockType === "T") {
            if (rotateState === "I") {
                newpos = new Array(p[2], p[3], p[0], p[1], p[6], p[7], p[2], p[3] - 1);
            }
            else if (rotateState === "II") {
                newpos = new Array(p[0], p[1], p[2], p[3], p[4], p[5], p[4] + 1, p[5]);
            }
            else if (rotateState === "III") {
                newpos = new Array(p[0], p[1], p[4], p[5], p[6], p[7], p[4], p[5] + 1);
            }
            else if (rotateState === "IV") {
                newpos = new Array(p[2], p[3], p[4], p[5], p[6], p[7], p[2] - 1, p[3]);
            }
        }
        if (curBlockType === "wr") {
            if (rotateState === "I") {
                newpos = new Array(p[2], p[3], p[2], p[3] - 1, p[2], p[3] + 1, p[0], p[1] + 1);
            }
            else if (rotateState === "II") {
                newpos = new Array(p[2], p[3], p[2] - 1, p[3], p[2] + 1, p[3], p[0] - 1, p[1]);
            }
            else if (rotateState === "III") {
                newpos = new Array(p[4], p[5], p[4], p[5] - 1, p[4], p[5] + 1, p[6], p[7] - 1);
            }
            else if (rotateState === "IV") {
                newpos = new Array(p[4], p[5], p[4] - 1, p[5], p[4] + 1, p[5], p[6] + 1, p[7]);
            }
        }
        if (curBlockType === "wl") {
            if (rotateState === "I") {
                newpos = new Array(p[2], p[3], p[2], p[3] - 1, p[2], p[3] + 1, p[0], p[1] - 1);
            }
            else if (rotateState === "II") {
                newpos = new Array(p[4], p[5], p[4] - 1, p[5], p[4] + 1, p[5], p[2] + 1, p[3]);
            }
            else if (rotateState === "III") {
                newpos = new Array(p[4], p[5], p[4], p[5] - 1, p[4], p[5] + 1, p[6], p[7] + 1);
            }
            else if (rotateState === "IV") {
                newpos = new Array(p[2], p[3], p[2] - 1, p[3], p[2] + 1, p[3], p[4] - 1, p[5]);
            }
        }
        if (valid) {
            valid = test(newpos[0], newpos[1]);
        }
        if (valid) {
            valid = test(newpos[2], newpos[3]);
        }
        if (valid) {
            valid = test(newpos[4], newpos[5]);
        }
        if (valid) {
            valid = test(newpos[6], newpos[7]);
        }

        if (valid) {
            $(".playerBlock").removeClass("activeBlock").removeClass("playerBlock").removeClass(curBlockType);
            getCell(newpos[0], newpos[1]).addClass("playerBlock").addClass("activeBlock").addClass(curBlockType);
            getCell(newpos[2], newpos[3]).addClass("playerBlock").addClass("activeBlock").addClass(curBlockType);
            getCell(newpos[4], newpos[5]).addClass("playerBlock").addClass("activeBlock").addClass(curBlockType);
            getCell(newpos[6], newpos[7]).addClass("playerBlock").addClass("activeBlock").addClass(curBlockType);
            changeRotate("r");
        }
        else {
            ;//console.log('invalid');
        }
    }
}

function changeRotate(d) {
    //alert(d);
    if (d === "r") {
        if (rotateState === "I") {
            rotateState = "II";
        }
        else if (rotateState === "II") {
            rotateState = "III";
        }
        else if (rotateState === "III") {
            rotateState = "IV";
        }
        else if (rotateState === "IV") {
            rotateState = "I";
        }
    }
    else if (d === "l") {
        if (rotateState === "I") {
            rotateState = "IV";
        }
        else if (rotateState === "II") {
            rotateState = "I";
        }
        else if (rotateState === "III") {
            rotateState = "II";
        }
        else if (rotateState === "IV") {
            rotateState = "III";
        }
    }
}

function gameover() {
    var board = $("#zentris");
    window.clearInterval(gameInterval);
    board.find(".cell").remove();
    board.append("<span id='msg'>Game over!</span>");
}


function update() {
    if (!(i % speed)) {
        var board = $("#zentris");
        var actives = $(".activeBlock");
        if (actives.length > 0) {
            if (collideSet($(".playerBlock"), "below")) {
                $(".activeblock, .playerBlock").removeClass("playerBlock").removeClass("activeBlock").addClass("setBlock");;
            }
            else {
                $(".playerBlock").reverse().each(function() {
                    $this = $(this);
                    belowthis = getCell($this.data("col"), $this.data("row") + 1);
                    swap($this, belowthis);
                });
            }
        }
        else {
            dropNewBlock(board);
        }
        if(linesCleared >= 10) {
            linesCleared -=10;
            level++;
            multipler *= 1.05;
            if(speed > 1) {
                ;//console.log(speed);
                speed--;
            }
        }

        //always last
        checkForFilledLine(board);
    }
    i++;
}

function swap(a, b) {
    aclass = a.attr("class");
    bclass = b.attr("class");
    a.attr("class", bclass);
    b.attr("class", aclass);
    ;//console.log("Swapped r" + a.data("row") + ", c" + a.data("col") + " with r" + b.data("row") + ", c" + b.data("col"));
}

function collide(a, ar, ac, b) {
    if (ar >= "14") {
        return true;
    }
    if (b.hasClass("setBlock")) {
        return true;
    }
    return false;
}

function collideSide(a, ar, ac, b, dir) {
    if (dir === "right") {
        if (ac >= "9") {
            return true;
        }
    }
    if (dir === "left") {
        if (ac <= "0") {
            return true;
        }
    }
    if (b.hasClass("setBlock")) {
        return true;
    }
    return false;
}

function collideSet(set, direction) {
    var collided = false;
    if (direction === "below") {
        $(set).reverse().each(function() {
            var active = $(this);
            var r = active.data("row");
            var c = active.data("col");
            var below = getCell(c, r + 1);
            if (collide(active, r, c, below)) {
                collided = true;
            }
        });
    }
    if (direction === "left") {
        $(set).each(function() {
            var active = $(this);
            var r = active.data("row");
            var c = active.data("col");
            var left = getCell(c - 1, r);
            if (collideSide(active, r, c, left, "left")) {
                collided = true;
            }
        });
    }
    if (direction === "right") {
        $(set).each(function() {
            var active = $(this);
            var r = active.data("row");
            var c = active.data("col");
            var right = getCell(c + 1, r);
            if (collideSide(active, r, c, right, "right")) {
                collided = true;
            }
        });
    }
    return collided;
}

function aboveEmpty(board, a) {
    return false;
}

function checkForFilledLine(board) {
    for (var i = 0; i < 15; i++) {
        var blocksin = board.find(".setBlock[data-row='" + i + "']");
        if (blocksin.length > 9) {
            blocksin.each(function() {
                $(this).removeClass("setBlock");
                addToScore(10);
            });
            setFalling(board, i);
        }
    }
}

function setFalling(board, bottomrow) {
    $(".setBlock").reverse().each(function() {
        if ($(this).data("row") < bottomrow) {
            var active = $(this);
            var r = active.data("row");
            var c = active.data("col");
            var below = getCell(c, r + 1);
            swap(active, below);
        }
    });
}

function addToScore(val) {
    var v = parseInt($("#score").html());
    v += val*multiplier;
    $("#score").html(v, 10);
}

function getCell(c, r) {
    return $(".cell[data-col='" + c + "'][data-row='" + r + "']");
}

function test(c, r) {
    if (getCell(c, r).hasClass("setBlock")) {
        return false;
    }
    if (c < 0 || c > 9) {
        return false;
    }
    if (r < -2 || r > 14) {
        return false;
    }
    return true;
}
});