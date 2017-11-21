var Tuning = {
    isCorrect: function(tuningName)
    {
        if (typeof tuningName !== "string")
        {
            return false;
        }
        var isCorrect = false;
        if (tuningName == CUSTOM_TUNING_VALUE)
        {
            isCorrect = true;
        }
        else
        {
            var stringsTunes = TUNINGS[tuningName];
            if (stringsTunes !== undefined)
            {
                isCorrect = Tuning.isCorrectNotes(stringsTunes);
            }
            else
            {
                console.log(tuningName + ': ' + WRONG_TUNING_NAME)
            }
        }
        return isCorrect;
    },

    isCorrectNotes: function(stringsTunes)
    {
        var isArray = (typeof stringsTunes === "object") && (Array.isArray(stringsTunes));
        if (!isArray)
        {
            return false;
        }
        var isCorrect = false;
        for (var i = 0; i < stringsTunes.length; i++)
        {
            isCorrect = Note.isCorrect(stringsTunes[i]);
            if (!isCorrect)
            {
                return isCorrect
            }
        }
        return isCorrect;
    },

    getStringsTunes: function(tuningName)
    {
        tuningName = tuningName.toLowerCase();
        var stringsTunes = DEFAULT_STRING_TUNES;
        if (Tuning.isCorrect(tuningName))
        {
            stringsTunes = TUNINGS[tuningName].slice();
        }
        return stringsTunes;
    },

    getStringTune: function(stringsTunes, stringNumber)
    {
        return stringsTunes[stringNumber % stringsTunes.length];
    },

    getTuningName: function(stringsTunes)
    {
        var name = CUSTOM_TUNING_VALUE;
        for (var tuningName in TUNINGS)
        {
            var isLengthsEqual = TUNINGS[tuningName].length == stringsTunes.length;
            if (isLengthsEqual)
            {
                var isEqualTunings = TUNINGS[tuningName].every(function(stringTune, i, tuning) {
                    return stringTune == stringsTunes[i];
                });
                if (isEqualTunings)
                {
                    return tuningName;
                }
            }
        }
        return name;
    }
}
