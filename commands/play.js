const { createReadStream, fs } = require('node:fs')
const { SlashCommandBuilder } = require('@discordjs/builders')
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  VoiceConnectionStatus,
} = require('@discordjs/voice')
const ytdl = require('ytdl-core')

function isValidYoutubeUrl(url) {
  let regex =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/

  if (url.match(regex)) return true

  return false
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music!')
    .addStringOption((option) =>
      option.setName('url').setDescription('URL: Youtube').setRequired(true)
    ),
  async execute(discordBot, interaction) {
    let user = await interaction.member.fetch()
    let channel = await user.voice.channel

    if (!channel) {
      console.log('User not in any voice channel')
      await interaction.reply('You are not in any channel!')
    } else {
      let songURL = interaction.options.getString('url')

      if (!isValidYoutubeUrl(songURL)) {
        try {
          await interaction.reply({
            content: 'The url is invaid!',
            ephemeral: true,
          })
          return
        } catch (error) {
          console.error(error)
          return
        }
      }

      try {
        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        })

        if (!connection) {
          console.log('Connection is null')
          return
        }

        const subscription = connection.subscribe(discordBot.audioPlayer)

        connection.on('stateChange', (oldState, newState) => {
          console.log(
            `Connection transitioned from ${oldState.status} to ${newState.status}`
          )
        })
        discordBot.audioPlayer.on('stateChange', (oldState, newState) => {
          console.log(
            `Audio player transitioned from ${oldState.status} to ${newState.status}`
          )
        })

        connection.on(VoiceConnectionStatus.Ready, () => {
          try {
            const stream = ytdl(songURL)
            let resource = createAudioResource(stream)

            discordBot.audioPlayer.play(resource)

            console.log(`Song is ready to play: ${songURL}`)

            if (discordBot.logChannelId)
              discordBot.client.channels.cache
                .get(discordBot.logChannelId)
                .send(songURL)
          } catch (error) {
            console.error(error)
          }
        })
        connection.on(
          VoiceConnectionStatus.Idle,
          async (oldState, newState) => {}
        )
        connection.on(
          VoiceConnectionStatus.Disconnected,
          async (oldState, newState) => {
            try {
              await Promise.race([
                entersState(
                  connection,
                  VoiceConnectionStatus.Signalling,
                  5_000
                ),
                entersState(
                  connection,
                  VoiceConnectionStatus.Connecting,
                  5_000
                ),
              ])
            } catch (error) {
              console.error(error)
              connection.destroy()
            }
          }
        )

        await interaction.reply({
          content: 'Playing song!',
          emphemeral: true,
        })
      } catch (error) {
        console.error(error)
      }
    }
  },
}
