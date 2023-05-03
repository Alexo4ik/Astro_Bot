const { Telegraf, session, Scenes, Composer, Markup } = require('telegraf');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN); // token

bot.start(async (ctx) => {
    try {
      await ctx.reply(`${ctx.from.first_name} ` + "Здравствуйте, что бы вы хотели?", Markup.keyboard([
        [`Заказать работу`,],
        ["Узнать подробнее про работы"]
      ]) .oneTime().resize())
} catch (e) {
    console.log(e)
}
});


const startWizard = new Composer() // new scene
startWizard.on('text', async (ctx) => {
    ctx.wizard.state.data = {};
    await ctx.reply(`${ctx.from.first_name} ` + 'Выберите работу',Markup.keyboard([
        ['Натальная карта', 'Разбор профессий'],
        ['Переезд', 'Предназначение'],
        ['Совместимость', 'Соляр'],
        ['Затмение']]))
    return ctx.wizard.next()
})

const jobs = new Composer()
    jobs.on('text', async (ctx) => {
    ctx.wizard.state.data.jobs = ctx.message.text;
    await ctx.reply(`${ctx.from.first_name} ` + 'Введите Ваше имя.')
    return ctx.wizard.next()
})

const firstName = new Composer()
    firstName.on('text', async (ctx) => {
    ctx.wizard.state.data.firstName = ctx.message.text;
    await ctx.reply(`${ctx.from.first_name} ` + 'Введите Вашу дату рождения.')
    return ctx.wizard.next()
})


const birthDate = new Composer()
birthDate.on('text', async (ctx) => {
    ctx.wizard.state.data.birthDate = ctx.message.text;
    await ctx.replyWithHTML(`${ctx.from.first_name} ` + `Введите Ваше место и <i>точное</i> время рождения в формате "00:00".`) 
    return ctx.wizard.next()
});

const placeAndTime = new Composer()
    placeAndTime.on('text', async (ctx) => {
    ctx.wizard.state.data.placeAndTime = ctx.message.text;
    await ctx.reply(`${ctx.from.first_name} ` + 'Введите Ваш номер телефона.') 
    return ctx.wizard.next()
    });

const phoneNumber = new Composer()
    phoneNumber.on('text', async (ctx) => {
    ctx.wizard.state.data.phoneNumber = ctx.message.text;
    await ctx.reply(`${ctx.from.first_name} ` + 'Введите Ваш email.') 
    return ctx.wizard.next()
    });
   
    const CHAT_ID = 462881256;  ////373854503

    const email = new Composer()
    email.on('text', async (ctx) => {
    ctx.wizard.state.data.email = ctx.message.text;
    const wizardData = ctx.wizard.state.data;
    const response =`${ctx.from.first_name}\n${wizardData.jobs}\n${wizardData.firstName}\n${wizardData.birthDate}\n${wizardData.placeAndTime}\n${wizardData.phoneNumber}\n${wizardData.email}\n`
    await ctx.reply(`${ctx.from.first_name} ` + 'Ваши данные обработаны и отосланы @dobrastro_ksenia. Я скоро с Вами свяжусь.\n Чтобы запустить бота опять напишите команду /start');
    await ctx.replyWithHTML(response);
    await ctx.sendMessage(response, {chat_id: CHAT_ID})
    return ctx.scene.leave()
    });
    
bot.hears('Узнать подробнее про работы', ctx =>
{
ctx.replyWithHTML(`${ctx.from.first_name} ` + 'Перейдите пожалуйста на мой сайт и прочитайте описание по кнопке слева 👈.')
ctx.sendMessage(`${ctx.from.first_name} ` + "Просматривает ваш сайт", {chat_id: CHAT_ID})
});
  

const menuScene = new Scenes.WizardScene('sceneWizard', startWizard, jobs, firstName, birthDate, placeAndTime, phoneNumber, email)

const stage = new Scenes.Stage([menuScene])

bot.use(session())
bot.use(stage.middleware())

bot.hears('Заказать работу', (ctx) => ctx.scene.enter('sceneWizard'));

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
