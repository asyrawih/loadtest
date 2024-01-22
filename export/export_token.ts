import parse from "csv-simple-parser"
const fs = require('fs');

const login = async (username) => {
  var myHeaders = new Headers();
  myHeaders.append(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36,gzip(gfe),gzip(gfe)",
  );
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email: username,
    password: "Test1234",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const responnse = await fetch("localhost:7777/v1/auth/login", requestOptions)
  return responnse.json()
}


const loadCsv = async () => {
  const file = Bun.file("../safeya.csv")
  const csv = parse(await file.text(), { header: false });
  const promise = csv.map(async (users) => {
    if (users[1] == undefined) {
      return
    }
    return login(users[1])
  })

  const result = await Promise.all(promise)
  const cleanMap = result.map(res => res?.data?.idToken).filter(token => typeof token !== 'undefined' && token !== null);

  try {
    console.log(cleanMap.length)
    const cleanMapJson = JSON.stringify(cleanMap);
    Bun.write('../token.json', cleanMapJson);
    console.log("Response JSON saved successfully.");
  } catch (error) {
    console.error("Error while saving response JSON:", error);
  }

}

await loadCsv()
