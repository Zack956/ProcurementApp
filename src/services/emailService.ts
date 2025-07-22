interface EmailNotification {
  to: string[];
  subject: string;
  body: string;
  requisitionId: string;
  amount: string;
  requestor: string;
  department: string;
}

export const sendRequisitionNotification = async (notification: EmailNotification): Promise<boolean> => {
  try {
    // In a real implementation, this would integrate with your email service
    // For now, we'll simulate the email sending process
    
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 10px;">
              New Purchase Requisition Submitted
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1f2937;">Requisition Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 150px;">Requisition ID:</td>
                  <td style="padding: 8px 0;">${notification.requisitionId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Requestor:</td>
                  <td style="padding: 8px 0;">${notification.requestor}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Department:</td>
                  <td style="padding: 8px 0;">${notification.department}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 8px 0; color: #059669; font-weight: bold;">${notification.amount}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #2563EB;">
              <p style="margin: 0; font-weight: bold;">Action Required:</p>
              <p style="margin: 5px 0 0 0;">Please review and approve this purchase requisition in the ProcureFlow system.</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="#" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Review Requisition
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>This is an automated notification from ProcureFlow. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Simulate email sending with Outlook integration
    console.log('Sending email notification:', {
      to: notification.to,
      subject: notification.subject,
      body: emailBody
    });

    // In production, you would integrate with:
    // - Microsoft Graph API for Outlook
    // - SMTP server
    // - Email service provider (SendGrid, AWS SES, etc.)
    
    // For demonstration, we'll show a success message
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};

export const getApprovalRecipients = (department: string, amount: number): string[] => {
  const recipients: string[] = [];
  
  // Department managers (always notified)
  const departmentManagers = {
    'IT': 'it.manager@company.com',
    'HR': 'hr.manager@company.com',
    'Finance': 'finance.manager@company.com',
    'Operations': 'operations.manager@company.com',
    'Marketing': 'marketing.manager@company.com',
    'Administration': 'admin.manager@company.com'
  };
  
  if (departmentManagers[department as keyof typeof departmentManagers]) {
    recipients.push(departmentManagers[department as keyof typeof departmentManagers]);
  }
  
  // Finance team for amounts > RM 1,000
  if (amount > 1000) {
    recipients.push('finance.team@company.com');
  }
  
  // CEO for amounts > RM 5,000
  if (amount > 5000) {
    recipients.push('ceo@company.com');
  }
  
  // Always notify admin
  recipients.push('admin@company.com');
  
  return [...new Set(recipients)]; // Remove duplicates
};