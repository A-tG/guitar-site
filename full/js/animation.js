function AnimationQ(timeCtx)
{
    this.ctx = timeCtx; // for time checking
    this.Q = [];
    this.handle = null;
    this.maxQlength = 25;
}

AnimationQ.prototype.update = function(timestamp)
{
    if (this.Q.length > 0)
    {
        var animation, startTime, targetTime, currentTime, isCurrentAnim, isTooSoon;
        // shifting queue
        do {
            animation = this.Q[0];
            startTime = animation.time;
            targetTime = startTime + animation.duration;
            currentTime = this.getCurrentTime();
            isCurrentAnim = (currentTime >= startTime) && (currentTime <= targetTime);
            isTooSoon = currentTime < startTime;
            if (!isTooSoon && !isCurrentAnim)
            {
                this.Q.shift()
            }
        } while (!isCurrentAnim && !isTooSoon && (this.Q.length > 0))
        if (isCurrentAnim)
        {
            this.callBegin(animation);
            var progress = this.getAnimationProgress(currentTime, startTime, targetTime);
            switch (animation.type)
            {
                case "rotaton360cw":
                    this.rotaton360cw(animation.el, progress);
                    break;
                case "custom":
                    animation.anim(progress);
                    break;
            }
        }
    }
    this.handle = requestAnimationFrame(this.update.bind(this));
}

AnimationQ.prototype.callBegin = function(animation)
{
    if (animation.begin && !animation.isBeginDone)
    {
        animation.isBeginDone = true;
        animation.begin();
    }
}

AnimationQ.prototype.rotaton360cw = function(el, progress)
{
    this.setAngle(el, 360 * progress);
}

AnimationQ.prototype.getAnimationProgress = function(time, startTime, targetTime)
{
    return (time - startTime) / (targetTime - startTime);
}

AnimationQ.prototype.getCurrentTime = function()
{
    return this.ctx.currentTime;
}

AnimationQ.prototype.setAngle = function(el, deg)
{
    deg = deg % 360;
    el.style.transform = "rotateZ(" + deg + "deg)";
}

AnimationQ.prototype.push = function(anim)
{
    if (this.Q.length < this.maxQlength)
    {
        this.Q.push(anim);
    }
}

AnimationQ.prototype.clear = function()
{
    this.Q = [];
}

AnimationQ.prototype.stop = function()
{
    cancelAnimationFrame(this.handle);
    this.clear();
}

AnimationQ.prototype.start = function()
{
    this.handle = requestAnimationFrame(this.update.bind(this));
}
