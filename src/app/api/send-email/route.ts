import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('');

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    await resend.emails.send({
      from: 'Hero Portfolio <onboarding@resend.dev>',
      to: 'hakkanparbej@gmail.com', 
      subject: `New Portfolio Message from ${name}`,
      html: `<p><b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Message:</b> ${message}</p>`
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
