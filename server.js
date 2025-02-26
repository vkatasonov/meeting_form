const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configure nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Replace with your email service
    auth: {
        user: 'your-email@gmail.com',  // Replace with your email
        pass: 'your-app-password'       // Replace with your app password
    }
});

app.post('/send-confirmation', async (req, res) => {
    try {
        const { date, time, duration, name, email, guestEmails, language } = req.body;

        // Format the date
        const meetingDate = new Date(date);
        const formattedDate = meetingDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create email HTML content
        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Meeting Confirmation</h2>
                <div style="margin: 20px 0;">
                    <p><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg> ${formattedDate} at ${time} (${duration})</p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg> Booth #___ at [Exhibition name] on-site</p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/></svg> Language: ${language}</p>
                </div>
                <div style="margin: 20px 0;">
                    <p><strong>Attendee:</strong></p>
                    <p>Name: ${name}</p>
                    <p>Email: ${email}</p>
                </div>
                ${guestEmails ? `
                <div style="margin: 20px 0;">
                    <p><strong>Additional Guests:</strong></p>
                    <p>${guestEmails}</p>
                </div>
                ` : ''}
            </div>
        `;

        // Send email to the main attendee
        // Create plain text version of the email
        const textContent = `
Meeting Confirmation

${formattedDate} at ${time} (${duration})
Location: Booth #___ at [Exhibition name] on-site
Language: ${language}

Attendee:
Name: ${name}
Email: ${email}
${guestEmails ? `
Additional Guests:
${guestEmails}
` : ''}`;

        await transporter.sendMail({
            from: '"Meeting Scheduler" <your-email@gmail.com>',
            to: email,
            subject: 'Meeting Confirmation - [Exhibition name]',
            html: emailContent,
            text: textContent
        });


        // // Send emails to guests if any
        // if (guestEmails) {
        //     const guestEmailList = guestEmails.split(',').map(email => email.trim());
        //     for (const guestEmail of guestEmailList) {
        //         await transporter.sendMail({
        //             from: '"Meeting Scheduler" <your-email@gmail.com>',
        //             to: guestEmail,
        //             subject: 'Meeting Invitation - [Exhibition name]',
        //             html: emailContent,
        //             text: textContent
        //         });
        //     }
        // }

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: 'Failed to send email' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});