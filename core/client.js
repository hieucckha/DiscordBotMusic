const { Client, Intents } = require('discord.js')
const { createAudioPlayer } = require('@discordjs/voice')

class DiscordBot {
  constructor() {
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
    })
    this.logChannelId = null

    this.audioPlayer = createAudioPlayer()
  }
}

module.exports = {
  discordBot: new DiscordBot(),
}
