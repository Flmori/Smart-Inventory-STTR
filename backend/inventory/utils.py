"""
Utility functions untuk Smart-Inventory STTR
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler untuk format error response yang konsisten
    
    Format error response:
    {
        "error": "ERROR_CODE",
        "message": "Pesan error dalam Bahasa Indonesia",
        "details": {...}  # Optional
    }
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize error response format
        custom_response_data = {
            'error': exc.__class__.__name__,
            'message': str(exc),
        }
        
        # Add details if available
        if hasattr(exc, 'detail'):
            if isinstance(exc.detail, dict):
                custom_response_data['details'] = exc.detail
            elif isinstance(exc.detail, list):
                custom_response_data['details'] = {'errors': exc.detail}
        
        response.data = custom_response_data
    
    return response


def get_client_ip(request):
    """
    Get client IP address from request
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_agent(request):
    """
    Get user agent from request
    """
    return request.META.get('HTTP_USER_AGENT', '')
