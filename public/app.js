//console.log(1010);

var ds = {
  uid: "",
  pno: "",
  captcha: "",
  captchaTxnId: "",
  otpTxnId: "",
  zipData: ""
};
const createCaptcha = async () => {
  await axios
    .post(
      "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/get/captcha",
      {
        langCode: "en",
        captchaLength: "3",
        captchaType: "2",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
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
      console.log(blobUrl);
      //window.location = blobUrl;

      document.querySelector("#captchaWrapper").innerHTML = "";
      const captchaImg = document.createElement("img");
      captchaImg.src = blobUrl;
      document.querySelector("#captchaWrapper").appendChild(captchaImg);
      // do whatever you want if console is [object object] then stringify the response
    });
};
createCaptcha();
const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

console.log(uuidv4());

const generateOTP = async () => {
  ds.uid = document.querySelector("#aano").value;
  ds.pno = document.querySelector("#pno").value;
  ds.captcha = document.querySelector("#captcha").value;
  console.log(document.querySelector("#aano").value);
  console.log(document.querySelector("#pno").value);
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
        ds.otpTxnId = response.data.txnId;
      },
      (error) => {
        console.log(error);
      }
    );

  const otpfield = document.createElement("input");
  otpfield.setAttribute("id", "otpId");
  const otpfieldText = document.createElement("p");

  otpfieldText.innerText = "Enter OTP";
  document.querySelector("#otpWrapper").innerHTML = "";
  document.querySelector("#otpWrapper").appendChild(otpfieldText);
  document.querySelector("#otpWrapper").appendChild(otpfield);
};

const getAuth = async () => {
  try {
    const res = await axios({
      method: "post",
      url: `https://stage1.uidai.gov.in/onlineekyc/getAuth/`,
      data: {
        uid: ds.uid,
        txnId: ds.otpTxnId,
        otp: document.querySelector("#otpId").value,
      },
    });

    if (res.data.status === "y") {
      console.log("Authenticated successfully");

      try {
        const res = await axios({
          method: "post",
          url: `/users/login`,
          data: {
            UID: ds.uid,
            phoneNumber: ds.pno,
            log: `${ds.uid}.log`,
          },
        });

        if (res.data.status === "success") {
          alert("Logged in successfully");
          window.location.replace("/sendConsent");
        }
      } catch (err) {
        alert(err.response.data.message);
      }
    } else {
      console.log("no");
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

const getEkyc = async () => {
  try {
    const res = await axios({
      method: "post",
      url: `https://stage1.uidai.gov.in/eAadhaarService/api/downloadOfflineEkyc`,
      data: {
        uid: ds.uid,
        txnId: ds.otpTxnId,
        otp: document.querySelector("#otpId").value,
        shareCode: "4567",
      },
    });

    if (res.data.status === "Success") {
      console.log("Ekyc request successfully");
      ds.zipData = res.data.eKycXML;

      try {
        const res = await axios({
          method: 'post',
          url: `/users/login`,
          data: {
            UID: ds.uid,
            phoneNumber: ds.pno,
            log: `${ds.uid}.log`,
          },
        });
    
        if (res.data.status === 'success') {
          alert('Logged in successfully');
          window.location.replace("/giveConsent");
        }
      } catch (err) {
        alert(err.response.data.message);
      }
       
    }
    else 
    {
      console.log("no");
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

const sendSMSToLandlord = async () => {
  const llNo = document.querySelector("#llno").value;
  const aano = document.querySelector("#aano").value;
  console.log(llNo);

  try {
    const res = await axios({
      method: "post",
      url: `/users/sendSMS/${llNo}`,
      data: {
        llNo,
        aano,
      },
    });
    window.location.replace(`/users/status/${res}`);
  } catch (err) {
    console.log(1);
  }
 
};

