/* eslint-disable no-unused-vars */
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"
import Image from "next/image"

interface BarbershopInfo {
  id: string
  name: string
  description: string
  imageUrl: string
  address: string
}

interface EditBarbershopInfoProps {
  barbershop: BarbershopInfo
  onUpdate: (updatedInfo: BarbershopInfo) => void
}

export function EditBarbershopInfo({
  barbershop,
  onUpdate,
}: EditBarbershopInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState(barbershop)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setEditedInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/barbershops/${barbershop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedInfo),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar informações da barbearia")
      }

      const updatedInfo = await response.json()
      onUpdate(updatedInfo)
      setIsEditing(false)
      toast.success("Informações da barbearia atualizadas com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar informações da barbearia:", error)
      toast.error("Erro ao atualizar informações. Tente novamente.")
    }
  }

  if (!isEditing) {
    return (
      <div className="mb-8 rounded-lg bg-gray-800 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-gray-100">
          Informações da Barbearia
        </h2>
        <p className="mb-2 text-gray-300">Nome: {barbershop.name}</p>
        <p className="mb-2 text-gray-300">
          Descrição: {barbershop.description}
        </p>
        <p className="mb-2 text-gray-300">Endereço: {barbershop.address}</p>
        <div className="relative mb-4 h-40 w-full">
          <Image
            src={barbershop.imageUrl}
            alt={barbershop.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <Button onClick={() => setIsEditing(true)}>Editar Informações</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-2xl font-semibold text-gray-100">
        Editar Informações da Barbearia
      </h2>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Nome
        </label>
        <Input
          id="name"
          name="name"
          value={editedInfo.name}
          onChange={handleInputChange}
          className="bg-gray-700 text-gray-100"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Descrição
        </label>
        <Textarea
          id="description"
          name="description"
          value={editedInfo.description}
          onChange={handleInputChange}
          className="bg-gray-700 text-gray-100"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="address"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Endereço
        </label>
        <Input
          id="address"
          name="address"
          value={editedInfo.address}
          onChange={handleInputChange}
          className="bg-gray-700 text-gray-100"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="imageUrl"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          URL da Imagem
        </label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={editedInfo.imageUrl}
          onChange={handleInputChange}
          className="bg-gray-700 text-gray-100"
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit">Salvar Alterações</Button>
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
