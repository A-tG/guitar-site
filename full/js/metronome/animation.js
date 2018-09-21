function MetrCanvPointerAnimation(timeCtx)
{
    this.$beatVisNumber = $('#' + METR_BEAT_VIS_NUMBER_ID);
    this.$beatVisBlock = $('#' + METR_BEAT_VIS_POINTER_BLOCK_ID);
    this.animationQ = new AnimationQ(timeCtx);
    this.cnv = this.$beatVisBlock[0];
    this.ctx = this.cnv.getContext('2d');

    this.scheduleBeatVisual = function(beat, duration)
    {
        var isFirstBeat = beat.number == 0;
        var animation = {anim: this.animate.bind(this), type: "custom", time: beat.audioTime, duration: duration};
        var beginFunc = function()
        {
            this.$beatVisBlock.toggleClass(METR_FIRST_BEAT_VIS_NUMBER_CLASS, isFirstBeat);
            this.$beatVisNumber.toggleClass(METR_FIRST_BEAT_VIS_NUMBER_CLASS, isFirstBeat);
            this.$beatVisNumber.text(beat.number + 1);
        }
        animation.begin = beginFunc.bind(this);
        this.animationQ.push(animation);
    }

    this.animate = function(progress)
    {
        var angle = 2 * Math.PI * progress;
        this.clearCnv();
        this.drawArc(angle);
    }

    this.clearCnv = function()
    {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
        this.ctx.restore();
    }

    this.drawArc = function(endAngle)
    {
        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = this.getColor();
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

    this.getColor = function()
    {
        return this.$beatVisBlock.css("color");
    }

    this.stop = function()
    {
        this.animationQ.stop();
        this.clearCnv();
        this.$beatVisNumber.text("");
    }

    this.play = function()
    {
        this.animationQ.start();
    }
}
