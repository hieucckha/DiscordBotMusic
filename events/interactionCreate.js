module.exports = {
  name: 'interactionCreate',
  async execute(interaction, discordBot) {
    console.log(
      `${interaction.user.tag} in #${interaction.channel.name} triggerd an interaction.`
    )

    if (!interaction.isCommand()) return

    const command = discordBot.client.commands.get(interaction.commandName)

    if (!command) return

    console.log(`With command: ${interaction.commandName}`)

    try {
      await command.execute(discordBot, interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  },
}
