import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { rateLimitMiddleware } from '@/app/middleware/rateLimit';
import { WRITE_RATE_LIMIT } from '@/lib/rate-limit-config';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(request, WRITE_RATE_LIMIT)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: rateLimitResult.headers
        }
      )
    }

    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Testing for valid email via regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send welcome email using Resend
    const { error } = await resend.emails.send({
      from: 'Explain Bytes <newsletter@news.explainbytes.tech>',
      to: [email],
      replyTo: 'support@news.explainbytes.tech',
      subject: 'Welcome to Explain Bytes Newsletter!',
      text: `
Welcome to Explain Bytes! 🎉

Hi Reader!

Thanks for subscribing to the Explain Bytes newsletter. You're now part of a community passionate about learning systems, fundamentals, and deep engineering concepts.

Here's what you can expect:

📚 Deep dives into DBMS, OS, Networking, and System Design
🎯 New flashcards to help you memorize key concepts
💡 System design breakdowns and best practices
🚀 Updates on new features and content

Start Learning: https://explainbytes.tech

If you have any questions or feedback, feel free to reach out. Happy learning!

Best regards,
The Explain Bytes Team

---
© ${new Date().getFullYear()} Explain Bytes. All rights reserved.
      `,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Explain Bytes</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Welcome to Explain Bytes! 🎉</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="font-size: 18px; margin-bottom: 20px; color: #111827;">Hi Reader!</p>
              
              <p style="margin-bottom: 20px; color: #1f2937;">
                Thanks for subscribing to the Explain Bytes newsletter. You're now part of a community passionate about learning systems, fundamentals, and deep engineering concepts.
              </p>
              
              <p style="margin-bottom: 20px; color: #1f2937;">
                Here's what you can expect:
              </p>
              
              <ul style="margin-bottom: 30px; padding-left: 20px; color: #1f2937;">
                <li style="margin-bottom: 10px;">📚 Deep dives into DBMS, OS, Networking, and System Design</li>
                <li style="margin-bottom: 10px;">🎯 New flashcards to help you memorize key concepts</li>
                <li style="margin-bottom: 10px;">💡 System design breakdowns and best practices</li>
                <li style="margin-bottom: 10px;">🚀 Updates on new features and content</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://explainbytes.tech" style="display: inline-block; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Start Learning
                </a>
              </div>
              
              <p style="margin-top: 30px; color: #4b5563; font-size: 14px;">
                If you have any questions or feedback, feel free to reach out. Happy learning!
              </p>
              
              <p style="margin-top: 20px; font-weight: 600; color: #111827;">
                Best regards,<br>
                The Explain Bytes Team
              </p>
            </div>
            
            <div style="background: #ffffff; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
                © ${new Date().getFullYear()} Explain Bytes. All rights reserved.
              </p>
              <p style="color: #6b7280; font-size: 11px; margin: 0;">
                You're receiving this email because you subscribed to Explain Bytes newsletter.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed!' },
      {
        status: 200,
        headers: rateLimitResult.headers
      }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
