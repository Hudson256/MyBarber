import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [to],
      subject,
      html,
    })
    console.log("Email sent successfully:", response)
  } catch (error) {
    console.error("Error sending email:", error)
  }
}
