const WaLink = require("../models/waLink");
const WaNumber = require("../models/waNumber");
const { authenticateAgent } = require('../utils/authenticateAgent');
const axios = require('axios');

const create_new_wa_link = async (req, res) => {
    const { agentToken, accessToken, businessId } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ error });

        const waLink = new WaLink({
            accessToken,
            businessId,
        });

        await waLink.save();
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ error });
    }
}

const update_wa_link = async (req, res) => {
    const { agentToken, waLinkId, accessToken, businessId } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ error });

        const waLink = await WaLink.findById(waLinkId);
        if (!waLink) return res.status(400).json({ error: `Wa link with id ${waLinkId} does not exist` });

        if(accessToken || businessId) {
            if(accessToken) waLink.accessToken = accessToken;
            if(businessId) waLink.businessId = businessId;
        } else {
            return res.status(400).json({ error: 'No fields to update' }); 
        }
        
        waLink.isAccessActive = false;
        await waLink.save();
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ error });
    }
}

const check_wa_link = async (req, res) => {
    const { waLinkId } = req.body;

    let waLink;
    try {
        waLink = await WaLink.findById(waLinkId);
        if (!waLink) return res.status(400).json({ error: `Wa link with id ${waLinkId} does not exist` });

        const accessToken = waLink.accessToken;
        const businessId = waLink.businessId;

        const response = await axios.get(`https://graph.facebook.com/v20.0/${businessId}/subscribed_apps`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        
        waLink.isAccessActive = true;
        await waLink.save();
        res.status(200).json();

    } catch (error) {
        waLink.isAccessActive = false;
        await waLink.save();
        res.status(500).json({ error: 'Invalid access token' });
    }
}

const fetch_existing_nos = async (req, res) => {
    const { waLinkId } = req.body;

    try {
        const waLink = await WaLink.findById(waLinkId);
        if (!waLink) return res.status(400).json({ error: `Wa link with id ${waLinkId} does not exist` });

        const accessToken = waLink.accessToken;
        const businessId = waLink.businessId;

        console.log('Access Token:', accessToken);
        console.log('Business ID:', businessId);

        const response = await axios.get(`https://graph.facebook.com/v20.0/${businessId}/phone_numbers`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        const existingNos = response.data.data;

        for (let i = 0; i < existingNos.length; i++) {
            const existingNo = existingNos[i];
            const waNumber = await WaNumber.findOne({ number: existingNo.display_phone_number });

            if (!waNumber) {
                const newWaNumber = new WaNumber({
                    number: existingNo.display_phone_number,
                    waLinkId: waLinkId,
                    numberId: existingNo.id,
                });

                await newWaNumber.save();
            }
        }

        res.status(200).json();

    } catch (error) {
        console.error('Error fetching existing numbers:', error.response ? error.response.data : error);
        res.status(500).json({ error: error.response ? error.response.data : 'Unknown error' });
    }
}

module.exports = {
    create_new_wa_link,
    update_wa_link,
    check_wa_link,
    fetch_existing_nos
}