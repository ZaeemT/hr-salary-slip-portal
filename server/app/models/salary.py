from app.extensions import mongo
from datetime import datetime
from bson.objectid import ObjectId

class SalaryModel:
    @staticmethod
    def get_all_batches():
        """Get all salary data batches"""
        try:
            pipeline = [
                {'$group': {
                    '_id': '$batch_id',
                    'file_name': {'$first': '$file_name'},
                    'upload_time': {'$first': '$upload_time'},
                    'record_count': {'$sum': 1},
                    'status': {'$first': '$status'}
                }},
                {'$sort': {'upload_time': -1}}
            ]
            
            batches = list(mongo.db.salary_records.aggregate(pipeline))
            
            return batches
        except Exception as e:
            print(f"Error getting batches: {str(e)}")
            return []
    
    @staticmethod
    def get_batch_by_id(batch_id):
        """Get details of a specific batch by ID"""
        try:
            return list(mongo.db.salary_records.find({'batch_id': batch_id}))
        except Exception as e:
            print(f"Error getting batch: {str(e)}")
            return []
    
    @staticmethod
    def get_employee_salary(employee_id, month=None, year=None):
        """Get salary records for a specific employee"""
        try:
            query = {'employee_id': employee_id}
            
            if month:
                query['month'] = month
            
            if year:
                query['year'] = year
                
            return list(mongo.db.salary_records.find(query).sort('upload_time', -1))
        except Exception as e:
            print(f"Error getting employee salary: {str(e)}")
            return []
    
    @staticmethod
    def update_salary_status(record_id, status, message=None):
        """Update the status of a salary record"""
        try:
            update_data = {
                'status': status,
                'updated_at': datetime.now()
            }
            
            if message:
                update_data['status_message'] = message
                
            result = mongo.db.salary_records.update_one(
                {'_id': ObjectId(record_id)},
                {'$set': update_data}
            )
            
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating salary status: {str(e)}")
            return False
    
    @staticmethod
    def update_batch_status(batch_id, status, message=None):
        """Update the status of an entire batch"""
        try:
            update_data = {
                'status': status,
                'updated_at': datetime.now()
            }
            
            if message:
                update_data['status_message'] = message
                
            result = mongo.db.salary_records.update_many(
                {'batch_id': batch_id},
                {'$set': update_data}
            )
            
            return result.modified_count
        except Exception as e:
            print(f"Error updating batch status: {str(e)}")
            return 0
    
    @staticmethod
    def delete_batch(batch_id):
        """Delete an entire batch of salary records"""
        try:
            result = mongo.db.salary_records.delete_many({'batch_id': batch_id})
            return result.deleted_count
        except Exception as e:
            print(f"Error deleting batch: {str(e)}")
            return 0