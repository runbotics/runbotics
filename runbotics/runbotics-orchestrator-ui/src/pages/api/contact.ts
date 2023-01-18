import getConfig from 'next/config';
import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

import { REQUIRED_FIELDS } from '#src-landing/views/sections/ContactSection/ContactForm/ContactForm';

interface Body {
    email: string;
    company?: string;
    message: string;
    name: string;
}

const validateBody = (body: NextRequest['body']) =>
    REQUIRED_FIELDS.filter((field) => !body[field]);

const { serverRuntimeConfig } = getConfig();

const emailConfig = async (env) => {
    if (env === 'production') {
        return {
            host: serverRuntimeConfig.mailHost,
            port: serverRuntimeConfig.mailPort,
            secure: true,
            auth: {
                user: serverRuntimeConfig.mailUsername,
                pass: serverRuntimeConfig.mailPassword,
            },
        };
    }
    const testAccount = await nodemailer.createTestAccount();
    return {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    };
};

const getEmailContent = ({ email, company, message, name }: Body) => {
    const env = process.env.NODE_ENV;

    return {
        from: `${name} <${email}>`,
        to: env === 'production' ? serverRuntimeConfig.mailUsername : 'test@runbotics.com',
        subject: `Message from ${name} ${company ? 'At ' + company : ''}`,
        text: `${message}`,
    };
};

export default async function handler(req, res) {
    const env = process.env.NODE_ENV;
    if (req.method !== 'POST') return res.status(405);
    const { name, email, message, company } = req.body;
    const missingFields = validateBody(req.body);

    if (missingFields.length) {
        return res
            .status(400)
            .json({ message: `Please include: ${missingFields.join(', ')}` });
    }
    const emailContent = getEmailContent({ name, email, message, company });
    const transporter = nodemailer.createTransport(await emailConfig(env));
    try {
        const info = await transporter.sendMail(emailContent);
        return res.status(200).json({
            message: `Email sent ${env !== 'production' ? nodemailer.getTestMessageUrl(info) : ''
            }`,
        });
    } catch (e) {
        return res.status(500).json({ message: `Something went wrong, ${JSON.stringify(e)}` });
    }
}
