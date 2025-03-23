from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.pdf_email import PdfEmailProcessor
from app.models.salary import SalaryModel
from app.extensions import mongo

process_bp = Blueprint('process', __name__)

@process_bp.route('/generate-and-send/<batch_id>', methods=['POST'])
@jwt_required()
def generate_and_send(batch_id):
    """Generate PDFs and send emails for an entire batch"""
    try:
        # Check if batch exists
        batch_records = SalaryModel.get_batch_by_id(batch_id)
        if not batch_records:
            return jsonify({
                'status': 'error',
                'message': 'Batch not found'
            }), 404
        
        # Initialize the processor service
        processor = PdfEmailProcessor(current_app)
        
        # Process the batch
        success, result = processor.process_batch(batch_id)
        
        if not success:
            return jsonify({
                'status': 'error',
                'message': result
            }), 500
        
        # Return the processing results
        return jsonify({
            'status': 'success',
            'message': 'Batch processing completed',
            'results': result
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error processing request: {str(e)}'
        }), 500

@process_bp.route('/status/<batch_id>', methods=['GET'])
@jwt_required()
def get_processing_status(batch_id):
    """Get the processing status of a batch"""
    try:
        # Get the batch records
        records = SalaryModel.get_batch_by_id(batch_id)
        
        if not records:
            return jsonify({
                'status': 'error',
                'message': 'Batch not found'
            }), 404
        
        # Count records by status
        status_counts = {}
        for record in records:
            status = record.get('status', 'unknown')
            if status in status_counts:
                status_counts[status] += 1
            else:
                status_counts[status] = 1
        
        # Calculate completion percentage
        total_records = len(records)
        completed_records = status_counts.get('completed', 0)
        completion_percentage = (completed_records / total_records) * 100 if total_records > 0 else 0
        
        # Get error details if any
        errors = []
        for record in records:
            if record.get('status') != 'completed' and 'status_message' in record:
                errors.append({
                    'employee_id': record.get('employee_id'),
                    'name': record.get('name'),
                    'status': record.get('status'),
                    'message': record.get('status_message')
                })
        
        return jsonify({
            'status': 'success',
            'batch_id': batch_id,
            'total_records': total_records,
            'status_counts': status_counts,
            'completion_percentage': round(completion_percentage, 2),
            'errors': errors
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error retrieving status: {str(e)}'
        }), 500

@process_bp.route('/retry/<batch_id>', methods=['POST'])
@jwt_required()
def retry_failed(batch_id):
    """Retry processing failed records in a batch"""
    try:
        # Initialize the processor service
        processor = PdfEmailProcessor(current_app)
        
        # Get failed records
        records = list(mongo.db.salary_records.find({
            'batch_id': batch_id,
            'status': {'$in': ['pdf_failed', 'email_failed', 'processing_failed']}
        }))
        
        if not records:
            return jsonify({
                'status': 'success',
                'message': 'No failed records to retry'
            })
        
        results = {
            'total_retried': len(records),
            'successful': 0,
            'failed': 0,
            'errors': []
        }
        
        # Process each failed record
        for record in records:
            success, message = processor.process_single_record(record)
            
            if success:
                results['successful'] += 1
            else:
                results['failed'] += 1
                results['errors'].append({
                    'employee_id': record['employee_id'],
                    'name': record['name'],
                    'error': message
                })
        
        return jsonify({
            'status': 'success',
            'message': 'Retry processing completed',
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error during retry: {str(e)}'
        }), 500