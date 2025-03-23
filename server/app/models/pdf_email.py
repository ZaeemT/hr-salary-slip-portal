from app.services.pdf_generator import PDFGeneratorService
from app.services.email_service import EmailService
from app.extensions import mongo
from app.config import Config
from datetime import datetime

class PdfEmailProcessor:
    def __init__(self, app):
        """Initialize the Salary Processor service"""
        self.pdf_generator = PDFGeneratorService(Config)
        self.email_service = EmailService(Config)
        
    def process_batch(self, batch_id):
        """Process an entire batch of salary records"""
        try:
            # Get all records in the batch
            records = list(mongo.db.salary_records.find({'batch_id': batch_id}))
            
            if not records:
                return False, "No records found for the specified batch ID"
            
            results = {
                'total': len(records),
                'successful': 0,
                'failed': 0,
                'errors': []
            }

            self._update_batch_status(batch_id, 'processing', results)

            
            # Process each record
            for record in records:
                success, message = self.process_single_record(record)
                
                if success:
                    results['successful'] += 1
                else:
                    results['failed'] += 1
                    results['errors'].append({
                        'employee_id': record['employee_id'],
                        'name': record['name'],
                        'error': message
                    })
            
            # Update batch status
            status = 'completed' if results['failed'] == 0 else 'partially_completed'
            self._update_batch_status(batch_id, status, results)
            
            return True, results
            
        except Exception as e:
            # Update batch status on error
            self._update_batch_status(batch_id, 'failed', str(e))
            return False, f"Error processing batch: {str(e)}"
    
    def process_single_record(self, record):
        """Process a single salary record"""
        try:
            # Generate PDF
            pdf_result = self.pdf_generator.generate_salary_slip(record)
            
            if not pdf_result['success']:
                self._update_record_status(record['_id'], 'pdf_failed', pdf_result['error'])
                return False, pdf_result['error']
            
            pdf_path = pdf_result['file_path']
            
            # Send email
            email_success, email_result = self.email_service.send_salary_slip(record, pdf_path)
            
            if not email_success:
                self._update_record_status(record['_id'], 'email_failed', email_result)
                return False, email_result
            
            # Update record status
            # self._update_record_status(record['_id'], 'completed')
            
            return True, "Salary slip processed and sent successfully"
            
        except Exception as e:
            self._update_record_status(record['_id'], 'processing_failed', str(e))
            return False, f"Error processing record: {str(e)}"
    
    def _update_record_status(self, record_id, status, message=None):
        """Update the status of a salary record"""
        try:
            update_data = {
                'status': status,
                'processed_at': datetime.now()
            }
            
            if message:
                update_data['status_message'] = message
                
            mongo.db.salary_records.update_one(
                {'_id': record_id},
                {'$set': update_data}
            )
        except:
            pass  # Ignore status update errors
    
    def _update_batch_status(self, batch_id, status, details=None):
        """Update the status of an entire batch"""
        try:
            update_data = {
                'status': status,
                'processed_at': datetime.now()
            }
            
            if details:
                update_data['processing_details'] = details
                
            mongo.db.salary_records.update_many(
                {'batch_id': batch_id},
                {'$set': update_data}
            )
            
        except:
            pass  # Ignore status update errors