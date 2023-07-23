require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Asset = require("../models/Asset");
const Agency = require("../models/Agency");
const request = require("supertest");
const path = require("path");
const img1Url = path.join(__dirname, "img", "house1.png");
const img2Url = path.join(__dirname, "img", "house2.png");

const createServer = require("../utils/createServer");

const app = createServer();

describe("Users", () => {
	let access_token1, access_token2, id1, id2, idAgency;
	let email1 = "testAsset1@email.com";
	let email2 = "testAsset2@email.com";

	let password = "test";

	beforeAll(async () => {
		const connection = await mongoose.connect(globalThis.__MONGO_URI__, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		if (!connection) {
			console.log("we can't connect to the database");
		}
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	});

	it("should create a new agent 1 and send statuscode 201", async () => {
		const res = await request(app).post("/signin/agent").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body.success).toEqual(
			`New agent with email: ${email1} created!`
		);

		let user = await User.findOne({ email: email1 }).exec();

		expect(user.email).toEqual(email1);
		expect(user.user_type).toEqual("agent");
	});

	it("should create a new agent 2 and send statuscode 201", async () => {
		const res = await request(app).post("/signin/candidate").send({
			email: email2,
			password: password,
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body.success).toEqual(
			`New candidate with email: ${email2} created!`
		);

		let user = await User.findOne({ email: email2 }).exec();

		expect(user.email).toEqual(email2);
		expect(user.user_type).toEqual("candidate");
	});

	it("should create a new asset and send statuscode 201", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.post("/asset")
			.set("Content-Type", "multipart/form-data")
			.set("Authorization", `Bearer ${access_token1}`)
			.field("title", "A asset")
			.field("address", "154 rue du test")
			.field("number_of_rooms", 3)
			.attach("asset_photos", img1Url)
			.attach("asset_photos", img2Url);

		expect(res.statusCode).toEqual(201);

		id1 = res.body._id;
		let asset = await Asset.findById(id1).exec();

		expect(asset.number_of_rooms).toEqual(3);
		expect(asset.images.length).toEqual(2);
	});

	it("should create a new agency and send statuscode 201", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		const name = "A agency asset";
		res = await request(app)
			.post("/agency")
			.set("Content-Type", "multipart/form-data")
			.set("Authorization", `Bearer ${access_token1}`)
			.field("name", name)
			.attach("logo", img1Url);

		expect(res.statusCode).toEqual(201);

		idAgency = res.body._id;

		let agency = await Agency.findById(idAgency).exec();

		expect(agency.name).toEqual(name);
	});

	it("should let a agent register to a agency and get this agency", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.get(`/agency/my`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(204);

		res = await request(app)
			.post(`/agency/register/${idAgency}`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);

		res = await request(app)
			.get(`/agency/my`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body._id).toEqual(idAgency);
	});

	it("should create a second asset and send statuscode 201", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.post("/asset")
			.set("Content-Type", "multipart/form-data")
			.set("Authorization", `Bearer ${access_token1}`)
			.field("title", "A different asset")
			.field("address", "434 rue du test")
			.field("number_of_rooms", 6)
			.attach("asset_photos", img1Url);

		expect(res.statusCode).toEqual(201);

		id2 = res.body._id;
		let asset = await Asset.findById(id2).exec();

		expect(asset.number_of_rooms).toEqual(6);
		expect(asset.images.length).toEqual(1);
	});

	it("should get all the asset and send statuscode 200", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.get("/asset")
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);

		let assets = await Asset.find({}).exec();

		expect(assets.length).toEqual(res.body.length);
	});

	it("should get all the asset of a agency and send statuscode 200", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.get(`/asset/agency/${idAgency}`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);

		expect(res.body.length).toEqual(1);
		expect(res.body[0]._id).toEqual(id2);
	});

	it("should let a agent delete a agency if he was the creator", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.delete(`/agency/${idAgency}`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);

		asset = await Agency.findById(idAgency).exec();
		expect(asset).toEqual(null);
	});

	it("should get a asset by id and send statuscode 200", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.get(`/asset/${id1}`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body._id).toEqual(id1);
		expect(res.body.title).toBeDefined();
	});

	it("should let a candidate applied a asset and get only applieds assets ", async () => {
		let res = await request(app).post("/auth").send({
			email: email2,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.put(`/asset/apply/${id1}`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);

		const myAssetsRes = await request(app)
			.get(`/asset/myApplieds`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(myAssetsRes.statusCode).toEqual(200);
		expect(myAssetsRes.body.length).toEqual(1);
	});

	it("should let a agent modify a asset if he was the creator", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		let asset = await Asset.findById(id1).exec();

		expect(asset.title).toEqual("A asset");

		res = await request(app)
			.put(`/asset/${id1}`)
			.set("Authorization", `Bearer ${access_token1}`)
			.send({ title: "A new title" });

		expect(res.statusCode).toEqual(200);

		asset = await Asset.findById(id1).exec();
		expect(asset.title).toEqual("A new title");
	});

	it("should let a agent delete a asset if he was the creator", async () => {
		let res = await request(app).post("/auth").send({
			email: email1,
			password: password,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.accessToken).toBeDefined();
		access_token1 = res.body.accessToken;

		res = await request(app)
			.delete(`/asset/${id1}`)
			.set("Authorization", `Bearer ${access_token1}`);

		expect(res.statusCode).toEqual(200);

		asset = await Asset.findById(id1).exec();
		expect(asset).toEqual(null);
	});
});
