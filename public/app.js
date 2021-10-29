//console.log(1010);

var ds = {
  uid:"",
  captcha: "",
  captchaTxnId: "",
  otpTxnId:"",
};
const createCaptcha = async () => {
  await axios
    .post(
      "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/get/captcha",{
        langCode: "en",
        captchaLength: "3",
        captchaType: "2"
       },
      { headers: {
        'Content-Type': 'application/json'
        }
      }
    )
    .then(function (response) {
      console.log(response);
      ds.captchaTxnId = response.data.captchaTxnId;
      let str = response.data.captchaBase64String;
      let blob = atob(str);
      //console.log(blob);
      const byteNumbers = new Array(blob.length);
      for (let i = 0; i < blob.length; i++) {
        byteNumbers[i] = blob.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const b64toBlob = (str, contentType = "image/png", sliceSize = 512) => {
        const byteCharacters = atob(str);
        const byteArrays = [];

        for (
          let offset = 0;
          offset < byteCharacters.length;
          offset += sliceSize
        ) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
      };

      const blob1 = b64toBlob(str, "image/png");
      const blobUrl = URL.createObjectURL(blob1);
      //console.log(blobUrl);
      //window.location = blobUrl;
      document.querySelector("#captchaWrapper").innerHTML = "";
      const captchaImg = document.createElement("img");
      captchaImg.src = blobUrl;
      document.querySelector("#captchaWrapper").appendChild(captchaImg);
      // do whatever you want if console is [object object] then stringify the response
    });
};
const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

console.log(uuidv4());


const generateOTP = () => {

const generateOTP = async () => {

  ds.uid = document.querySelector("#aano").value;
  ds.captcha = document.querySelector("#captcha").value;
  console.log(document.querySelector("#aano").value);
  console.log(10);
  console.log(document.querySelector("#captcha").value);

  await axios
    .post(
      "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/generate/aadhaar/otp",

      {
        uidNumber: ds.uid,
        captchaTxnId: ds.captchaTxnId,
        captchaValue: ds.captcha,
        transactionId: "MYAADHAAR:59142477-3f57-465d-8b9a-75b28fe48725",
      },
      {
        "x-request-id": uuidv4(),
        appid: "MYAADHAAR",
        "Accept-Language": "en_in",
        "Content-Type": "application/json ",
      }
    )
    .then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
    const otpfield =document.createElement('input');
    const otpfieldText =document.createElement('p');
   otpfieldText.innerText="Enter OTP";
    document.querySelector("#otpWrapper").innerHTML="";
    document.querySelector("#otpWrapper").appendChild(otpfieldText);
    document.querySelector("#otpWrapper").appendChild(otpfield);
    }
};

const checkCaptcha = (captcha) => {};
createCaptcha();
