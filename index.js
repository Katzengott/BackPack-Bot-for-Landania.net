const mineflayer = require('mineflayer')
const Vec3 = require('vec3');
const {
  listeners
} = require('process')
const delay = require('util').promisify(setTimeout)


const bot = mineflayer.createBot({
  host: "landania.net",
  username: "",
  auth: "microsoft",
  version: "1.20"
})

var joinedrealm = false


bot.once('spawn', () => {
  console.log('Der Bot ist gestartet!')
})
bot.on('messagestr', async (msg) => {
  console.log(msg)
  if (!joinedrealm) {
    if (msg.includes("[Landania] Du wirst nun teleportiert")) {
      console.log("Es hat geklappt")
      joinedrealm = true


    }
  }
})
setInterval(async () => {

  if (joinedrealm) {
    await delay(15000)
    bot.chat('/home BOT')
    return
  } else if (!joinedrealm) {
    bot.chat('/joinrealms')


  }

}, 10000)
bot.on('messagestr', async msg => {
  if (msg.includes('Du hast eine Handelsanfrage')) {

    bot.chat(`/trade UsernameDesBesitzers`)
    bot.once('windowOpen', async (window) => {
     
      window.on('updateSlot', async (slot, oldItem, newItem) => {
        console.log("Slots", slot)
        if (slot === 51) {
          console.log('Der Trade wurde akzeptiert')
          bot.clickWindow(47, 1, 0)
          await delay(1000)
          const point = new Vec3(12, 62, 36);

          await bot.lookAt(point);
          await delay(500);


          for (let item of bot.inventory.items()) {
            const chest = await bot.openChest(bot.blockAt(point));
            console.log("Chest open, deposit");
            try {
              await chest.deposit(item.type, 0, item.count);
              await delay(1000)

              console.log("Deposit successful");
              await delay(1000);

            } catch (err) {
              console.log(err)
            }
            chest.close()
          };
          console.log("Alles ist erfolgreich in der Truhe")

        }


      })

    })

  }


})



bot.on('resourcePack', (url, hash) => {
  console.log('resoucePack akzeptiert')
  bot.acceptResourcePack()
  bot.once("windowOpen", (window) => {
    bot.simpleClick.leftMouse(50)
  })
})

bot.on('error', console.log)
bot.on('kicked', console.log)
