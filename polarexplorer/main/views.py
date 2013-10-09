from annoying.decorators import render_to


@render_to('main/index.html')
def index(request):
    return dict()


@render_to('main/glacier.html')
def glacier(request):
    return dict()


@render_to('main/water.html')
def water(request):
    return dict()
