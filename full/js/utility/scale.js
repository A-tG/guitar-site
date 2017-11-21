var Scale = {
    isCorrect: function(scaleName)
    {
        if (typeof scaleName !== "string")
        {
            return false;
        }
        var isCorrect = false;
        var semiTones = SCALES[scaleName];
        if (semiTones !== undefined)
        {
            isCorrect = Scale.isCorrectSemitonesSum(semiTones);
        }
        else
        {
            console.log(scaleName + ': ' + WRONG_SCALE_NAME_MSG)
        }
        return isCorrect;
    },

    isCorrectSemitonesSum: function(semiTones)
    {
        var isArray = (typeof semiTones === "object") && (Array.isArray(semiTones));
        if (!isArray)
        {
            return false;
        }
        var isCorrect = false;
        var semiTonesSum = 0;
        for (var i = 0; i < semiTones.length; i++)
        {
            semiTonesSum += semiTones[i];
        }
        if (semiTonesSum == SCALE_SEMITONES_NUMBER)
        {
            isCorrect = true;
        }
        else
        {
            console.log(semiTones + ': ' + WRONG_SEMITONE_NUMBER_MSG)
        }
        return isCorrect;
    },

    getSemitones: function(scaleName)
    {
        scaleName = scaleName.toLowerCase();
        var semiTones = DEFAULT_SCALE_SEMITONES;
        if (Scale.isCorrect(scaleName))
        {
            semiTones = SCALES[scaleName];
        }
        return semiTones;
    }
}
