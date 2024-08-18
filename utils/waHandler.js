const axios = require('axios');
const WaLink = require('../models/waLink');
const WaNumber = require('../models/waNumber');

const sendWaMessage = async (customerPhone, message, fromNumber, type="text", messageLink=null) => {
    const waNumber = await WaNumber.findOne({ number: fromNumber });
    if (!waNumber) {
        return { success: false, error: 'Invalid number' };
    }

    const waLink = await WaLink.findById(waNumber.waLinkId);
    if (!waLink) {
        return { success: false, error: 'Invalid number' };
    }
    
    if(type != 'text' && !messageLink){
        return { success: false, error: 'Message link is required for non-text messages' };
    }

    if(type == 'text'){
        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${waNumber.numberId}/messages`,
            {
                messaging_product: "whatsapp",
                to: customerPhone,
                text: {
                    body: message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${waLink.accessToken}`
                }
            }
        );

        if (response.status !== 200) {
            return { success: false, error: response.data };
        }
    } else if(type == 'image'){
        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${waNumber.numberId}/messages`,
            {
                messaging_product: "whatsapp",
                to: customerPhone,
                type: "image",
                image: {
                    link: messageLink,
                    caption: message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${waLink.accessToken}`
                }
            }
        );

        if (response.status !== 200) {
            return { success: false, error: response.data };
        }
    } else if(type == 'document'){
        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${waNumber.numberId}/messages`,
            {
                messaging_product: "whatsapp",
                to: customerPhone,
                type: "document",
                document: {
                    link: messageLink,
                    caption: message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${waLink.accessToken}`
                }
            }
        );

        if (response.status !== 200) {
            return { success: false, error: response.data };
        }
    } else if(type == 'audio'){
        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${waNumber.numberId}/messages`,
            {
                messaging_product: "whatsapp",
                to: customerPhone,
                type: "audio",
                audio: {
                    link: messageLink
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${waLink.accessToken}`
                }
            }
        );

        if (response.status !== 200) {
            return { success: false, error: response.data };
        }
    } else if(type == 'video'){
        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${waNumber.numberId}/messages`,
            {
                messaging_product: "whatsapp",
                to: customerPhone,
                type: "video",
                video: {
                    link: messageLink,
                    caption: message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${waLink.accessToken}`
                }
            }
        );

        if (response.status !== 200) {
            return { success: false, error: response.data };
        }
    } else {
        return { success: false, error: 'Invalid message type' };
    }
    
    return { success: true };
};


module.exports = {
    sendWaMessage
};