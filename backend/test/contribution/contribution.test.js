const request = require("supertest")
const app = require("../../src/app")

describe("Contribution", () => {

    let token
    let memberId

    beforeEach(async () => {

        await request(app)
            .post("/auth/register")
            .send({
                name: "Lavique Dias",
                email: "lavique@email.com",
                password: "123456",
                role: "user"
            })

        const loginResponse = await request(app)
            .post("/auth/login")
            .send({
                email: "lavique@email.com",
                password: "123456"
            })

        token = loginResponse.body.token

        const memberResponse = await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Member Silva",
                email: "member@email.com",
                phone: "83999992222"
            })

        memberId = memberResponse.body._id
    })

    it("deve criar uma contribuição", async () => {

        const response = await request(app)
            .post("/contribution")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                amount: 150,
                type: "tithe",
                date: "2026-05-23",
                note: "Contribuição mensal"
            })

        expect(response.statusCode)
            .toBe(201)

        expect(response.body.amount)
            .toBe(150)

        expect(response.body.type)
            .toBe("tithe")

        expect(response.body.note)
            .toBe("Contribuição mensal")
    })

    it("não deve criar contribuição sem token", async () => {

        const response = await request(app)
            .post("/contribution")
            .send({
                member: memberId,
                amount: 150,
                type: "tithe",
                date: "2026-05-23"
            })

        expect(response.statusCode)
            .toBe(401)
    })

    it("deve listar contribuições", async () => {

        await request(app)
            .post("/contribution")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                amount: 200,
                type: "offering",
                date: "2026-05-23"
            })

        const response = await request(app)
            .get("/contribution")
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(Array.isArray(response.body))
            .toBe(true)

        expect(response.body.length)
            .toBe(1)
    })

    it("deve buscar contribuição por ID", async () => {

        const createResponse = await request(app)
            .post("/contribution")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                amount: 300,
                type: "missions",
                date: "2026-05-23"
            })

        const contributionId = createResponse.body._id

        const response = await request(app)
            .get(`/contribution/${contributionId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.amount)
            .toBe(300)

        expect(response.body.type)
            .toBe("missions")
    })

    it("deve atualizar uma contribuição", async () => {

        const createResponse = await request(app)
            .post("/contribution")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                amount: 100,
                type: "offering",
                date: "2026-05-23"
            })

        const contributionId = createResponse.body._id

        const response = await request(app)
            .put(`/contribution/${contributionId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                amount: 500,
                note: "Valor atualizado"
            })

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.amount)
            .toBe(500)

        expect(response.body.note)
            .toBe("Valor atualizado")
    })

    it("deve deletar uma contribuição", async () => {

        const createResponse = await request(app)
            .post("/contribution")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                amount: 250,
                type: "tithe",
                date: "2026-05-23"
            })

        const contributionId = createResponse.body._id

        const response = await request(app)
            .delete(`/contribution/${contributionId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.message)
            .toBe("Contribuição deletada com sucesso")
    })

    it("não deve criar contribuição com membro inexistente", async () => {

        const fakeId = "68292c4d3c4e8a7d8f9e9999"

        const response = await request(app)
            .post("/contribution")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: fakeId,
                amount: 100,
                type: "tithe",
                date: "2026-05-23"
            })

        expect(response.statusCode)
            .toBe(400)

        expect(response.body.message)
            .toBe("O membro informado não existe")
    })

    it("não deve criar contribuição com tipo inválido", async () => {

        const response = await request(app)
            .post("/contribution")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                amount: 100,
                type: "invalid-type",
                date: "2026-05-23"
            })

        expect(response.statusCode)
            .toBe(400)

        expect(response.body.errors)
            .toContain("O tipo deve ser: tithe, offering ou missions")
    })

    it("não deve criar contribuição com valor menor que 1", async () => {

        const response = await request(app)
            .post("/contribution")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                amount: 0,
                type: "tithe",
                date: "2026-05-23"
            })

        expect(response.statusCode)
            .toBe(400)

        expect(response.body.errors)
            .toContain("O valor deve ser maior que zero")
    })

    it("não deve buscar contribuição inexistente", async () => {

        const fakeId = "68292c4d3c4e8a7d8f9e9999"

        const response = await request(app)
            .get(`/contribution/${fakeId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(404)

        expect(response.body.message)
            .toBe("Contribuição não econtrada")
    })
})