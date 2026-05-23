const request = require("supertest")
const app = require("../../src/app")

describe("Event", () => {

    let token
    let responsibleId
    let participantId

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

        const responsibleResponse = await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Responsável Silva",
                email: "responsavel@email.com",
                phone: "83999991111"
            })

        responsibleId = responsibleResponse.body._id

        const participantResponse = await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Participante Silva",
                email: "participante@email.com",
                phone: "83999992222"
            })

        participantId = participantResponse.body._id
    })

    it("deve criar um evento", async () => {

        const response = await request(app)
            .post("/event")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Congresso Jovem",
                description: "Evento voltado para jovens",
                date: "2026-12-20",
                responsible: responsibleId,
                participants: [participantId]
            })

        expect(response.statusCode)
            .toBe(201)

        expect(response.body.title)
            .toBe("Congresso Jovem")

        expect(response.body.description)
            .toBe("Evento voltado para jovens")

        expect(response.body.responsible._id)
            .toBe(responsibleId)
    })

    it("não deve criar evento sem token", async () => {

        const response = await request(app)
            .post("/event")
            .send({
                title: "Congresso Jovem",
                description: "Evento voltado para jovens",
                date: "2026-12-20",
                responsible: responsibleId
            })

        expect(response.statusCode)
            .toBe(401)
    })

    it("deve listar eventos", async () => {

        await request(app)
            .post("/event")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Culto de Jovens",
                description: "Evento especial para jovens",
                date: "2026-10-15",
                responsible: responsibleId
            })

        const response = await request(app)
            .get("/event")
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(Array.isArray(response.body))
            .toBe(true)

        expect(response.body.length)
            .toBe(1)
    })

    it("deve buscar evento por ID", async () => {

        const createResponse = await request(app)
            .post("/event")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Retiro Espiritual",
                description: "Evento de retiro espiritual",
                date: "2026-09-10",
                responsible: responsibleId
            })

        const eventId = createResponse.body._id

        const response = await request(app)
            .get(`/event/${eventId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.title)
            .toBe("Retiro Espiritual")
    })

    it("deve atualizar evento", async () => {

        const createResponse = await request(app)
            .post("/event")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Evento Antigo",
                description: "Descrição antiga",
                date: "2026-08-01",
                responsible: responsibleId
            })

        const eventId = createResponse.body._id

        const response = await request(app)
            .put(`/event/${eventId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Evento Novo",
                description: "Descrição nova"
            })

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.title)
            .toBe("Evento Novo")

        expect(response.body.description)
            .toBe("Descrição nova")
    })

    it("deve deletar evento", async () => {

        const createResponse = await request(app)
            .post("/event")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Evento Delete",
                description: "Evento para deletar",
                date: "2026-07-01",
                responsible: responsibleId
            })

        const eventId = createResponse.body._id

        const response = await request(app)
            .delete(`/event/${eventId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.message)
            .toBe("Evento deletado com sucesso")
    })

    it("deve adicionar participante ao evento", async () => {

        const createResponse = await request(app)
            .post("/event")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Evento Participantes",
                description: "Evento para adicionar participantes",
                date: "2026-11-11",
                responsible: responsibleId
            })

        const eventId = createResponse.body._id

        const response = await request(app)
            .put(`/event/add-participant/${eventId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                memberId: participantId
            })

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.participants.length)
            .toBe(1)
    })

    it("deve remover participante do evento", async () => {

        const createResponse = await request(app)
            .post("/event")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Evento Remoção",
                description: "Evento para remover participante",
                date: "2026-06-20",
                responsible: responsibleId,
                participants: [participantId]
            })

        const eventId = createResponse.body._id

        const response = await request(app)
            .put(`/event/remove-participant/${eventId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                memberId: participantId
            })

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.participants.length)
            .toBe(0)
    })

    it("não deve criar evento com responsável inexistente", async () => {

        const fakeId = "68292c4d3c4e8a7d8f9e9999"

        const response = await request(app)
            .post("/event")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Evento Fake",
                description: "Evento com responsável inexistente",
                date: "2026-12-01",
                responsible: fakeId
            })

        expect(response.statusCode)
            .toBe(400)

        expect(response.body.message)
            .toBe("O responsável informado não existe")
    })

    it("não deve buscar evento inexistente", async () => {

        const fakeId = "68292c4d3c4e8a7d8f9e9999"

        const response = await request(app)
            .get(`/event/${fakeId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(404)

        expect(response.body.message)
            .toBe("Eventro não encontrado")
    })

    it("não deve adicionar participante duplicado", async () => {

        const createResponse = await request(app)
            .post("/event")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Evento Duplicado",
                description: "Evento para teste duplicado",
                date: "2026-05-01",
                responsible: responsibleId,
                participants: [participantId]
            })

        const eventId = createResponse.body._id

        const response = await request(app)
            .put(`/event/add-participant/${eventId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                memberId: participantId
            })

        expect(response.statusCode)
            .toBe(400)

        expect(response.body.message)
            .toBe("Este membro já participa do evento")
    })

    it("não deve remover participante inexistente do evento", async () => {

        const createResponse = await request(app)
            .post("/event")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Evento Teste",
                description: "Evento para teste",
                date: "2026-03-01",
                responsible: responsibleId
            })

        const eventId = createResponse.body._id

        const response = await request(app)
            .put(`/event/remove-participant/${eventId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                memberId: participantId
            })

        expect(response.statusCode)
            .toBe(400)

        expect(response.body.message)
            .toBe("Este membro não participa do evento")
    })
})