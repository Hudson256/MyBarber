"use client";
import { useState } from "react";
import { toast } from "sonner";
export default function OrcamentoCard() {
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
        mensagem: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.nome,
                    email: formData.email,
                    phone: formData.telefone,
                    message: formData.mensagem,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || "Orçamento enviado com sucesso!");
                setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
            }
            else {
                throw new Error(data.error || "Falha ao enviar o orçamento");
            }
        }
        catch (error) {
            console.error("Erro ao enviar orçamento:", error);
            toast.error("Ocorreu um erro ao enviar o orçamento. Por favor, tente novamente.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Solicitar Orçamento de Site Próprio
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="mb-1 block text-gray-700 dark:text-gray-300">
            Nome
          </label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-600"/>
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-gray-700 dark:text-gray-300">
            E-mail
          </label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-600"/>
        </div>
        <div>
          <label htmlFor="telefone" className="mb-1 block text-gray-700 dark:text-gray-300">
            Telefone
          </label>
          <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-600"/>
        </div>
        <div>
          <label htmlFor="mensagem" className="mb-1 block text-gray-700 dark:text-gray-300">
            Mensagem
          </label>
          <textarea id="mensagem" name="mensagem" value={formData.mensagem} onChange={handleChange} required className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-600" rows={4}></textarea>
        </div>
        <button type="submit" disabled={isLoading} className="w-full rounded bg-green-600 px-4 py-2 text-white transition duration-300 hover:bg-green-700 disabled:bg-green-400">
          {isLoading ? "Enviando..." : "Solicitar Orçamento"}
        </button>
      </form>
    </div>);
}
