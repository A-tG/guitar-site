function isCorrectNote(note)
{
    var isCorrect = false;
    if (NOTES.indexOf(note.toUpperCase()) >= 0)
    {
        isCorrect = true;
    }
    else
    {
        console.log(note + ': ' + WRONG_NOTE_MSG);
    }
    return isCorrect;
}

function isCorrectSemitonesSum(semiTones)
{
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
}

function isCorrectScale(scaleName)
{
    var isCorrect = false;
    var semiTones = SCALES[scaleName];
    if (semiTones !== undefined)
    {
        isCorrect = isCorrectSemitonesSum(semiTones);
    }
    else
    {
        console.log(scaleName + ': ' + WRONG_SCALE_NAME_MSG)
    }
    return isCorrect;
}

function isCorrectTuningNotes(stringsTunes)
{
    var isCorrect = false;
    for (var i = 0; i < stringsTunes.length; i++)
    {
        isCorrect = isCorrectNote(stringsTunes[i]);
        if (!isCorrect)
        {
            return isCorrect
        }
    }
    return isCorrect;
}

function isCorrectTuning(tuningName)
{
    var isCorrect = false;
    if (tuningName !== CUSTOM_TUNING_VALUE)
    {
        var stringsTunes = TUNINGS[tuningName];
        if (stringsTunes !== undefined)
        {
            isCorrect = isCorrectTuningNotes(stringsTunes);
        }
        else
        {
            console.log(tuningName + ': ' + WRONG_TUNING_NAME)
        }
    }
    else
    {
        isCorrect = true;
    }
    return isCorrect;
}

function isCorrectHalfStep(halfStep)
{
    return ((+halfStep) >= MIN_HALF_STEP) && ((+halfStep) <= MAX_HALF_STEP);
}

function isCorrectStringsNumber(number)
{
    return ((+number) >= MIN_STRINGS_NUMBER) && ((+number) <= MAX_STRINGS_NUMBER);
}

function getScaleSemitones(scaleName)
{
    scaleName = scaleName.toLowerCase();
    var semiTones = DEFAULT_SCALE_SEMITONES;
    if (isCorrectScale(scaleName))
    {
        semiTones = SCALES[scaleName];
    }
    return semiTones;
}

function getTuneNotes(tuningName)
{
    tuningName = tuningName.toLowerCase();
    var stringsTunes = DEFAULT_STRING_TUNES;
    if (isCorrectTuning(tuningName))
    {
        stringsTunes = TUNINGS[tuningName].slice();
    }
    return stringsTunes;
}

function prevNote(note)
{
    resultNote = "C";
    if (isCorrectNote(note))
    {
        var index = NOTES.indexOf(note);
        index--;
        if (index < 0)
        {
            index = NOTES.length - 1;
        }
        resultNote = NOTES[index];
    }
    return resultNote;
}

function nextNote(note)
{
    resultNote = "C";
    if (isCorrectNote(note))
    {
        var index = NOTES.indexOf(note);
        index++;
        if (index == NOTES.length)
        {
            index = 0;
        }
        resultNote = NOTES[index];
    }
    return resultNote;
}

function prevHalfStep(halfStep)
{
    halfStep--;
    if (halfStep < MIN_HALF_STEP)
    {
        halfStep = MIN_HALF_STEP;
    }
    return halfStep;
}

function nextHalfStep(halfStep)
{
    halfStep++;
    if (halfStep > MAX_HALF_STEP)
    {
        halfStep = MAX_HALF_STEP;
    }
    return halfStep;
}

function getNotesFromSemiTones(root, semiTones)
{
    var notes = DEFAULT_SCALE_NOTES;
    root = root.toUpperCase();
    if ((isCorrectNote(root)) && (isCorrectSemitonesSum(semiTones)))
    {
        notes = [];
        var note = root;
        notes.push(note);
        for (var i = 0; i < semiTones.length; i++)
        {
            for (var k = 1; k <= semiTones[i]; k++)
            {
                note = nextNote(note);
            }
            notes.push(note);
        }
        notes.pop();
    }
    return notes
}

function getSemiTonesPatternForString(scaleNotes, semiTones, stringTune)
{
    var pattern = [];
    var stringTuneOffset = 0;
    var stringTuneIndex = scaleNotes.indexOf(stringTune);
    while (stringTuneIndex < 0)
    {
        stringTune = nextNote(stringTune);
        stringTuneIndex = scaleNotes.indexOf(stringTune);
        stringTuneOffset++;
    }
    pattern.push(stringTuneOffset);
    for (var i = stringTuneIndex; i < semiTones.length; i++)
    {
        pattern.push(semiTones[i]);
    }
    for (var i = 0; i < stringTuneIndex; i++)
    {
        pattern.push(semiTones[i]);
    }
    return pattern;
}

function sliderLogVal(position, minVal, maxVal)
{
    var minPosition = 0;
    var maxPosition = 100;
    var value = 0;
    if (position > 0)
    {
        var minLogVal = Math.log(minVal);
        var maxLogVal = Math.log(maxVal);
        var scale = (maxLogVal - minLogVal) / (maxPosition - minPosition);
        value = Math.exp(minLogVal + scale* (position - minPosition));
    }
    return value;
}