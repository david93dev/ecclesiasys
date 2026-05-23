const request = require("supertest")
const app = require("../../src/app")

describe("EcclesiasticalProfile", () => {

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

    it("deve criar um perfil eclesiástico", async () => {

        const response = await request(app)
            .post("/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                baptismDate: "2020-05-10",
                baptizedBy: "Pastor João",
                membershipDate: "2020-06-01",
                membershipOrigin: "Igreja Central",
                c: "Membro ativo"
            })

        expect(response.statusCode)
            .toBe(201)

        expect(response.body.member._id)
            .toBe(memberId)

        expect(response.body.baptizedBy)
            .toBe("Pastor João")

        expect(response.body.membershipOrigin)
            .toBe("Igreja Central")
    })

    it("não deve criar perfil sem token", async () => {

        const response = await request(app)
            .post("/profile")
            .send({
                member: memberId
            })

        expect(response.statusCode)
            .toBe(401)
    })

    it("deve listar perfis eclesiásticos", async () => {

        await request(app)
            .post("/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                baptizedBy: "Pastor João"
            })

        const response = await request(app)
            .get("/profile")
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(Array.isArray(response.body))
            .toBe(true)

        expect(response.body.length)
            .toBe(1)
    })

    it("deve buscar perfil por ID", async () => {

        const createResponse = await request(app)
            .post("/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                baptizedBy: "Pastor João"
            })

        const profileId = createResponse.body._id

        const response = await request(app)
            .get(`/profile/${profileId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(response.body._id)
            .toBe(profileId)

        expect(response.body.baptizedBy)
            .toBe("Pastor João")
    })

    it("deve buscar perfil pelo ID do membro", async () => {

        await request(app)
            .post("/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                baptizedBy: "Pastor João"
            })

        const response = await request(app)
            .get(`/profile/member/${memberId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.member._id)
            .toBe(memberId)

        expect(response.body.baptizedBy)
            .toBe("Pastor João")
    })

    it("deve atualizar perfil eclesiástico", async () => {

        const createResponse = await request(app)
            .post("/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                baptizedBy: "Pastor João"
            })

        const profileId = createResponse.body._id

        const response = await request(app)
            .put(`/profile/${profileId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                baptizedBy: "Pastor Pedro",
                membershipOrigin: "Nova Igreja"
            })

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.baptizedBy)
            .toBe("Pastor Pedro")

        expect(response.body.membershipOrigin)
            .toBe("Nova Igreja")
    })

    it("deve deletar perfil eclesiástico", async () => {

        const createResponse = await request(app)
            .post("/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                baptizedBy: "Pastor João"
            })

        const profileId = createResponse.body._id

        const response = await request(app)
            .delete(`/profile/${profileId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(200)

        expect(response.body.message)
            .toBe("Perfil ecles. deletado com sucesso")
    })

    it("não deve criar perfil para membro inexistente", async () => {

        const fakeId = "68292c4d3c4e8a7d8f9e9999"

        const response = await request(app)
            .post("/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: fakeId,
                baptizedBy: "Pastor João"
            })

        expect(response.statusCode)
            .toBe(400)

        expect(response.body.message)
            .toBe("O membro informado não existe")
    })

    it("não deve criar dois perfis para o mesmo membro", async () => {

        await request(app)
            .post("/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                baptizedBy: "Pastor João"
            })

        const response = await request(app)
            .post("/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                member: memberId,
                baptizedBy: "Pastor Pedro"
            })

        expect(response.statusCode)
            .toBe(500)

        expect(response.body.message)
            .toBe("Este membro já possui perfil ecles.")
    })

    it("não deve buscar perfil inexistente", async () => {

        const fakeId = "68292c4d3c4e8a7d8f9e9999"

        const response = await request(app)
            .get(`/profile/${fakeId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(404)

        expect(response.body.message)
            .toBe("Nenhum perfil foi encontrado")
    })

    it("não deve buscar perfil por membro inexistente", async () => {

        const fakeId = "68292c4d3c4e8a7d8f9e9999"

        const response = await request(app)
            .get(`/profile/member/${fakeId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode)
            .toBe(404)

        expect(response.body.message)
            .toBe("Perfil não encontrado para esse membro")
    })
})