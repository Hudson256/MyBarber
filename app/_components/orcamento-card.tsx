import { useState } from "react"

export default function OrcamentoCard() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Formulário de Orçamento <onboarding@resend.dev>",
          to: "seu-email@exemplo.com",
          subject: "Nova solicitação de orçamento",
          text: `
                        Nome: ${formData.nome}
                        Email: ${formData.email}
                        Telefone: ${formData.telefone}
                        Mensagem: ${formData.mensagem}
                    `,
        }),
      })

      if (response.ok) {
        setMessage("Orçamento solicitado com sucesso!")
        setFormData({ nome: "", email: "", telefone: "", mensagem: "" })
      } else {
        setMessage(
          "Ocorreu um erro ao enviar o orçamento. Por favor, tente novamente.",
        )
      }
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error)
      setMessage(
        "Ocorreu um erro ao enviar o orçamento. Por favor, tente novamente.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">
        Solicitar Orçamento de Site Próprio
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="mb-1 block">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="telefone" className="mb-1 block">
            Telefone
          </label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="mensagem" className="mb-1 block">
            Mensagem
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2"
            rows={4}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-green-600 px-4 py-2 text-white transition duration-300 hover:bg-green-700 disabled:bg-green-400"
        >
          {loading ? "Enviando..." : "Solicitar Orçamento"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center ${message.includes("sucesso") ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
