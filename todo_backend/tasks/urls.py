from django.urls import path
from .views import TaskListCreate, TaskRetrieveUpdateDestroy
from . import views
urlpatterns = [
    path('tasks/', TaskListCreate.as_view(), name='task-create'),
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroy.as_view(), name='task-detail'),
]

