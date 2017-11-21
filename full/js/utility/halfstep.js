var Halfstep = {
    isCorrect: function(halfStep)
    {
        return (Number.isInteger(halfStep)) && ((+halfStep) >= MIN_HALF_STEP) && ((+halfStep) <= MAX_HALF_STEP);
    },

    prev: function(halfStep)
    {
        halfStep--;
        if (halfStep < MIN_HALF_STEP)
        {
            halfStep = MIN_HALF_STEP;
        }
        return halfStep;
    },
    
    next: function(halfStep)
    {
        halfStep++;
        if (halfStep > MAX_HALF_STEP)
        {
            halfStep = MAX_HALF_STEP;
        }
        return halfStep;
    },
}
