"use client"

import { Button } from "./ui/button"
import { BarbershopService } from "@prisma/client"
import { useState } from "react"
import { toast } from "sonner"
import { deleteService, updateService } from "../_actions/service-actions"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"

interface ServiceItemManageProps {
  service: BarbershopService
}

const ServiceItemManage = ({ service }: ServiceItemManageProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(service.name)
  const [price, setPrice] = useState(service.price.toString())

  const handleDelete = async () => {
    try {
      await deleteService(service.id)
      toast.success("Serviço removido com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao remover serviço.")
    }
  }

  const handleUpdate = async () => {
    try {
      await updateService(service.id, { name, price: parseFloat(price) })
      setIsEditing(false)
      toast.success("Serviço atualizado com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao atualizar serviço.")
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-3">
        {isEditing ? (
          <>
            <div className="flex flex-1 gap-2">
              <Input
                placeholder="Nome do serviço"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Preço"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdate} variant="outline" size="sm">
                Salvar
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <h3 className="font-bold">{service.name}</h3>
              <p className="text-sm">R$ {service.price.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                Editar
              </Button>
              <Button onClick={handleDelete} variant="outline" size="sm">
                Excluir
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ServiceItemManage
