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
            company_name = "HR Salary Slip Portal"
            
            # Create message container
            msg = MIMEMultipart()
            msg['From'] = self.mail_sender
            msg['To'] = recipient_email
            msg['Date'] = formatdate(localtime=True)
            msg['Subject'] = f"Salary Slip for {month.capitalize()} {year}"
            
            # Create email body
            email_body = f"""
                <html lang="en" style="font-size: 16px;">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Salary Slip</title>
                </head>
                <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
                    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                        <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center; display: flex; align-items: center; justify-content: center;">
                            <h1 style="margin: 0; font-size: 24px;">{company_name}</h1>
                        </div>
                        
                        <div style="padding: 30px; background-color: #ffffff;">
                            <h2 style="margin: 0; font-size: 20px;">Salary Slip - {month.capitalize()} {year}</h2>
                            <p style="margin-bottom: 15px;">Dear {recipient_name},</p>
                            
                            <p style="margin-bottom: 15px;">We are pleased to provide you with your salary slip for the month of {month.capitalize()} {year}. Please find the detailed breakdown attached to this email.</p>
                            
                            <p style="margin-bottom: 15px;">Key points to note:</p>
                            <ul style="margin-bottom: 15px;">
                                <li>Salary slip is generated for the period: {month.capitalize()} {year}</li>
                                <li>Please review all details carefully</li>
                                <li>Contact HR for any discrepancies</li>
                            </ul>
                            
                            <p style="margin-bottom: 15px;">If you have any questions or concerns regarding your salary slip, please reach out to the HR department.</p>
                            
                            <p style="margin-bottom: 15px;">Thank you for your continued dedication and hard work.</p>
                            
                            <p style="margin-bottom: 15px;">Best regards,<br>HR Department<br>{company_name}</p>
                            
                            <p style="color: #e74c3c; font-weight: bold; margin-top: 20px;">CONFIDENTIAL: This is a system-generated email. Please do not reply.</p>
                        </div>
                        
                        <div style="background-color: #f8f8f8; color: #777; font-size: 12px; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="margin-bottom: 10px;">&copy; {year} {company_name}. All rights reserved.</p>
                            <p>This email and its attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed.</p>
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