from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.excel_parser import ExcelParserService
import os
import datetime
from app.config import Config

salary_bp = Blueprint('salary', __name__)

@salary_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_salary_file():
    """Upload and process an Excel file containing salary data"""
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({
                'status': 'error',
                'message': 'No file part in the request'
            }), 400
            
        file = request.files['file']
        
        # Check if a file was selected
        if file.filename == '':
            return jsonify({
                'status': 'error',
                'message': 'No file selected'
            }), 400
        
        # Initialize the Excel parser service
        parser = ExcelParserService(Config)
        
        # Check if file type is allowed
        if not parser.allowed_file(file.filename):
            return jsonify({
                'status': 'error',
                'message': f'File type not allowed. Allowed types: {", ".join(current_app.config["ALLOWED_EXTENSIONS"])}'
            }), 400
        
        # Save the file
        file_path = parser.save_file(file)
        if not file_path:
            return jsonify({
                'status': 'error',
                'message': 'Failed to save file'
            }), 500
        
        # Parse the Excel file
        success, result = parser.parse_excel(file_path)
        if not success:
            # Clean up the file if parsing failed
            try:
                os.remove(file_path)
            except:
                pass  # Ignore cleanup errors
                
            return jsonify({
                'status': 'error',
                'message': result
            }), 400
        
        # Calculate totals
        total_basic_salary = sum(record.get('basic_salary', 0) for record in result)
        total_allowances = sum(record.get('allowances', 0) for record in result)
        total_net_salary = sum(record.get('net_salary', 0) for record in result)
        
        # Store the data in MongoDB
        file_info = {
            'original_filename': file.filename,
            'saved_path': file_path,
        }
        
        # Extract month and year from form data
        month = request.form.get('month')
        year = request.form.get('year')
        
        extra_info = {
            'user_id': get_jwt_identity(),
            'month': month,
            'year': year
        }

        store_success, store_result = parser.store_salary_data(result, file_info, extra_info)
        if not store_success:
            # Clean up the file if storage failed
            try:
                os.remove(file_path)
            except:
                pass  # Ignore cleanup errors
                
            return jsonify({
                'status': 'error',
                'message': store_result
            }), 500
        
        return jsonify({
            'status': 'success',
            'message': 'Salary data processed and stored successfully',
            'details': {
                'month': month,
                'year': year,
                'records_processed': len(result),
                'total_basic_salary': total_basic_salary,
                'total_allowances': total_allowances,
                'total_net_salary': total_net_salary,
                'batch_id': store_result['batch_id'],
                'salary_records': store_result['data'],
            }
        }), 201
        
    except Exception as e:
        # General error handling
        return jsonify({
            'status': 'error',
            'message': f'Error processing the request: {str(e)}'
        }), 500

@salary_bp.route('/salary-data', methods=['GET'])
@jwt_required()
def get_salary_data():
    """Get salary data with optional filtering"""
    try:
        from app.extensions import mongo
        
        # Parse query parameters
        batch_id = request.args.get('batch_id')
        month = request.args.get('month')
        year = request.args.get('year')
        
        # Build query
        query = {}
        if batch_id:
            query['batch_id'] = batch_id
        if month:
            query['month'] = month
        if year:
            query['year'] = year
        
        # Execute query
        salary_records = list(mongo.db.salary_records.find(query, {'_id': 0}))
        
        return jsonify({
            'status': 'success',
            'count': len(salary_records),
            'data': salary_records
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error retrieving salary data: {str(e)}'
        }), 500

@salary_bp.route('/batches', methods=['GET'])
@jwt_required()
def get_batches():
    """Get list of uploaded batches"""
    try:
        from app.extensions import mongo
        
        # Aggregate to get batch summaries
        pipeline = [
            {'$match': {'uploaded_by': get_jwt_identity()}},
            {'$group': {
                '_id': '$batch_id',
                'file_name': {'$first': '$file_name'},
                'upload_time': {'$first': '$upload_time'},
                'record_count': {'$sum': 1},
                'month': {'$first': '$month'},
                'year': {'$first': '$year'},
                'status': {'$first': '$status'}
            }},
            {'$sort': {'upload_time': -1}}
        ]
        
        batches = list(mongo.db.salary_records.aggregate(pipeline))
        
        # Format the results
        formatted_batches = [{
            'batch_id': batch['_id'],
            'file_name': batch['file_name'],
            'upload_time': batch['upload_time'],
            'record_count': batch['record_count'],
            'month': batch['month'],
            'year': batch['year'],
            'status': batch['status']
        } for batch in batches]
        
        return jsonify({
            'status': 'success',
            'count': len(formatted_batches),
            'data': formatted_batches
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error retrieving batch data: {str(e)}'
        }), 500

@salary_bp.route('/salary-data/<batch_id>', methods=['DELETE'])
@jwt_required()
def delete_batch(batch_id):
    """Delete a batch of salary records"""
    try:
        from app.extensions import mongo
        
        # Delete records
        result = mongo.db.salary_records.delete_many({'batch_id': batch_id})
        
        
        return jsonify({
            'status': 'success',
            'message': f'Batch deleted successfully',
            'records_deleted': result.deleted_count
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error deleting batch: {str(e)}'
        }), 500