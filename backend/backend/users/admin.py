from django.contrib import admin

from users.models import Users


class UsersAdmin(admin.ModelAdmin):

    list_display = ('username', 'email',  'first_name', 'last_name', 'is_active')


admin.site.register(Users, UsersAdmin)