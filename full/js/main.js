if (isMetronomeCanWork)
{
    metronome.init();
}
else
{
    $('#' + METRONOME_DISABLED_ID).show(0);
}
getDefaultScaleOptionsFromCookie();
createNewItem();