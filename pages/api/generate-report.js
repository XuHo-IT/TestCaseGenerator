export default async function handler(req, res) {
    try {
      // Your real backend endpoint
      const backendUrl = "https://testcasegenerator.runasp.net/api/Testcase/generate-use-case-report";
  
      const response = await fetch(backendUrl, {
        method: req.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
  
      // Forward status + data
      const blob = await response.arrayBuffer();
      res.status(response.status);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.send(Buffer.from(blob));
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ message: "Proxy request failed", error: error.message });
    }
  }
  