import getConfig from 'next/config';
import nodemailer from 'nodemailer';

import { CartItem } from '#src-app/contexts/CartContext';

export interface MarketplaceContactBody {
    email: string;
    phone: string;
    additionalInfo: string;
    name: string;
    cartContent: CartItem[];
}

function getMissingFields<T>(obj: any, interfaceType: { [K in keyof T]: any }): (keyof T)[] {
    return Object.keys(interfaceType).filter(key => !(key in obj)) as (keyof T)[];
}

const { serverRuntimeConfig } = getConfig();

const createMessage = (body: MarketplaceContactBody) => {
    const { additionalInfo, phone, cartContent } = body;
    return `Phone number: ${phone},
Additional Info:
${additionalInfo}
Offers:
${cartContent.map((item, idx) => {
        const { title, quantity, selectedParameters, parameters } = item;
        return `${idx + 1}. ${title} | Amount: ${quantity} | Parameters: ${selectedParameters?.map(parameter => {
            const selectedParameter = parameters.additionalParameters
                ?.find(param => param.name === parameter.name);
            if (!selectedParameter) {
                return null;
            }
            const selectedParameterOption = selectedParameter.options
                .find(option => option.name === parameter.selectedOption)?.name;
            return `${selectedParameter.name} - ${selectedParameterOption}`;
        }).join(' | ')} | Price: ${item.parameters?.basePrice}`;
    }).join(' |\n')}`;
};

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

const getEmailContent = (body: MarketplaceContactBody) => {
    const env = process.env.NODE_ENV;
    const { email, name } = body;
    const content = createMessage(body);
    return {
        from: `${name} <${email}>`,
        to: env === 'production' ? serverRuntimeConfig.mailUsername : 'test@runbotics.com',
        subject: `Message from ${name}`,
        text: content,
    };
};

export default async function handler(req, res) {
    const env = process.env.NODE_ENV;
    if (req.method !== 'POST') return res.status(405);
    const missingFields = getMissingFields<MarketplaceContactBody>(req.body, {} as MarketplaceContactBody);

    if (missingFields.length) {
        return res
            .status(400)
            .json({ message: `Please include: ${missingFields.join(', ')}` });
    }
    const emailContent = getEmailContent(req.body);

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
