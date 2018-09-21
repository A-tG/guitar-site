function MetrCanvPointerAnimation(timeCtx, cnvBlock)
{
    this.$beatVisBlock = cnvBlock;
    this.animationQ = new AnimationQ(timeCtx);
    this.cnv = this.$beatVisBlock[0];
    this.ctx = this.cnv.getContext('2d');
    this.beatNumber = 0;
    this.scaleCoeff = 2;

    this.init();
}

MetrCanvPointerAnimation.prototype.scheduleBeatVisual = function(beat, duration)
{
    var isFirstBeat = beat.number == 0;
    var animation = {anim: this.animate.bind(this), type: "custom", time: beat.audioTime, duration: duration};
    var beginFunc = function()
    {
        this.$beatVisBlock.toggleClass(METR_FIRST_BEAT_VIS_NUMBER_CLASS, isFirstBeat);
        this.setStrokeColor();
        this.beatNumber = beat.number;
    }
    animation.begin = beginFunc.bind(this);
    this.animationQ.push(animation);
}

MetrCanvPointerAnimation.prototype.animate = function(progress)
{
    var angle = 2 * Math.PI * progress;
    this.clearCnv();
    this.drawArc(angle);
    this.drawBeatNumber();
}

MetrCanvPointerAnimation.prototype.clearCnv = function()
{
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
    this.ctx.restore();
}

MetrCanvPointerAnimation.prototype.drawArc = function(endAngle)
{
    this.ctx.lineWidth = 6 * this.scaleCoeff;
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.beginPath();
    var x = this.cnv.width * 0.5;
    var y = this.cnv.height * 0.5;
    var r = Math.min(x, y) - this.ctx.lineWidth * 0.5;
    var rOffset = 0.5 * Math.PI;
    var startAngle = 0 - rOffset;
    endAngle -= rOffset;
    this.ctx.arc(x, y, r, startAngle, endAngle);
    this.ctx.stroke();
}

MetrCanvPointerAnimation.prototype.drawBeatNumber = function()
{
    this.ctx.fillStyle = this.strokeColor;
    var x = this.cnv.width * 0.5;
    var y = this.cnv.height * 0.5 + parseInt(this.fontSize) * 0.36;
    this.ctx.fillText(this.beatNumber + 1, x, y);
}

MetrCanvPointerAnimation.prototype.setStrokeColor = function()
{
    this.strokeColor = this.$beatVisBlock.css("color");
}

MetrCanvPointerAnimation.prototype.stop = function()
{
    this.animationQ.stop();
    this.clearCnv();
}

MetrCanvPointerAnimation.prototype.play = function()
{
    this.animationQ.start();
}

MetrCanvPointerAnimation.prototype.initFont = function()
{
    this.fontFamily = this.$beatVisBlock.css("font-family");
    var fontSizeNumber = parseInt(this.$beatVisBlock.css("font-size"));
    this.fontSize = (fontSizeNumber * this.scaleCoeff) + "px";
    this.ctx.font = this.fontSize + " " + this.fontFamily;
    this.ctx.textAlign = "center";
}

MetrCanvPointerAnimation.prototype.initCanvasScale = function()
{
    var width = +this.$beatVisBlock.attr("width") * this.scaleCoeff;
    var height = +this.$beatVisBlock.attr("height") * this.scaleCoeff;
    this.$beatVisBlock.attr("width", width);
    this.$beatVisBlock.attr("height", height);
}

MetrCanvPointerAnimation.prototype.init = function()
{
    this.initCanvasScale();
    this.initFont();
}
