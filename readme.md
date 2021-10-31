# Aadhar Address Update

Realtime aadhar address updating service.
Submission for [UIDAI Hackathon](https://hackathon.uidai.gov.in/)

---

<p align="center">
  <img src="./public/aadharLogo.jpg" alt = "aadhar logo" />
</p>

---

## Installation

### Requirements

You will need [Nodejs](https://nodejs.org/en/), [MongoDB](https://www.mongodb.com/), [Fast2Sms account](https://www.fast2sms.com/dashboard/dev-api)(For dev messaging)

### Setup

1. Clone this repository.

   ```sh
   git clone https://github.com/karmanya007/AadharAddressUpdate.git
   ```

2. Make config.env file and put the following variables:

   ```sh
   NODE_ENV=development
   PORT=3000
   DATABASE=<Your mongodb connection string>
   DATABASE_PASSWORD=<Your database connection password>
   JWT_SECRET=<Your secret JWT private key (Try to keep it atleast 32 character long)>
   JWT_COOKIE_EXPIRES_IN=90
   JWT_EXPIRES_IN=90d
   F2SMS_KEY=<Your fast2Sms API key>
   HOST_URL=localhost:3000
   ```

3. Open this directory in the terminal and run:

   ```sh
   npm install
   npm i nodemon -g
   npm run dev
   ```

4. Visit http://localhost:3000/
