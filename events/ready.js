module.exports = {
	name: 'ready',
	once: true,
	execute(client, discordBot) {
		console.log(`Ready! Logged in as ${discordBot.client.user.tag}`);
	},
};
