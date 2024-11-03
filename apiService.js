// apiService.js
export async function callFlaskAPI(fileUrl) {
  try {
    // send file url to flask
    const response = await fetch(
      `https://uxbwm5kzdkqedl-5000.proxy.runpod.net/analyze?fileUrl=${encodeURIComponent(
        fileUrl
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // check the response staus 200: normal
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // ensure the return type is Json
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      console.log("analysis result:", result);
      return result;
    } else {
      const text = await response.text();
      console.error("non-json response:", text);
      throw new Error("Not Json format return");
    }
  } catch (error) {
    console.error("Error to call Flaks API:", error);
    return null;
  }
}
