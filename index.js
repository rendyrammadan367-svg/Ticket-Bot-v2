const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
  Events
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ====== GANTI SESUAI SERVER KAMU ======
const PANEL_CHANNEL_ID = "1465598842295685292"; // channel tombol ticket
const CATEGORY_ID = "1465451776479203421";      // category ticket
const ADMIN_ROLE_ID = "1465638029023776929";    // role admin
const GIF_URL = "https://tenor.com/u2zDo2Cn1hC.gif";
// =====================================

let ticketNumber = 0;

client.once(Events.ClientReady, async () => {
  console.log(`✅ BOT ONLINE: ${client.user.tag}`);

  const channel = await client.channels.fetch(PANEL_CHANNEL_ID).catch(() => null);
  if (!channel) return console.log("❌ Channel panel tidak ditemukan");

  const embed = new EmbedBuilder()
    .setColor(0xff4d4d)
    .setTitle("🎫 OPEN TICKET")
    .setDescription("Silahkan sampaikan keperluan mu")
    .setThumbnail(GIF_URL);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("open_ticket")
      .setLabel("Buka Ticket")
      .setEmoji("🎟️")
      .setStyle(ButtonStyle.Success)
  );

  await channel.send({ embeds: [embed], components: [row] });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  // ===== BUKA TICKET =====
  if (interaction.customId === "open_ticket") {
    const existing = interaction.guild.channels.cache.find(
      c => c.topic === interaction.user.id
    );

    if (existing) {
      return interaction.reply({
        content: "❌ Kamu masih punya ticket aktif",
        ephemeral: true
      });
    }

    ticketNumber++;

    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${ticketNumber}`,
      type: ChannelType.GuildText,
      parent: CATEGORY_ID,
      topic: interaction.user.id,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
{
