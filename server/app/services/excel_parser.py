import pandas as pd
import os
from werkzeug.utils import secure_filename
from datetime import datetime
import uuid
from app.extensions import mongo

class ExcelParserService:
    def __init__(self, config):
        """Initialize the Excel parser service with configuration"""
        self.upload_folder = config.UPLOAD_FOLDER
        self.allowed_extensions = config.ALLOWED_EXTENSIONS
        # Ensure upload directory exists
        os.makedirs(self.upload_folder, exist_ok=True)
        
    def allowed_file(self, filename):
        """Check if the file has an allowed extension"""
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in self.allowed_extensions
    
    def save_file(self, file):
        """Save the uploaded file to the upload folder"""
        if file and self.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add timestamp to avoid filename collisions
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            unique_filename = f"{timestamp}_{filename}"
            file_path = os.path.join(self.upload_folder, unique_filename)
            file.save(file_path)
            return file_path
        return None
    
    def parse_excel(self, file_path):
        """Parse the Excel file and extract salary information"""
        try:
            # Try reading with pandas
            df = pd.read_excel(file_path)
            
            # Validate required columns
            required_columns = ['employee_id', 'name', 'email', 'department', 'position', 'basic_salary', 'allowances', 'deductions', 'net_salary']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                return False, f"Missing required columns: {', '.join(missing_columns)}"
            
            # Clean and validate data
            df = self._clean_data(df)
            
            # Convert DataFrame to list of dictionaries for MongoDB storage
            salary_records = df.to_dict('records')
            
            return True, salary_records
            
        except Exception as e:
            # Handle specific exceptions
            if "XLS file is corrupted" in str(e):
                return False, "The Excel file is corrupted and cannot be read"
            elif "No sheet exists" in str(e):
                return False, "The Excel file does not contain any valid sheets"
            else:
                return False, f"Error parsing Excel file: {str(e)}"
    
    def _clean_data(self, df):
        """Clean and validate the data"""
        # Remove rows with null values in critical fields
        critical_fields = ['employee_id', 'name', 'email', 'basic_salary', 'net_salary']
        df = df.dropna(subset=critical_fields)
        
        # Convert salary to float
        df['basic_salary'] = pd.to_numeric(df['basic_salary'], errors='coerce')
        df['allowances'] = pd.to_numeric(df['allowances'], errors='coerce')
        df['deductions'] = pd.to_numeric(df['deductions'], errors='coerce')
        df['net_salary'] = pd.to_numeric(df['net_salary'], errors='coerce')
        
        # Convert employee_id to string
        df['employee_id'] = df['employee_id'].astype(str)
        
        # Validate email format (basic validation)
        df = df[df['email'].str.contains('@', na=False)]
        
        return df
    
    def store_salary_data(self, salary_records, file_info, extra_info):
        """Store salary data in MongoDB"""
        try:
            # Add metadata to each record
            batch_id = str(uuid.uuid4())
            upload_time = datetime.now()
            
            for record in salary_records:
                record['batch_id'] = batch_id
                record['upload_time'] = upload_time
                record['file_name'] = file_info.get('original_filename', '')
                record['status'] = 'pending' # Status for tracking (pending, processed, emailed)
                record['uploaded_by'] = extra_info.get('user_id', None)  # User ID who uploaded the file
                record['month'] = extra_info.get('month', None)
                record['year'] = extra_info.get('year', None)

            # Insert records into MongoDB
            result = mongo.db.salary_records.insert_many(salary_records)

            
            return True, {
                'batch_id': batch_id,
                'records_stored': len(result.inserted_ids),
                'data': salary_records
            }
            
        except Exception as e:
            
            return False, f"Error storing data in database: {str(e)}"