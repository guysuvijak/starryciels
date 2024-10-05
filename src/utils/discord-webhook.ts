import axios from 'axios';

import { AttributesPlanetProps } from '@/types/(utils)/Discord';

const profileUrl = process.env.PROFILE_WEBHOOK as string;
const planetUrl = process.env.PLANET_WEBHOOK as string;
const profilePinata = process.env.PROFILE_PINATA as string;
const planetPinata = process.env.PLANET_PINATA as string;

export const sendWebhookDiscordProfile = async (title: string, address: string) => {
    await axios.post(profileUrl, {
        content: null,
        embeds: [
            {
                "title": title,
                "url": `https://core.metaplex.com/explorer/${address}?env=devnet`,
                "color": 5898140,
                "author": {
                    "name": "New Player Create Profile"
                },
                "footer": {
                  "text": "Birthday"
                },
                "timestamp": new Date(),
                "image": {
                  "url": profilePinata
                }
            }
        ]
    });
};

export const sendWebhookDiscordPlanet = async (title: string, nickname: string, address: string, attributes: AttributesPlanetProps) => {
    const { birthday, planet, color, size, surface, cloud, rings, code } = attributes;
    const colorEmbed = parseInt(color, 16);

    await axios.post(planetUrl, {
        content: null,
        embeds: [
            {
                "title": title,
                "description": "- Owner: **" + nickname + "**\n- Planet: **" + planet + "**\n- Color: **#" + color + "**\n- Size: **" + size + "**\n- Surface: **" + surface + "**\n- Cloud: **" + cloud + "**\n- Rings: **" + rings + "**\n- Code: **" + code + "**",
                "url": `https://core.metaplex.com/explorer/${address}?env=devnet`,
                "color": colorEmbed,
                "footer": {
                  "text": "Birthday"
                },
                "timestamp": birthday,
                "thumbnail": {
                  "url": planetPinata
                }
            }
        ]
    });
};