from django.contrib import admin
from .models import User

# Register your models here.
class Users(admin.ModelAdmin):
  pass

admin.site.register(User, Users)