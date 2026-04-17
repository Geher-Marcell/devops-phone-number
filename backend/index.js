const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const szolgaltatokMobilszama = {
	Yettel: 20,
	Telekom: 30,
	Netfone: 31,
	Digi: 50,
	"Vodafone/One": 70,
};

function normalizePhoneNumber(phoneNumber) {
	if (typeof phoneNumber !== "string") {
		return null;
	}

	const digitsOnly = phoneNumber.replace(/\D/g, "");

	if (digitsOnly.startsWith("06") && digitsOnly.length === 11) {
		return `36${digitsOnly.slice(2)}`;
	}

	if (digitsOnly.startsWith("36") && digitsOnly.length === 11) {
		return digitsOnly;
	}

	return null;
}

app.use(express.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}
	next();
});

app.get("/api", (req, res) => {
	res.json(szolgaltatokMobilszama);
});

app.post("/api", (req, res) => {
	const { phone_number } = req.body ?? {};

	if (!phone_number || typeof phone_number !== "string") {
		return res
			.status(400)
			.json({ error: "phone_number must be a non-empty string" });
	}

	const normalizedPhoneNumber = normalizePhoneNumber(phone_number);

	if (!normalizedPhoneNumber) {
		return res
			.status(400)
			.json({ error: "Invalid Hungarian mobile phone number format" });
	}

	const korzet = Number.parseInt(normalizedPhoneNumber.slice(2, 4), 10);
	const szolgaltato = Object.keys(szolgaltatokMobilszama).find(
		(key) => szolgaltatokMobilszama[key] === korzet,
	);

	if (szolgaltato) {
		res.json({ szolgaltato });
	} else {
		res.status(404).json({ error: "Szolgáltató nem található" });
	}
});

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
}

module.exports = {
	app,
	normalizePhoneNumber,
};
