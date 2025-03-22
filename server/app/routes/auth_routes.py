from flask import Blueprint, request, jsonify
from app.models.user import UserModel
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required
)
from datetime import timedelta
from werkzeug.security import check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Check required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'status': 'error',
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Register the user
        user_id = UserModel.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            role=data.get('role', 'HR Admin')  # Default role is 'user'
        )
        
        if not user_id:
            return jsonify({
                'status': 'error',
                'message': 'Username or email already exists'
            }), 409
        
        
        return jsonify({
            'status': 'success',
            'message': 'User registered successfully',
            'user_id': user_id
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error during registration: {str(e)}'
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Log in a user"""
    try:
        data = request.get_json()
        
        # Check required fields
        if 'email' not in data or 'password' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Email and password are required'
            }), 400
        
        # Authenticate user
        user = UserModel.authenticate(data['email'], data['password'])
        
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'Invalid email or password'
            }), 401
        
        # Create tokens
        access_token = create_access_token(
            identity=str(user['_id']),
            additional_claims={
                'username': user['username'],
                'email': user['email'],
                'role': user.get('role', 'user')
            },
            expires_delta=timedelta(hours=1)
        )
        
        refresh_token = create_refresh_token(
            identity=str(user['_id']),
            expires_delta=timedelta(days=30)
        )
        
        
        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'user': {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'role': user.get('role', 'user')
            },
            'access_token': access_token,
            'refresh_token': refresh_token
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error during login: {str(e)}'
        }), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        # Get user identity from refresh token
        current_user_id = get_jwt_identity()
        
        # Get user from database
        user = UserModel.find_by_id(current_user_id)
        
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Create new access token
        access_token = create_access_token(
            identity=current_user_id,
            additional_claims={
                'username': user['username'],
                'email': user['email'],
                'role': user.get('role', 'user')
            },
            expires_delta=timedelta(hours=1)
        )
        
        
        return jsonify({
            'status': 'success',
            'access_token': access_token
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error refreshing token: {str(e)}'
        }), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    try:
        # Get user identity from token
        current_user_id = get_jwt_identity()
        
        # Get user from database
        user = UserModel.find_by_id(current_user_id)
        
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Return user profile without sensitive data
        return jsonify({
            'status': 'success',
            'user': {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'role': user.get('role', 'user'),
                'created_at': user.get('created_at').isoformat() if user.get('created_at') else None
            }
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error retrieving profile: {str(e)}'
        }), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        # Check required fields
        if 'current_password' not in data or 'new_password' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Current password and new password are required'
            }), 400
        
        # Get user
        user = UserModel.find_by_id(current_user_id)
        
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Verify current password
        if not check_password_hash(user['password_hash'], data['current_password']):
            return jsonify({
                'status': 'error',
                'message': 'Current password is incorrect'
            }), 401
        
        # Change password
        success = UserModel.change_password(current_user_id, data['new_password'])
        
        if not success:
            return jsonify({
                'status': 'error',
                'message': 'Failed to update password'
            }), 500
        
        
        return jsonify({
            'status': 'success',
            'message': 'Password changed successfully'
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error changing password: {str(e)}'
        }), 500