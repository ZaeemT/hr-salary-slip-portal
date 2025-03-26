from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg
import os
from datetime import datetime
import io

class PDFGeneratorService:
    def __init__(self, config):
        """Initialize the PDF generator service with configuration"""
        self.pdf_folder = config.PDF_FOLDER
        self.company_name = "HR Salary Slip Portal"
        self.company_address = ""
        
        # Update logo path to support SVG
        self.company_logo_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
            'static', 'logo.svg'
        )
        
    def _create_watermark(self, canvas, doc):
        """Create a subtle watermark on the PDF"""
        canvas.saveState()
        canvas.setFont('Helvetica', 60)
        canvas.setFillColorRGB(0.9, 0.9, 0.9, 0.3)  # Light gray with transparency
        canvas.rotate(45)
        canvas.drawString(inch, 0, "CONFIDENTIAL")
        canvas.restoreState()

    def _convert_svg_to_image(self, svg_path, width=2*inch, height=1*inch):
        """Convert SVG to ReportLab Image"""
        try:
            drawing = svg2rlg(svg_path)
            drawing.width, drawing.height = width, height
            return drawing
        except Exception as e:
            print(f"Error converting SVG: {e}")
            return None

    def generate_salary_slip(self, salary_data):
        """Generate a PDF salary slip for an employee"""
        try:
            # Ensure the PDF folder exists
            os.makedirs(self.pdf_folder, exist_ok=True)
            
            # Create a unique filename
            filename = f"salary_slip_{salary_data['employee_id']}_{salary_data['month']}_{salary_data['year']}.pdf"
            file_path = os.path.join(self.pdf_folder, filename)
            
            # Create a buffer to hold the PDF data
            buffer = io.BytesIO()
            
            # Create the PDF document with custom watermark
            doc = SimpleDocTemplate(
                buffer, 
                pagesize=letter,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=18
            )
            
            # Custom styles with elegant typography
            styles = getSampleStyleSheet()
            
            # Enhanced custom styles
            title_style = ParagraphStyle(
                'Title',
                parent=styles['Heading1'],
                fontSize=18,
                textColor=HexColor('#2C3E50'),  # Dark blue-gray
                alignment=1,  # Center alignment
                spaceAfter=12,
                fontName='Helvetica-Bold'
            )
            
            header_style = ParagraphStyle(
                'Header',
                parent=styles['Heading2'],
                fontSize=14,
                textColor=HexColor('#34495E'),  # Slightly lighter blue-gray
                spaceAfter=10,
                fontName='Helvetica-Bold'
            )
            
            normal_style = ParagraphStyle(
                'Normal',
                parent=styles['Normal'],
                fontSize=10,
                textColor=HexColor('#2C3E50'),
                spaceAfter=8,
                fontName='Helvetica'
            )
            
            # Prepare elements for the PDF
            elements = []
            
            # Add company logo (support for SVG)
            logo = self._convert_svg_to_image(self.company_logo_path)
            if logo:
                elements.append(logo)
            
            # Add company details
            elements.append(Paragraph(self.company_name, title_style))
            elements.append(Paragraph(self.company_address, normal_style))
            elements.append(Spacer(1, 0.25*inch))
            
            # Salary slip title with elegant styling
            elements.append(Paragraph(
                f"SALARY SLIP - {salary_data['month'].upper()} {salary_data['year']}", 
                title_style
            ))
            elements.append(Spacer(1, 0.25*inch))
            
            # Employee information with improved styling
            employee_info = [
                ["Employee ID:", salary_data['employee_id']],
                ["Employee Name:", salary_data['name']],
                ["Email:", salary_data['email']],
                ["Department:", salary_data.get('department', 'N/A')],
                ["Designation:", salary_data.get('position', 'N/A')],
                ["Payment Date:", datetime.now().strftime("%d-%m-%Y")]
            ]
            
            t = Table(employee_info, colWidths=[2*inch, 3*inch])
            t.setStyle(TableStyle([
                ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#BDC3C7')),  # Light gray border
                ('BACKGROUND', (0, 0), (0, -1), HexColor('#ECF0F1')),  # Very light gray
                ('TEXTCOLOR', (0, 0), (0, -1), HexColor('#2980B9')),  # Blue for labels
                ('ALIGNMENT', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 0.25*inch))
            
            # Earnings and deductions with gradient styling
            elements.append(Paragraph("EARNINGS & DEDUCTIONS", header_style))
            
            earnings_deductions = [
                ["DESCRIPTION", "AMOUNT"],
                ["Basic Salary", f"{salary_data['basic_salary']:.2f}"],
                ["Allowances", f"{salary_data['allowances']:.2f}"],
                ["Deductions", f"{salary_data['deductions']:.2f}"],
                ["Net Salary", f"{salary_data['net_salary']:.2f}"],
            ]
            
            t = Table(earnings_deductions, colWidths=[3*inch, 2.5*inch])
            t.setStyle(TableStyle([
                ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#BDC3C7')),
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#3498DB')),  # Blue header
                ('BACKGROUND', (0, -1), (-1, -1), HexColor('#2ECC71')),  # Green for total
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),  # White text for header
                ('TEXTCOLOR', (0, -1), (-1, -1), colors.white),  # White text for total
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
            
            # Footer with subtle styling
            footer_text = "This is a computer-generated document and does not require a signature."
            elements.append(Paragraph(footer_text, normal_style))
            
            # Build PDF with watermark
            def add_watermark(canvas, doc):
                canvas.saveState()
                self._create_watermark(canvas, doc)
                canvas.restoreState()
            
            # Build and save PDF
            doc.build(elements, onFirstPage=add_watermark, onLaterPages=add_watermark)
            
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