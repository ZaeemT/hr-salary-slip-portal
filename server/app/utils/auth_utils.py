from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request

def role_required(roles):
    """
    Decorator for routes that require specific roles
    
    Args:
        roles (str or list): Required role(s)
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Verify JWT
            verify_jwt_in_request()
            
            # Get claims from token
            claims = get_jwt()
            user_role = claims.get('role', 'user')
            
            # Convert single role to list
            required_roles = roles if isinstance(roles, list) else [roles]
            
            # Check if user has the required role
            if user_role not in required_roles:
                return jsonify({
                    'status': 'error',
                    'message': 'Insufficient permissions'
                }), 403
                
            return fn(*args, **kwargs)
        return wrapper
    return decorator