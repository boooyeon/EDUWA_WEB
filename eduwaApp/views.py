from django.shortcuts import render
from django.conf import settings
import io
import os
from ranged_response import RangedFileResponse

# Create your views here.


def home(request):
    return render(request, "home.html")


def stretch(request):
    return render(request, "stretching.html")


def health(request):
    return render(request, "index.html", {"content": 1})


def edu(request):
    return render(request, "index.html", {"content": 2})


def result(request, content):
    return render(request, 'final_page.html', {"content": content})


def edu_video(request):
    filename = os.path.join(settings.STATIC_ROOT, 'video_demo/edu.mp4')
    response = RangedFileResponse(request, open(
        filename, 'rb'), content_type='video/mp4')
    response['Content-Disposition'] = 'attachment; filename="%s"' % filename
    return response
