"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { toast } from "sonner"

export default function BarbershopForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [joinPlatform, setJoinPlatform] = useState(false)
  const [requestWebsite, setRequestWebsite] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          joinPlatform,
          requestWebsite,
        }),
      })

      if (response.ok) {
        toast.success("Formulário enviado com sucesso!")
        setName("")
        setEmail("")
        setPhone("")
        setJoinPlatform(false)
        setRequestWebsite(false)
      } else {
        throw new Error("Falha ao enviar o formulário")
      }
    } catch (error) {
      toast.error("Erro ao enviar o formulário. Tente novamente.")
    }
  }

  const handleJoinPlatformChange = (checked: boolean) => {
    setJoinPlatform(checked)
    if (checked) setRequestWebsite(false)
  }

  const handleRequestWebsiteChange = (checked: boolean) => {
    setRequestWebsite(checked)
    if (checked) setJoinPlatform(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="tel"
        placeholder="Telefone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <div className="flex items-center space-x-2">
        <Checkbox
          id="joinPlatform"
          checked={joinPlatform}
          onCheckedChange={handleJoinPlatformChange}
        />
        <label
          htmlFor="joinPlatform"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Quero fazer parte da plataforma por R$50/mês
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="requestWebsite"
          checked={requestWebsite}
          onCheckedChange={handleRequestWebsiteChange}
        />
        <label
          htmlFor="requestWebsite"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Quero solicitar orçamento para site próprio
        </label>
      </div>
      <Button type="submit">Enviar</Button>
    </form>
  )
}
