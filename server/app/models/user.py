from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import mongo
from bson import ObjectId

class UserModel:
    @staticmethod
    def find_by_id(user_id):
        """
        Find a user by ID
        
        Args:
            user_id (str): User ID
            
        Returns:
            dict: User document or None if not found
        """
        if not ObjectId.is_valid(user_id):
            return None
        return mongo.db.users.find_one({"_id": ObjectId(user_id)})
    
    @staticmethod
    def find_by_email(email):
        """
        Find a user by email
        
        Args:
            email (str): User email address
            
        Returns:
            dict: User document or None if not found
        """
        return mongo.db.users.find_one({"email": email})
    
    @staticmethod
    def find_by_username(username):
        """
        Find a user by username
        
        Args:
            username (str): Username
            
        Returns:
            dict: User document or None if not found
        """
        return mongo.db.users.find_one({"username": username})
    
    @staticmethod
    def create_user(username, email, password, role='user'):
        """
        Create a new user
        
        Args:
            username (str): Username
            email (str): Email address
            password (str): Password
            role (str): User role ('user', 'admin', etc.)
            
        Returns:
            str: ID of the created user or None if user exists
        """
        # Check if user already exists
        if UserModel.find_by_email(email) or UserModel.find_by_username(username):
            return None
            
        # Create new user document
        new_user = {
            "username": username,
            "email": email,
            "password_hash": generate_password_hash(password),
            "role": role,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "active": True
        }
        
        result = mongo.db.users.insert_one(new_user)
        return str(result.inserted_id)
    
    @staticmethod
    def authenticate(email, password):
        """
        Authenticate a user
        
        Args:
            email (str): User email
            password (str): User password
            
        Returns:
            dict: User document if authentication succeeds, None otherwise
        """
        user = UserModel.find_by_email(email)
        
        if user and user.get('active', False) and check_password_hash(user['password_hash'], password):
            return user
        return None
    
    @staticmethod
    def update_user(user_id, update_data):
        """
        Update user information
        
        Args:
            user_id (str): User ID
            update_data (dict): Data to update
            
        Returns:
            bool: True if updated successfully, False otherwise
        """
        # Don't allow direct password updates
        if 'password' in update_data:
            del update_data['password']
            
        if 'password_hash' in update_data:
            del update_data['password_hash']
            
        # Add updated timestamp
        update_data['updated_at'] = datetime.utcnow()
        
        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    def change_password(user_id, new_password):
        """
        Change a user's password
        
        Args:
            user_id (str): User ID
            new_password (str): New password
            
        Returns:
            bool: True if updated successfully, False otherwise
        """
        update_data = {
            'password_hash': generate_password_hash(new_password),
            'updated_at': datetime.now()
        }
        
        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        return result.modified_count > 0