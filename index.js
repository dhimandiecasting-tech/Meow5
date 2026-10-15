const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');

// 1. Initialize the client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const PREFIX = '!';

client.once('ready', () => {
    console.log(`⚡ Success! Logged in as ${client.user.tag}`);
});

// 2. Welcome Feature
client.on('guildMemberAdd', member => {
    // Looks for a channel named 'welcome' or 'general' in your server
    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name === 'welcome') || 
                           member.guild.channels.cache.find(ch => ch.name === 'general');
    
    if (!welcomeChannel) return;

    // Sends the welcome greeting
    welcomeChannel.send(`👋 Welcome to the server, ${member}! We are glad to have you here!`);
});

// 3. Chat Commands (Kick and Ban)
client.on('messageCreate', async message => {
    // Ignore bot messages or messages that don't start with the prefix
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // --- BAN COMMAND (!ban @Member reason) ---
    if (command === 'ban') {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.reply("❌ You don't have permission to use this command!");
        }

        const target = message.mentions.members.first();
        if (!target) return message.reply("❌ Please mention a member to ban! Example: `!ban @User reason`");
        
        if (!target.bannable) return message.reply("❌ I cannot ban this user. They might have a higher role than me.");

        const reason = args.join(" ") || "No reason provided";

        try {
            await target.ban({ reason: reason });
            message.channel.send(`🔨 **${target.user.tag}** has been banned. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Something went wrong while trying to ban this user.");
        }
    }

    // --- KICK COMMAND (!kick @Member reason) ---
    if (command === 'kick') {
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply("❌ You don't have permission to use this command!");
        }

        const target = message.mentions.members.first();
        if (!target) return message.reply("❌ Please mention a member to kick! Example: `!kick @User reason`");
        
        if (!target.kickable) return message.reply("❌ I cannot kick this user. They might have a higher role than me.");

        const reason = args.join(" ") || "No reason provided";

        try {
            await target.kick(reason);
            message.channel.send(`⚠️ **${target.user.tag}** has been kicked. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Something went wrong while trying to kick this user.");
        }
    }
});

// 4. Log in your bot
// Put your secret token inside the quotes below
client.login('YOUR_SECRET_BOT_TOKEN_HERE');
