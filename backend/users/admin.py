from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, MenteeProfile, MentorProfile, Review

# Custom UserAdmin to display our extra fields in the Django admin panel
class CustomUserAdmin(UserAdmin):
    model = User
    # Display the role and email in the list view
    list_display = ['email', 'username', 'role', 'is_staff']
    # Add 'role' to the fields visible when editing a user
    fieldsets = UserAdmin.fieldsets + (
        ('MentorBridge Fields', {'fields': ('role',)}),
    )
    
    # Ensure email is requested when creating a "Fresh demo user" in the admin panel
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Personal Info', {'fields': ('email', 'role')}),
    )

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('mentee', 'mentor', 'rating', 'created_at')
    search_fields = ('mentee__email', 'mentor__email')
    list_filter = ('rating', 'created_at')

admin.site.register(User, CustomUserAdmin)
admin.site.register(MenteeProfile)
admin.site.register(MentorProfile)
admin.site.register(Review, ReviewAdmin)
