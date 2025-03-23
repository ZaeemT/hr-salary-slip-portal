from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
import os
from datetime import datetime
import io

class PDFGeneratorService:
    def __init__(self, config):
        """Initialize the PDF generator service with configuration"""
        self.pdf_folder = config.PDF_FOLDER
        self.company_name = "Your Company Name"
        self.company_address = "123 Business Street, City, Country"
        self.company_logo_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                           'static', 'images', 'company_logo.png')
        
    def generate_salary_slip(self, salary_data):
        """Generate a PDF salary slip for an employee"""
        try:
            # Create a unique filename
            filename = f"salary_slip_{salary_data['employee_id']}_{salary_data['month']}_{salary_data['year']}.pdf"
            file_path = os.path.join(self.pdf_folder, filename)
            
            # Create a buffer to hold the PDF data
            buffer = io.BytesIO()
            
            # Create the PDF document
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            elements = []
            
            styles = getSampleStyleSheet()
            
            # Define custom styles
            title_style = ParagraphStyle(
                'Title',
                parent=styles['Heading1'],
                fontSize=16,
                alignment=1,  # Center alignment
                spaceAfter=12
            )
            
            header_style = ParagraphStyle(
                'Header',
                parent=styles['Heading2'],
                fontSize=14,
                spaceAfter=10
            )
            
            normal_style = ParagraphStyle(
                'Normal',
                parent=styles['Normal'],
                fontSize=12,
                spaceAfter=8
            )
            
            # Add company logo if exists
            if os.path.exists(self.company_logo_path):
                img = Image(self.company_logo_path, width=2*inch, height=1*inch)
                elements.append(img)
            
            # Add company name and title
            elements.append(Paragraph(self.company_name, title_style))
            elements.append(Paragraph(self.company_address, normal_style))
            elements.append(Spacer(1, 0.25*inch))
            
            # Add salary slip title
            elements.append(Paragraph(f"SALARY SLIP - {salary_data['month'].upper()} {salary_data['year']}", title_style))
            elements.append(Spacer(1, 0.25*inch))
            
            # Add employee information
            employee_info = [
                ["Employee ID:", salary_data['employee_id']],
                ["Employee Name:", salary_data['name']],
                ["Email:", salary_data['email']],
                ["Department:", salary_data.get('department', 'N/A')],
                ["Designation:", salary_data.get('designation', 'N/A')],
                ["Payment Date:", datetime.now().strftime("%d-%m-%Y")]
            ]
            
            t = Table(employee_info, colWidths=[2*inch, 3*inch])
            t.setStyle(TableStyle([
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
                ('TEXTCOLOR', (0, 0), (0, -1), colors.darkblue),
                ('ALIGNMENT', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 0.25*inch))
            
            # Add earnings and deductions
            elements.append(Paragraph("EARNINGS & DEDUCTIONS", header_style))
            
            # Use the actual values from salary_data
            earnings_deductions = [
                ["DESCRIPTION", "AMOUNT"],
                ["Basic Salary", f"{salary_data['basic_salary']:.2f}"],
                ["Allowances", f"{salary_data['allowances']:.2f}"],
                ["Deductions", f"{salary_data['deductions']:.2f}"],
                ["Net Salary", f"{salary_data['net_salary']:.2f}"],
            ]
            
            t = Table(earnings_deductions, colWidths=[3*inch, 2.5*inch])
            t.setStyle(TableStyle([
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
                ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.darkblue),
                ('TEXTCOLOR', (0, -1), (-1, -1), colors.darkblue),
                ('ALIGNMENT', (1, 0), (-1, -1), 'RIGHT'),
                ('ALIGNMENT', (0, 0), (0, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 0.25*inch))
            
            elements.append(Spacer(1, 0.5*inch))
            
            # Add footer text
            footer_text = "This is a computer-generated document and does not require a signature."
            elements.append(Paragraph(footer_text, normal_style))
            
            # Build the PDF
            doc.build(elements)
            
            # Save the PDF to file
            with open(file_path, 'wb') as f:
                f.write(buffer.getvalue())
            
            # Return the buffer for email attachment
            buffer.seek(0)
            return {
                'success': True,
                'file_path': file_path,
                'filename': filename,
                'buffer': buffer
            }
            
        except Exception as e:
            print(f"Error generating PDF: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }