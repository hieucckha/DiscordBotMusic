const { SlashCommandBuilder } = require('@discordjs/builders')
const { ChannelType } = require('discord-api-types/v9')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlog')
    .setDescription('All testing')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Set channel to set log')
        .setRequired(true)
        .addChannelType(ChannelType.GuildText)
    ),
  async execute(discordBot, interaction) {
    let channel = interaction.options.getChannel('channel')

    discordBot.logChannelId = channel.id

    discordBot.client.channels.cache.get(discordBot.logChannelId).send('Hello World!')

    await interaction.reply(`Set channel log successful to channel`)
  },
}
