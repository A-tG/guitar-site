ko.bindingHandlers.clickOutside = 
{
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext)
    {
        const eventName = 'click'
        const fn = ko.unwrap(valueAccessor()) as Function

        const onClick = (e: MouseEvent) =>
        {
            if (element.contains(e.target) || element === e.target) return

            fn.apply(bindingContext.$data)
        }

        const hookedEl = document.querySelector('html')
        hookedEl?.addEventListener(eventName, onClick)

        ko.utils.domNodeDisposal.addDisposeCallback(element,
            () => hookedEl?.removeEventListener(eventName, onClick))
    }
}