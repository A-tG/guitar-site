function AnimationQ(timeCtx)
{
    this.ctx = timeCtx; // for time checking
    this.Q = [];
    this.handle = null;
    this.maxQlength = 25;

    this.update = function(timestamp)
    {
        if (this.Q.length > 0)
        {
            var animation = this.Q[0];
            var startTime = animation.time;
            var targetTime = startTime + animation.duration;
            var currentTime = this.getCurrentTime();
            var isCurrentAnim = (currentTime >= startTime) && (currentTime <= targetTime);
            var isTooSoon = currentTime < startTime;
            while (!isCurrentAnim && !isTooSoon && (this.Q.length > 1))
            {
                this.Q.shift();
                animation = this.Q[0];
                startTime = animation.time;
                targetTime = startTime + animation.duration;
                currentTime = this.getCurrentTime();
                isCurrentAnim = (currentTime >= startTime) && (currentTime <= targetTime);
            }
            if (isCurrentAnim)
            {
                this.callBegin(animation);
                var progress = this.getAnimationProgress(currentTime, startTime, targetTime);
                switch (animation.type)
                {
                    case "rotaton360cw":
                        this.rotaton360cw(animation.el, progress);
                        break;
                }
            }
        }
        this.handle = requestAnimationFrame(this.update.bind(this));
    }

    this.callBegin = function(animation)
    {
        if (animation.begin && !animation.isBeginDone)
        {
            animation.isBeginDone = true;
            animation.begin();
        }
    }

    this.rotaton360cw = function(el, progress)
    {
        this.setAngle(el, 360 * progress);
    }

    this.getAnimationProgress = function(time, startTime, targetTime)
    {
        return (time - startTime) / (targetTime - startTime);
    }

    this.getCurrentTime = function()
    {
        return this.ctx.currentTime;
    }

    this.setAngle = function(el, deg)
    {
        el.setAttribute("style", "transform: rotate(" + deg + "deg);");
        deg = deg % 360;
    }

    this.push = function(anim)
    {
        if (this.Q.length < this.maxQlength)
        {
            this.Q.push(anim);
        }
    }

    this.clear = function()
    {
        this.Q = [];
    }

    this.stop = function()
    {
        cancelAnimationFrame(this.handle);
        this.clear();
    }

    this.start = function()
    {
        this.handle = requestAnimationFrame(this.update.bind(this));
    }
}
