import { Client, GatewayIntentBits } from 'discord.js';
import franc from 'franc';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

const EXCEPTION_CHANNEL = process.env.EXCEPTION_CHANNEL;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.channel.id === EXCEPTION_CHANNEL) return; // skip exception channel
    if (message.author.bot) return; // ignore bots

    const detectedLang = franc(message.content);

    if (detectedLang === 'hin') { // delete Hindi messages
        try {
            await message.delete();
            const warnMsg = await message.channel.send(`${message.author}, Hindi messages are not allowed in this server!`);
            setTimeout(() => warnMsg.delete().catch(() => {}), 5000);
        } catch (err) {
            console.log('Failed to delete message:', err);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
