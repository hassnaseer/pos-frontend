import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authDir = path.join(__dirname, "src/PosData/auth");

const readJson = async (filename) => {
  try {
    const filepath = path.join(authDir, filename);
    const raw = await fs.promises.readFile(filepath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeJson = async (filename, data) => {
  const filepath = path.join(authDir, filename);
  await fs.promises.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
};

const parseBody = async (req) => {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
};

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const usersFile = (await readJson("user.json")) ?? { users: [] };
  const existingUsers = Array.isArray(usersFile.users) ? usersFile.users : [];
  const otpFile = (await readJson("otp.json")) ?? { otps: [] };
  const existingOtps = Array.isArray(otpFile.otps) ? otpFile.otps : [];

  const sendJson = (data, status = 200) => {
    res.writeHead(status);
    res.end(JSON.stringify(data));
  };

  const payload = await parseBody(req);

  if (req.url === "/auth/signup" && req.method === "POST") {
    const { email, password, ownerName, businessName, businessType, country } = payload;

    if (!email || !password) {
      return sendJson({ message: "Email and password are required" }, 400);
    }

    const emailLower = String(email).toLowerCase();
    const exists = existingUsers.find((user) => String(user.email).toLowerCase() === emailLower);

    if (exists) {
      return sendJson({ message: "User already exists" }, 409);
    }

    const newUser = {
      id: Date.now().toString(),
      name: ownerName || emailLower,
      email: emailLower,
      password,
      role: "admin",
      businessName: businessName || "",
      businessType: businessType || "",
      country: country || "",
    };

    existingUsers.push(newUser);
    await writeJson("user.json", { users: existingUsers });

    const responseUser = { ...newUser };
    delete responseUser.password;
    console.log(`✅ User signed up: ${email}`);
    return sendJson(responseUser, 201);
  }

  if (req.url === "/auth/login" && req.method === "POST") {
    const { email, password } = payload;
    const emailLower = String(email).toLowerCase();
    const user = existingUsers.find((item) => String(item.email).toLowerCase() === emailLower);

    if (!user || user.password !== password) {
      return sendJson({ message: "Invalid email or password" }, 401);
    }

    const responseUser = { ...user };
    delete responseUser.password;
    console.log(`✅ User logged in: ${email}`);
    return sendJson(responseUser);
  }

  if (req.url === "/auth/verify-otp" && req.method === "POST") {
    const { email, otp, flow } = payload;
    const emailLower = String(email).toLowerCase();
    const matchingOtp = existingOtps.find(
      (item) => String(item.email).toLowerCase() === emailLower && String(item.code) === String(otp)
    );

    if (!matchingOtp) {
      return sendJson({ success: false, message: "Invalid OTP" }, 401);
    }

    const user = existingUsers.find((item) => String(item.email).toLowerCase() === emailLower);
    const responseUser = user ? { ...user } : null;
    if (responseUser) delete responseUser.password;

    console.log(`✅ OTP verified for: ${email}`);
    return sendJson({ success: true, message: "OTP verified", user: responseUser });
  }

  if (req.url === "/auth/resend-otp" && req.method === "POST") {
    const { email, flow } = payload;
    const emailLower = String(email).toLowerCase();
    const user = existingUsers.find((item) => String(item.email).toLowerCase() === emailLower);

    if (!user) {
      return sendJson({ success: false, message: "User not found" }, 404);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const updateOtps = existingOtps.filter((item) => String(item.email).toLowerCase() !== emailLower);
    updateOtps.push({ email: emailLower, code, flow: flow || "login", createdAt: now });
    await writeJson("otp.json", { otps: updateOtps });

    console.log(`✅ OTP generated for: ${email} | Code: ${code}`);
    return sendJson({ success: true, message: "OTP generated", otp: code });
  }

  if (req.url === "/auth/forgot-password" && req.method === "POST") {
    const { email, flow } = payload;
    const emailLower = String(email).toLowerCase();
    const user = existingUsers.find((item) => String(item.email).toLowerCase() === emailLower);

    if (!user) {
      return sendJson({ success: false, message: "User not found" }, 404);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const updateOtps = existingOtps.filter((item) => String(item.email).toLowerCase() !== emailLower);
    updateOtps.push({ email: emailLower, code, flow: "reset-password", createdAt: now });
    await writeJson("otp.json", { otps: updateOtps });

    console.log(`✅ Reset OTP generated for: ${email} | Code: ${code}`);
    return sendJson({ success: true, message: "Reset OTP sent", otp: code });
  }

  sendJson({ message: "Not found" }, 404);
});

server.listen(4000, () => {
  console.log("🚀 Dev auth server running on http://localhost:4000");
  console.log("📁 JSON files location: src/PosData/auth/");
});
