import { Metadata } from "next"
import Header from "../_components/header"

export const metadata: Metadata = {
  title: "Termos de Serviço | My Barber",
  description: "Termos de Serviço da My Barber",
}

export default function TermsOfService() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Termos de Serviço</h1>
        <div className="space-y-4">
          <p>
            Ao acessar ao site My Barber, concorda em cumprir estes termos de
            serviço, todas as leis e regulamentos aplicáveis e concorda que é
            responsável pelo cumprimento de todas as leis locais aplicáveis. Se
            você não concordar com algum desses termos, está proibido de usar ou
            acessar este site. Os materiais contidos neste site são protegidos
            pelas leis de direitos autorais e marcas comerciais aplicáveis.
          </p>
          <h2 className="mt-4 text-xl font-semibold">1. Uso de Licença</h2>
          <p>
            É concedida permissão para baixar temporariamente uma cópia dos
            materiais (informações ou software) no site My Barber, apenas para
            visualização transitória pessoal e não comercial. Esta é a concessão
            de uma licença, não uma transferência de título e, sob esta licença,
            você não pode:
          </p>
          <ul className="list-disc pl-5">
            <li>modificar ou copiar os materiais;</li>
            <li>
              usar os materiais para qualquer finalidade comercial ou para
              exibição pública (comercial ou não comercial);
            </li>
            <li>
              tentar descompilar ou fazer engenharia reversa de qualquer
              software contido no site My Barber;
            </li>
            <li>
              remover quaisquer direitos autorais ou outras notações de
              propriedade dos materiais; ou
            </li>
            <li>
              transferir os materiais para outra pessoa ou &apos;espelhar&apos;
              os materiais em qualquer outro servidor.
            </li>
          </ul>
          <p>
            Esta licença será automaticamente rescindida se você violar alguma
            dessas restrições e poderá ser rescindida por My Barber a qualquer
            momento. Ao encerrar a visualização desses materiais ou após o
            término desta licença, você deve apagar todos os materiais baixados
            em sua posse, seja em formato eletrônico ou impresso.
          </p>
          <h2 className="mt-4 text-xl font-semibold">
            2. Isenção de responsabilidade
          </h2>
          <p>
            Os materiais no site da My Barber são fornecidos &apos;como
            estão&apos;. My Barber não oferece garantias, expressas ou
            implícitas, e, por este meio, isenta e nega todas as outras
            garantias, incluindo, sem limitação, garantias implícitas ou
            condições de comercialização, adequação a um fim específico ou não
            violação de propriedade intelectual ou outra violação de direitos.
          </p>
          <p>
            Além disso, o My Barber não garante ou faz qualquer representação
            relativa à precisão, aos resultados prováveis ou à confiabilidade do
            uso dos materiais em seu site ou de outra forma relacionado a tais
            materiais ou em sites vinculados a este site.
          </p>
          <h2 className="mt-4 text-xl font-semibold">3. Limitações</h2>
          <p>
            Em nenhum caso o My Barber ou seus fornecedores serão responsáveis
            por quaisquer danos (incluindo, sem limitação, danos por perda de
            dados ou lucro ou devido a interrupção dos negócios) decorrentes do
            uso ou da incapacidade de usar os materiais em My Barber, mesmo que
            My Barber ou um representante autorizado da My Barber tenha sido
            notificado oralmente ou por escrito da possibilidade de tais danos.
            Como algumas jurisdições não permitem limitações em garantias
            implícitas, ou limitações de responsabilidade por danos conseqüentes
            ou incidentais, essas limitações podem não se aplicar a você.
          </p>
          <h2 className="mt-4 text-xl font-semibold">
            4. Precisão dos materiais
          </h2>
          <p>
            Os materiais exibidos no site da My Barber podem incluir erros
            técnicos, tipográficos ou fotográficos. My Barber não garante que
            qualquer material em seu site seja preciso, completo ou atual. My
            Barber pode fazer alterações nos materiais contidos em seu site a
            qualquer momento, sem aviso prévio. No entanto, My Barber não se
            compromete a atualizar os materiais.
          </p>
          <h2 className="mt-4 text-xl font-semibold">5. Links</h2>
          <p>
            O My Barber não analisou todos os sites vinculados ao seu site e não
            é responsável pelo conteúdo de nenhum site vinculado. A inclusão de
            qualquer link não implica endosso por My Barber do site. O uso de
            qualquer site vinculado é por conta e risco do usuário.
          </p>
          <h2 className="mt-4 text-xl font-semibold">6. Modificações</h2>
          <p>
            O My Barber pode revisar estes termos de serviço do site a qualquer
            momento, sem aviso prévio. Ao usar este site, você concorda em ficar
            vinculado à versão atual desses termos de serviço.
          </p>
          <h2 className="mt-4 text-xl font-semibold">7. Lei aplicável</h2>
          <p>
            Estes termos e condições são regidos e interpretados de acordo com
            as leis do My Barber e você se submete irrevogavelmente à jurisdição
            exclusiva dos tribunais naquele estado ou localidade.
          </p>
        </div>
      </div>
    </>
  )
}
