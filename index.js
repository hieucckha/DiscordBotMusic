const fs = require('node:fs')
const { Collection } = require('discord.js')
const { token } = require('./config.json')

const { discordBot } = require('./core/client')

// Command files
discordBot.client.commands = new Collection()
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  discordBot.client.commands.set(command.data.name, command)
}

// Event files
const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    discordBot.client.once(event.name, (...args) => event.execute(...args, discordBot))
  } else {
    discordBot.client.on(event.name, (...args) => event.execute(...args, discordBot)) }
}

discordBot.client.login(token)
