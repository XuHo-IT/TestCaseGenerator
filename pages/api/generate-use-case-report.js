export default async function handler(req, res) {
    try {
      const response = await fetch("http://testcasegenerator.runasp.net/api/Testcase/generate-use-case-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
  
      if (!response.ok) {
        return res.status(response.status).json({ message: "Backend error" });
      }
  
      // forward binary content
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", response.headers.get("Content-Type") || "application/pdf");
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error("Proxy failed:", error);
      res.status(500).json({ message: "Proxy failed", error: error.message });
    }
  }
  