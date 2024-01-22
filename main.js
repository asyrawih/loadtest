import http from "k6/http";
import { SharedArray } from "k6/data";

export let options = {
  scenarios: {
    introspect_token: {
      executor: "ramping-arrival-rate",
      startRate: 50000,
      timeUnit: "1s",
      preAllocatedVUs: 500,
      stages: [
        { target: 50000, duration: "1m" },
        { target: 100000, duration: "2m" },
      ],
    },
  },
};

const csvData = new SharedArray("another data name", function () {
  // Load CSV file and parse it using Papa Parse
  return JSON.parse(open("./token.json"));
});

export default function () {
  const result = csvData[Math.floor(Math.random() * csvData.length)];

  // console.log(csvData[currentIteration]);
  let headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    "Content-Type": "application/json",
  };
  // // // Prepare the request body
  let payload = JSON.stringify({
    // token: data.data.idToken,
    token: result,
  });
  //
  // Send the POST request
  http.post("http://localhost:7777/v1/auth/introspect", payload, {
    headers: headers,
  });
}
