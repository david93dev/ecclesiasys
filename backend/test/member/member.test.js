const request = require("supertest")
const app = require("../../src/app")

describe("Member", () => {

    let token

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
    })

    it("deve criar um membro", async () => {

        const response = await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "João Silva",
                email: "joao@email.com",
                phone: "83999998888",
                status: "active"
            })

        expect(response.statusCode).toBe(201)

        expect(response.body.name)
            .toBe("João Silva")

        expect(response.body.email)
            .toBe("joao@email.com")
    })

    it("não deve criar membro sem token", async () => {

        const response = await request(app)
            .post("/member")
            .send({
                name: "João Silva",
                email: "joao@email.com",
                phone: "83999998888"
            })

        expect(response.statusCode).toBe(401)
    })

    it("deve listar membros", async () => {

        await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Maria Silva",
                email: "maria@email.com",
                phone: "83999997777"
            })

        const response = await request(app)
            .get("/member")
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)

        expect(Array.isArray(response.body))
            .toBe(true)

        expect(response.body.length)
            .toBe(1)
    })

    it("deve buscar membro por ID", async () => {

        const createResponse = await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Carlos Silva",
                email: "carlos@email.com",
                phone: "83999996666"
            })

        const memberId = createResponse.body._id

        const response = await request(app)
            .get(`/member/${memberId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)

        expect(response.body.name)
            .toBe("Carlos Silva")
    })

    it("deve atualizar um membro", async () => {

        const createResponse = await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Pedro Silva",
                email: "pedro@email.com",
                phone: "83999995555"
            })

        const memberId = createResponse.body._id

        const response = await request(app)
            .put(`/member/${memberId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Pedro Atualizado"
            })

        expect(response.statusCode).toBe(200)

        expect(response.body.name)
            .toBe("Pedro Atualizado")
    })

    it("deve deletar um membro", async () => {

        const createResponse = await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Delete Silva",
                email: "delete@email.com",
                phone: "83999994444"
            })

        const memberId = createResponse.body._id

        const response = await request(app)
            .delete(`/member/${memberId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)

        expect(response.body.message)
            .toBe("Membro deletado com sucesso!")
    })

    it("não deve buscar membro inexistente", async () => {

        const fakeId = "68292c4d3c4e8a7d8f9e9999"

        const response = await request(app)
            .get(`/member/${fakeId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(404)

        expect(response.body.message)
            .toBe("Membro não encontrado")
    })

    it("não deve criar membro com email duplicado", async () => {

        await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "João Silva",
                email: "duplicado@email.com",
                phone: "83999998888"
            })

        const response = await request(app)
            .post("/member")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Maria Silva",
                email: "duplicado@email.com",
                phone: "83999997777"
            })

        expect(response.statusCode).toBe(400)

        expect(response.body.message)
            .toBe("Este e-mail já está cadastrado!")
    })
})