const puppeteer = require('puppeteer');

exports.generateSubmissionPdf = async (submission, template, settings) => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Font loading for Cursive signature (optional, can fallback to standard fonts)
    const fontLink = `<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">`;

    // Construct Form Data Display
    let formDataHtml = '<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
    if (submission.values) {
        Object.entries(submission.values).forEach(([key, value]) => {
            formDataHtml += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; width: 40%;">${key}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${value}</td>
                </tr>
            `;
        });
    }
    formDataHtml += '</table>';

    // Signatures
    let signaturesHtml = `
        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
            <div style="width: 45%; text-align: center;">
                <div style="border-bottom: 1px solid #000; padding-bottom: 5px; min-height: 40px; font-family: 'Dancing Script', cursive; font-size: 24px;">
                    ${submission.values['Signature'] || submission.lead.name}
                </div>
                <div style="margin-top: 5px; font-weight: bold;">(Lead Signature) ${submission.lead.name}</div>
                <div style="font-size: 12px; color: #666;">Date: ${new Date(submission.submittedAt).toLocaleDateString()}</div>
            </div>
    `;

    if (settings.enableAdminSignature && settings.adminSignature) {
        signaturesHtml += `
            <div style="width: 45%; text-align: center; float: right;">
                <div style="border-bottom: 1px solid #000; padding-bottom: 5px; min-height: 40px;">
                    <img src="${settings.adminSignature}" style="max-height: 50px; display:block; margin: 0 auto;"/>
                </div>
                <div style="margin-top: 5px; font-weight: bold;">(Authorized Signature)</div>
                <div style="font-size: 12px; color: #666;">Date: ${new Date().toLocaleDateString()}</div>
            </div>
        `;
    }
    signaturesHtml += '</div>';

    // Helper to fix flex/float issue in PDF generation sometimes require clear floats
    // Puppeteer handles flexbox reasonably well but sometimes clear div helps
    // Actually, Puppeteer (Chrome) handles flex fine. But float:right is safer for old-school HTML->PDF logic if specific flex gap issues occur.
    // I'll stick to a table for signatures to be perfectly aligned if flex fails? Table is safer for PDF.

    signaturesHtml = `
        <table style="width: 100%; margin-top: 50px;">
            <tr>
                <td style="width: 50%; text-align: center; vertical-align: bottom;">
                    <div style="border-bottom: 1px solid #000; padding-bottom: 5px; margin: 0 20px; font-family: 'Dancing Script', cursive; font-size: 24px;">
                         ${submission.values['Signature'] || submission.values['Full Name'] || submission.lead.name}
                    </div>
                    <div style="padding-top: 5px; font-weight: bold;">Lead Signature</div>
                    <div style="font-size: 12px; color: #666;">${new Date(submission.submittedAt).toLocaleDateString()}</div>
                </td>
                <td style="width: 50%; text-align: center; vertical-align: bottom;">
                    ${settings.enableAdminSignature && settings.adminSignature ? `
                        <div style="border-bottom: 1px solid #000; padding-bottom: 5px; margin: 0 20px;">
                            <img src="${settings.adminSignature}" style="max-height: 60px; display:inline-block;"/>
                        </div>
                        <div style="padding-top: 5px; font-weight: bold;">Authorized Signature</div>
                        <div style="font-size: 12px; color: #666;">${new Date().toLocaleDateString()}</div>
                    ` : ''}
                </td>
            </tr>
        </table>
    `;


    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            ${fontLink}
            <style>
                body { font-family: 'Times New Roman', serif; padding: 40px; color: #333; }
                h1 { text-align: center; text-transform: uppercase; font-size: 24px; margin-bottom: 10px; }
                .description { text-align: center; font-style: italic; color: #666; margin-bottom: 30px; }
                .content { font-size: 14px; line-height: 1.6; text-align: justify; margin-bottom: 30px; }
                .header-image { width: 100%; max-height: 200px; object-fit: cover; margin-bottom: 20px; }
                table { page-break-inside: avoid; }
            </style>
        </head>
        <body>
            ${template.imageUrl ? `<img src="${template.imageUrl}" class="header-image" />` : ''}
            <h1>${template.name}</h1>
            ${template.description ? `<p class="description">${template.description.replace(/(<([^>]+)>)/gi, "")}</p>` : ''}
            
            <div class="content">
                ${template.content}
            </div>

            <h3 style="margin-top: 40px; border-bottom: 1px solid #333; padding-bottom: 10px;">Submitted Details</h3>
            ${formDataHtml}

            ${signaturesHtml}
        </body>
        </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();
    return pdfBuffer;
};
