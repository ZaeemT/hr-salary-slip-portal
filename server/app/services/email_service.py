import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.utils import formatdate
from datetime import datetime
from app.extensions import mongo

class EmailService:
    def __init__(self, config):
        """Initialize the email service with configuration"""
        self.mail_server = config.MAIL_SERVER
        self.mail_port = config.MAIL_PORT
        self.mail_use_tls = config.MAIL_USE_TLS
        self.mail_username = config.MAIL_USERNAME
        self.mail_password = config.MAIL_PASSWORD
        self.mail_sender = config.MAIL_DEFAULT_SENDER
        
    def send_salary_slip(self, record, pdf_path):
        """Send salary slip email with PDF attachment"""
        try:
            recipient_email = record['email']
            recipient_name = record['name']
            month = record['month']
            year = record['year']
            
            # Create message container
            msg = MIMEMultipart()
            msg['From'] = self.mail_sender
            msg['To'] = recipient_email
            msg['Date'] = formatdate(localtime=True)
            msg['Subject'] = f"Salary Slip for {month.capitalize()} {year}"
            
            # Create email body
            email_body = f"""
            <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                        .container {{ width: 80%; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #f8f8f8; padding: 10px; border-bottom: 2px solid #ddd; }}
                        .content {{ padding: 20px 0; }}
                        .footer {{ font-size: 12px; color: #777; padding-top: 20px; border-top: 1px solid #ddd; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Salary Slip - {month.capitalize()} {year}</h2>
                        </div>
                        <div class="content">
                            <p>Dear {recipient_name},</p>
                            <p>Please find attached your salary slip for the month of {month.capitalize()} {year}.</p>
                            <p>This is an automated email. Please do not reply to this message.</p>
                            <p>If you have any queries regarding your salary slip, please contact the HR department.</p>
                            <p>Thank you.</p>
                        </div>
                        <div class="footer">
                            <p>This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed.</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            # Attach email body as HTML
            msg.attach(MIMEText(email_body, 'html'))
            
            # Attach PDF from file
            with open(pdf_path, 'rb') as f:
                pdf_attachment = MIMEApplication(f.read(), _subtype="pdf")
                pdf_filename = f"salary_slip_{month}_{year}.pdf"
                pdf_attachment.add_header('Content-Disposition', 'attachment', filename=pdf_filename)
                msg.attach(pdf_attachment)
            
            # Send email
            with smtplib.SMTP(self.mail_server, self.mail_port) as server:
                if self.mail_use_tls:
                    server.starttls()
                
                server.login(self.mail_username, self.mail_password)
                server.sendmail(self.mail_sender, recipient_email, msg.as_string())
            
            
            return True, "Email sent successfully"
            
        except Exception as e:
            return False, f"Error sending email: {str(e)}"