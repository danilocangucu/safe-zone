import fetch from "node-fetch";

const cookies =
  "XSRF-TOKEN=****; JWT-SESSION=eyJhbGciOiJIUzI1NiJ9.eyJsYXN0UmVmcmVzaFRpbWUiOjE3MDQzNzg3MjQ4NTIsInhzcmZUb2tlbiI6ImIzamRhdnQ2MGhycnBuc3U4YmxjMGFhNzVrIiwianRpIjoiQVl5MWkyaFRtNXhOck9oUEZDSloiLCJzdWIiOiJBWXlSNGs3Ym01eE5yT2hQRXpmcSIsImlhdCI6MTcwMzg1Mjg2MSwiZXhwIjoxNzA0NjM3OTI0fQ.VL--aKLMqA-vz3tCBCQxxUMvgazM2EwdNmiJiJ8eoxw";

fetch(
  "http://159.89.21.149:9000/api/issues/search?componentKeys=danilocangucu_safe-zone_media&types=VULNERABILITY&token=****",
  {
    headers: {
      Cookie: cookies,
    },
  }
)
  .then((response) => response.json())
  .then((data) => {
    console.log("data.total ", data.total);
    if (data.total > 0) {
      console.log(`has issues`);
    } else {
      console.log("no issues");
    }
  })
  .catch((error) => console.error("Error:", error));
