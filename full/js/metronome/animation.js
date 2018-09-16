function MetrAnimation(timeCtx) 
{
    this.ctx = timeCtx;
    this.$beatVisNumber = $('#' + METR_BEAT_VIS_NUMBER_ID);
    this.$beatVisPointer = $('#' + METR_BEAT_VIS_POINTER_BLOCK_ID);
    this.pointerToAnimate = $('#' + METR_BEAT_VIS_POINTER_ID)[0];
    this.isPlaying = false;
    this.animationQ = new AnimationQ(timeCtx);

    this.scheduleBeatVisual = function(beat, duration)
    {
        var isFirstBeat = beat.number == 0;
        var animation = {el: this.pointerToAnimate, type: "rotaton360cw", time: beat.audioTime, duration: duration};
        var beginFunc = function()
        {
            this.$beatVisPointer.toggleClass(METR_BEAT_VIS_POINTER_OTHER_CLASS, !isFirstBeat).toggleClass(METR_BEAT_VIS_POINTER_FIRST_CLASS, isFirstBeat);
            this.$beatVisNumber.toggleClass(METR_FIRST_BEAT_VIS_NUMBER_CLASS, beat.number == 0);
            this.$beatVisNumber.text(beat.number + 1);
        }
        animation.begin = beginFunc.bind(this);
        this.animationQ.push(animation);
    }

    this.stop = function()
    {
        this.isPlaying = false;
        this.animationQ.stop();
        this.animationQ.setAngle(this.pointerToAnimate, 0)
        this.$beatVisNumber.text("");
        this.$beatVisPointer.hide();
    }

    this.play = function()
    {
        this.isPlaying = true;
        this.$beatVisPointer.show();
        this.animationQ.start();
    }

    this.$beatVisPointer.hide();
}
