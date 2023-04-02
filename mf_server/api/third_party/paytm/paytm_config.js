module.exports = {
  	paytm_config: {
		MID:  'MFOUND83988017598396',// 'VyDQJK40111971950567', //live - VyDQJK40111971950567
		WEBSITE: 'APPSTAGING',
	    CHANNEL_ID: 'WAP',
           GUID:  'df694cd0-c5c1-11ea-a9dd-fa163e429e83',    // '28054249-XXXX-XXXX-af8f-fa163e429e83',   // '6a1d7561-b164-11ea-8708-fa163e429e83' ,
	    INDUSTRY_TYPE_ID: 'Retail',
	    MERCHANT_KEY : 'q9tABDQd20k2oEMk',   // 'eDpON6Cxf_JuL6Sv', //'q9tABDQd20k2oEMk', // 'K3Su382iP2Nje7hn', // live - K3Su382iP2Nje7hn
		CALLBACK_URL : 'https://securegw-stage.paytm.in/theia/paytmCallback', //'https://pguat.paytm.com/paytmchecksum/paytmCallback.jsp', //'https://securegw-stage.paytm.in/theia/paytmCallback', //'http://ec2-18-188-138-130.us-east-2.compute.amazonaws.com:3000/api/v1/paytm/callback',
		TXN_URL : "https://securegw-stage.paytm.in/theia/processTransaction", // live -- "https://securegw.paytm.in/theia/processTransaction"; // for production
	}
}
