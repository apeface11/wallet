const { Op } = require("sequelize");
const {
  Client,
  codeBlock,
  Collection,
  Events,
  GatewayIntentBits,
} = require("discord.js");
const { Users } = require("./dbObjects.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
const currency = new Collection();

async function addBalance(id, amount, type) {
  const user = currency.get(id);

  if (user) {
    type === "rs3" ? (user.rs3 += Number(amount)) : (user.O7 += Number(amount));
    return user.save();
  }

  const newUser = await Users.create({ user_id: id, rs3: amount, O7: amount });
  currency.set(id, newUser);

  return newUser;
}

function getBalance(id, type) {
  const user = currency.get(id);
  return user ? user[type] : 0;
}

client.once(Events.ClientReady, async () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach((b) => currency.set(b.user_id, b));

  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "balance") {
    const target = interaction.options.getUser("user") ?? interaction.user;

    return interaction.reply(
      `${target.tag} has ${getBalance(target.id).rs3}rs3 and ${
        getBalance(target.id).O7
      }O7`
    );
  } else if (commandName === "transfer") {
    const currentAmount = getBalance(interaction.user.id);
    const transferAmount = interaction.options.getInteger("amount");
    const transferTarget = interaction.options.getUser("user");
    const currencyType = interaction.options.getString("type");

    if (transferAmount > currentAmount[currencyType])
      return interaction.reply(
        `Sorry ${interaction.user}, you only have ${currentAmount}${currencyType}.`
      );
    if (transferAmount <= 0)
      return interaction.reply(
        `Please enter an amount greater than zero, ${interaction.user}.`
      );

    addBalance(interaction.user.id, -transferAmount, currencyType);
    addBalance(transferTarget.id, transferAmount, currencyType);

    return interaction.reply(
      `Successfully transferred ${transferAmount}${currencyType} to ${
        transferTarget.tag
      }. Your current balance is ${getBalance(
        interaction.user.id
      )}${currencyType}`
    );
  }
});

client.login("your-token-goes-here");
