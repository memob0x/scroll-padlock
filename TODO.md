## v1.0

    [✓] convert the whole lib to a class to be initialized on elements eg. const bodyPadlock = new ScrollPadlock(el = document.body); bodyPadlock.lock(); bodyPadlock.unlock(); ...
    [ ] if element === body || element === html then do cabled some cross browser "cabled" logic eg.
        window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
        window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
    [ ] support element === window --> automatically bind to body...
    [ ] check element === html support
    [ ] build: provide separate .min files
    [ ] tests: complete unit test (TODO notes across test modules)
    [ ] library: provide missing jsdocs

## v1.0.1

    [ ] horizontal scrollbar support
    [ ] optional CSS classes
    [ ] general: ditch prettier, adopt eslint
    [ ] general: npm run lint command
    [ ] demos: enhance top drawer part (closing "x" etc...)
    [ ] docs: redo ios-bug.gif, ios-fix.gif once demos are finished
    [ ] docs: provide dedicated gifs for positioned elements
