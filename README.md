# Concore
This is an Apple mobileconfig generator, written in NodeJS.

### Disclaimer
I'm using the mobileconfig node module made by @andris9 , thanks dude!

That means its mostly based on his work, and **he should be credited**.

I merely took his work and made a node script convenient for **me!**

However, if you'll find this usefull, then great! Use it to your hearts content.

I CANNOT vouch for this beautiful piece of danish code, its **not** that well made. 

It made life easier for me as a system-administrator for a company, creating .mobileconfig and distrubuting it, is so much easier then setting it up on the induvidual computers. 

### Install
```
git clone https://github.com/TheSinding/Concore.git
cd Concore
npm install
npm start
```
BTW you need SHA256 keys inside the keys folder, or the script will fail.

If you would like too use your own HTTPS certificates, then add them to the keysfolder, or change the path when asked..

Else you can generate your own keys and certs.

`openssl req -x509 -nodes -days 365 -sha256 -newkey rsa:2048 -keyout keys/key.pem -out keys/cert.pem`



**Profit**


