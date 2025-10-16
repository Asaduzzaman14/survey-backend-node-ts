import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { submitionFilterableFields } from './app/modules/ans/ans.constants';
import { Services } from './app/modules/ans/ans.service';
import pick from './shared/pick';

export const generatePdf = async (req: Request, res: Response) => {
    try {
        const filters = pick(req.query, submitionFilterableFields);
        const options = pick(req.query, ['limit', 'page', 'sortOrder', 'sortBy']);
        const result = await Services.getSubmitions(filters, options);

        const doc = new PDFDocument({ size: 'A4', margin: 10 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="submission.pdf"`);

        const fontPath = path.join(process.cwd(), 'NotoSansBengali-Regular.ttf');
        if (fs.existsSync(fontPath)) {
            doc.registerFont('Bangla', fontPath);
            doc.font('Bangla');
        } else {
            console.warn('Bangla font not found, default font will be used');
        }

        // --- Title ---
        doc.fontSize(14).text('Submission PDF', { align: 'center' }); // reduced from 18 → 14
        doc.moveDown(1.5);

        // --- Table Config ---
        const headers = [
            'SL',
            'Date',
            'User',
            'Guardian Name',
            'Mobile',
            'Alternative Mobile',
            'Upazila',
            'Area',
            'Status',
        ];
        const rowHeight = 28; // reduced height
        const startX = 10;
        let startY = 80;
        const columnWidths = [20, 60, 80, 105, 70, 70, 77, 80];

        const drawHeader = () => {
            let x = startX;
            headers.forEach((h, i) => {
                doc.rect(x, startY, columnWidths[i], rowHeight).stroke();
                doc.fontSize(9).text(h, x + 2, startY + 7, {
                    width: columnWidths[i] - 6,
                    align: 'center',
                });
                x += columnWidths[i];
            });
        };

        drawHeader();

        // --- Table Rows ---
        result.data.forEach((d: any, index: number) => {
            startY += rowHeight;

            // Page break
            if (startY + rowHeight > doc.page.height - 50) {
                doc.addPage();
                startY = 50;
                drawHeader();
                startY += rowHeight;
            }

            const survey = d.surveyResponse || [];
            const guardian = survey.find((a: any) => a.question.text == 'Guardian Name')?.answerText || '-';
            const mobile = survey.find((a: any) => a.question.text == 'Mobile')?.answerText || '-';
            const altMobile = survey.find((a: any) => a.question.text == 'Alternative Mobile')?.answerText || '-';
            const upjela = survey.find((a: any) => a.question.text == 'Upazila')?.answerText || '-';
            const area = survey.find((a: any) => a.question.text.trim() === 'Area')?.answerText || '-';
            const status = survey.find((a: any) => a.question.text.trim() === 'Status')?.answerText || '-';

            const rowCells = [
                (index + 1).toString(),
                new Date(d.createdAt).toLocaleDateString(),
                d.user.name,
                guardian,
                mobile,
                altMobile,
                upjela,
                area,
                status,
            ];

            let x = startX;
            rowCells.forEach((cell, i) => {
                doc.rect(x, startY, columnWidths[i], rowHeight).stroke();
                doc.fontSize(8.5).text(cell, x + 3, startY + 5, {
                    width: columnWidths[i] - 6,
                    align: 'center',
                });
                x += columnWidths[i];
            });
        });

        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'PDF generate failed' });
    }
};
