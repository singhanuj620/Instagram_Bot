const puppeteer = require('puppeteer');
const BASE_URL = "https://www.instagram.com"
const del=3000;
const TAG_URL = (tag) => 'https://www.instagram.com/explore/tags/'+tag+'/';


const instagram = {
    browser:null,
    page:null,

    initialize : async () => {
        instagram.browser=await puppeteer.launch({headless:false});
        instagram.page=await instagram.browser.newPage();
    },

    login : async (username,password) => {
        await instagram.page.goto(BASE_URL, {waitUntil: 'networkidle2'});
        await instagram.page.waitFor(del);


        let loginButton = await instagram.page.$x('//a[contains(text(),"Log in")]');
        await loginButton[0].click();


        await instagram.page.waitForNavigation({waitUntil:'networkidle2'});
        await instagram.page.waitFor(del);
        await instagram.page.type('input[name="username"]',username,{delay:50});
        await instagram.page.type('input[name="password"]', password, {delay:50});
        let loginButton2 = await instagram.page.$x('//div[contains(text(),"Log In")]');
        await loginButton2[0].click();


        await instagram.page.waitForNavigation({waitUntil: 'networkidle2'});
        await instagram.page.waitFor(del);
        let popup1 = await instagram.page.$x('//button[contains(text(),"Not Now")]');
        await popup1[0].click();
    },

    likeProcess : async ( tags = [] ) => {
        for( let tag of tags){
            await instagram.page.goto(TAG_URL(tag), {waitUntil:'networkidle2'});
            await instagram.page.waitFor(del/2);

            let posts = await instagram.page.$$("article > div:nth-child(3) img");
            for(let i=0 ; i<3 ; i++){
                let post=posts[i];
                await post.click();
                const temp = 'span[aria-label="Like"]';
                await instagram.page.waitFor(del);
                const likeIt = await instagram.page.$(temp);
                const alreadyLiked = await instagram.page.$('span[aria-label="Unlike"]');
                if(alreadyLiked){
                    const closeModel = await instagram.page.$('button[class="ckWGn"]');
                    await closeModel.click();
                }
                else{
                await likeIt.click();
                await instagram.page.waitFor(del/2);
                const closeModel = await instagram.page.$('button[class="ckWGn"]');
                await closeModel.click();
                }
            }
        }
    },
    
    closee: async() => {
        await instagram.browser.close();
    }
}

module.exports=instagram;