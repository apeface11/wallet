const { Op } = require("sequelize");
const {
  Client,
  codeBlock,
  Collection,
  Events,
  GatewayIntentBits,
} = require("discord.js");
const { Users, CurrentBets, OpenHosts } = require("./dbObjects.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
const currency = new Collection();

async function addBalance(id, amount, type) {
  const user = currency.get(id);

  if (user) {
    type === "rs3" ? (user.rs3 += Number(amount)) : type === "07" (user.O7 += Number(amount));
    return user.save();
  }

  const newUser = await Users.create({ user_id: id, rs3: amount, O7: amount });
  currency.set(id, newUser);

  return newUser;
}

function getType() {
  const type 
  return type
}

function getBalance(id, type) {
  const user = currency.get(id);
  return user ? user[type] : 0;
}

function openHost(id, game, active) {
  const user = currency.get(id);
  const active = currency.get(active);
  
  const newHost = await OpenHosts.create({ user_id: id, game: none, active: Boolean });
  currency.set(id, newHost);

  return newHost;
}

function closeHost(id, game) {
  const user = currency.get(id);
  return user ? user[id] : 0;
}

function placeBet(host, id, amount, type) {
  const newBet = await CurrentBets.create({ host: id, user_id: id, amount: amount, type: type});
  currency.set(id, newBet);

  return newBet;
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

  if (commandName === "wallet") {
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
    const currencyType = interaction.options.getString("currency-type");

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
  } else if (commandName === "openhost") {
    const game = interaction.options.getString("game");
    const active = true;
    
    openHost(interaction.user.id, game, active);
    
  } else if (commandName === "close") {
    
    closeHost(interaction.user.id, game, active);
    
  } else if (commandName === "b") {
    const currentAmount = getBalance(interaction.user.id);
    const host = interaction.options.getUser ("user");
    const transferAmount = interaction.options.getInteger("amount");
    const currencyType = interaction.options.getString("currency-type");
    
    if (transferAmount > currentAmount[currencyType])
      return interaction.reply(
        `Sorry ${interaction.user}, you only have ${currentAmount}${currencyType}.`
      );
    if (transferAmount <= 0)
      return interaction.reply(
        `Please enter an amount greater than zero, ${interaction.user}.`
      );

    addBalance(interaction.user.id, -transferAmount, currencyType);
    addBalance(host.id, transferAmount, currencyType);
    placeBet(host.id, interaction.user.id, transferAmount, currencyType);

    return interaction.reply(
      `${interaction.user.id} Successfully placed ${transferAmount}${currencyType} on ${host.tag}.`
    );
    
    
  } else if (commandName === "refund") {
    
  } else if (commandName === "win") {
    
  } else if (commandName === "lose") {
    
  } else if (commandName === "streak") {
    
  }
});

client.login("your-token-goes-here");
