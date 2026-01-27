import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, phone, vehicleNumber, documents } = data;

        // Note: For Gmail, you MUST use an "App Password" if 2FA is enabled.
        // These should be set in .env.local on the user's machine/Vercel.
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'rishabhsonawane2007@gmail.com',
                // This is a placeholder. User needs to provide their own App Password.
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || 'rishabhsonawane2007@gmail.com',
            to: 'rishabhsonawane2007@gmail.com',
            subject: `New Driver Registration: ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #eab308;">New Driver Application</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Vehicle Number:</strong> ${vehicleNumber || 'N/A'}</p>
                    <hr />
                    <h3>Documents:</h3>
                    <ul>
                        <li>License: ${documents?.licenseUrl ? 'Uploaded' : 'Missing'}</li>
                        <li>RC Book: ${documents?.rcBookUrl ? 'Uploaded' : 'Missing'}</li>
                        <li>Insurance: ${documents?.insuranceUrl ? 'Uploaded' : 'Missing'}</li>
                    </ul>
                    <p>Please log in to the Admin Dashboard to review these documents.</p>
                </div>
            `,
        };

        if (!process.env.EMAIL_PASS) {
            console.warn("EMAIL_PASS not set. Email not sent, but API called successfully.");
            return NextResponse.json({
                success: true,
                message: "Mock success: EMAIL_PASS not configured. Please add EMAIL_PASS to your .env file."
            });
        }

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Email API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
