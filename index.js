const mathjs = require("mathjs");
const Canvas = require("canvas");

drawGraph = function(exp, color, size) {
    let canvas = Canvas.createCanvas(512, 512);
    let ctx = canvas.getContext("2d");
    let h = canvas.height;
    let w = canvas.width;
    let cw = w / 2;
    let ch = h / 2;
    let stc = 10;
    let scale = 25;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.moveTo(cw, 0);
    ctx.lineWidth = 2;
    ctx.lineTo(cw, h);
    ctx.moveTo(0, ch);
    ctx.lineTo(w, ch);
    ctx.stroke();

    ctx.font = "30px Arial";
    ctx.fillStyle = '#000000';
    ctx.fillText("y = " + exp, 10, 30);

    let iscale = 1 / scale;
    let top = ch * iscale;
    let bottom = -ch * iscale;
    let ss = iscale / stc;
    let x, y, yy, xx, subX;
    let start = (-cw - 1) * iscale;
    let end = (cw + 1) * iscale;

    ctx.strokeStyle = color;
    ctx.lineWidth = size * iscale;

    ctx.setTransform(scale, 0, 0, -scale, cw, ch);

    func = function(x) {
        try {
            return mathjs.evaluate(exp.replace(/x/g, x));
        } catch (e) {
            return 0;
        }
    }
    
    ctx.beginPath();
    for (x = start; x < end; x += iscale) {
        for (subX = 0; subX < iscale; subX += ss) {
            y = func(x + subX);
            if (yy !== undefined) {
                if (y > top || y < bottom) {
                    if (yy < top && yy > bottom) {
                        ctx.lineTo(x + subX, y);
                    }
                } else {
                    if (yy > top || yy < bottom) {
                        ctx.moveTo(xx, yy);
                    }
                    if (subX === 0) {
                        if (y > bottom && y < top) {
                            if (Math.abs(yy - y) > (top - bottom) * (1 / 3)) {
                                ctx.moveTo(x, y);
                            } else {
                                ctx.lineTo(x, y);
                            }
                        }
                    }
                }
            } else {
                if (subX === 0) {
                    ctx.moveTo(x, y);
                }
            }
            yy = y;
            xx = x + subX;
        }
    }
    ctx.stroke();
    return canvas;
}
