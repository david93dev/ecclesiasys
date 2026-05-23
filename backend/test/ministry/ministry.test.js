const request = require("supertest")
const app = require("../../src/app")

describe("Ministry", () => {

    let token
    let leaderId
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

        const leaderResponse = await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Leader Silva",
                email: "leader@email.com",
                phone: "83999991111"
            })

        leaderId = leaderResponse.body._id

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

    it("deve criar um ministério", async () => {

        const response = await request(app)
            .post("/ministry")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Louvor",
                description: "Ministério responsável pelo louvor",
                leader: leaderId,
                members: [memberId]
            })

        expect(response.statusCode).toBe(201)

        expect(response.body.name)
            .toBe("Louvor")

        expect(response.body.description)
            .toBe("Ministério responsável pelo louvor")

        expect(response.body.leader._id)
            .toBe(leaderId)
    })

    it("não deve criar ministério sem token", async () => {

        const response = await request(app)
            .post("/ministry")
            .send({
                name: "Louvor",
                description: "Ministério responsável pelo louvor",
                leader: leaderId
            })

        expect(response.statusCode)
            .toBe(401)
    })

    it("deve listar ministérios", async () => {

        await request(app)
            .post("/ministry")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Intercessão",
                description: "Ministério responsável pela intercessão",
                leader: leaderId
            })

        const response = await request(app)
            .get("/ministry")
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(Array.isArray(response.body))
            .toBe(true)

        expect(response.body.length)
            .toBe(1)
    })

    it("deve buscar ministério por ID", async () => {

        const createResponse = await request(app)
            .post("/ministry")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Ensino",
                description: "Ministério responsável pelo ensino",
                leader: leaderId
            })

        const ministryId = createResponse.body._id

        const response = await request(app)
            .get(`/ministry/${ministryId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.name)
            .toBe("Ensino")

        expect(response.body.description)
            .toBe("Ministério responsável pelo ensino")
    })

    it("deve atualizar um ministério", async () => {

        const createResponse = await request(app)
            .post("/ministry")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Antigo Nome",
                description: "Ministério responsável pela atualização",
                leader: leaderId
            })

        const ministryId = createResponse.body._id

        const response = await request(app)
            .put(`/ministry/${ministryId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Novo Nome",
                description: "Ministério responsável pela atualização"
            })

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.name)
            .toBe("Novo Nome")

        expect(response.body.description)
            .toBe("Ministério responsável pela atualização")
    })

    it("deve deletar um ministério", async () => {

        const createResponse = await request(app)
            .post("/ministry")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Ministério Delete",
                description: "Ministério responsável pelo Delete",
                leader: leaderId
            })

        const ministryId = createResponse.body._id

        const response = await request(app)
            .delete(`/ministry/${ministryId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.message)
            .toBe("Ministério deletado com sucesso")
    })

    it("deve adicionar membro ao ministério", async () => {

        const createResponse = await request(app)
            .post("/ministry")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Evangelismo",
                description: "Ministério responsável pelo evangelismo",
                leader: leaderId
            })

        const ministryId = createResponse.body._id

        const response = await request(app)
            .put(`/ministry/add-member/${ministryId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                memberId
            })

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.members.length)
            .toBe(1)
    })

    it("deve remover membro do ministério", async () => {

        const createResponse = await request(app)
            .post("/ministry")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Missões",
                description: "Ministério responsável pelas missões",
                leader: leaderId,
                members: [memberId]
            })

        const ministryId = createResponse.body._id

        const response = await request(app)
            .put(`/ministry/remove-member/${ministryId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                memberId
            })

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.members.length)
            .toBe(0)
    })

    it("deve listar membros do ministério", async () => {

        const createResponse = await request(app)
            .post("/ministry")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Jovens",
                description: "Ministério responsável pelos jovens",
                leader: leaderId,
                members: [memberId]
            })

        const ministryId = createResponse.body._id

        const response = await request(app)
            .get(`/ministry/member/${ministryId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.ministryName)
            .toBe("Jovens")

        expect(response.body.totalMembers)
            .toBe(1)
    })

    it("não deve criar ministério com líder inexistente", async () => {

        const fakeId = "68292c4d3c4e8a7d8f9e9999"

        const response = await request(app)
            .post("/ministry")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Louvor",
                description: "Ministério responsável pelo louvor",
                leader: fakeId
            })

        expect(response.statusCode)
            .toBe(400)

        expect(response.body.message)
            .toBe("O líder informado não existe ")
    })
})